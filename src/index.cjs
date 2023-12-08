const express = require("express");
const session = require("express-session");
const os = require("os");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const cluster = require("cluster");

const app = express();
const port = 5000;
const host = "0.0.0.0";

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(compression());
app.use(helmet());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

require("dotenv").config({ path: "./env.env" });
const secretKey = process.env.SECRET_KEY;

app.use(
    session({
        secret: secretKey,
        resave: false,
        saveUninitialized: true
    })
);

const conn = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const cache = {};

const getFromCache = (key) => {
    const item = cache[key];
    if (item && item.expiry > Date.now()) {
        return item.value;
    }
    return null;
};

const setInCache = (key, value, duration) => {
    const expiry = Date.now() + duration * 1000;
    cache[key] = { value, expiry };
};

app.use(express.json());

const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header not found" });
    }

    const token = authHeader.split("Bearer ")[1];
    if (!token) {
        return res.status(401).json({ error: "Invalid token" });
    }

    try {
        jwt.verify(token, secretKey);
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

app.get("/api/dataCoffee", async (req, res) => {
    try {
        const queryDataCoffee = "SELECT * FROM Coffee";
        const cachedResults = getFromCache(queryDataCoffee);
        let rows;

        if (cachedResults) {
            rows = cachedResults;
        } else {
            [rows] = await conn.query(queryDataCoffee);
            setInCache(queryDataCoffee, rows, 30 * 60);
        }
        res.json(rows || []);
    } catch (err) {
        console.error("Error fetching coffee data:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/api/dataCaffeineFree", async (req, res) => {
    try {
        const queryDataCaffeineFree = "SELECT * FROM Caffeine_free";
        const cachedResults = getFromCache(queryDataCaffeineFree);
        let rows;

        if (cachedResults) {
            rows = cachedResults;
        } else {
            [rows] = await conn.query(queryDataCaffeineFree);
            setInCache(queryDataCaffeineFree, rows, 30 * 60);
        }

        res.json(rows);
    } catch (err) {
        console.error("Error fetching coffee data:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/api/dataBreakfast", async (req, res) => {
    try {
        const queryDataBreakfast = "SELECT * FROM Breakfast";
        const cachedResults = getFromCache(queryDataBreakfast);
        let rows;

        if (cachedResults) {
            rows = cachedResults;
        } else {
            [rows] = await conn.query(queryDataBreakfast);
            setInCache(queryDataBreakfast, rows, 30 * 60);
        }
        res.json(rows);
    } catch (err) {
        console.error("Error fetching coffee data:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/api/order", async (req, res) => {
    const data = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res
            .status(401)
            .json({ error: "Authorization header not found" });
    }

    const token = authHeader.split("Bearer ")[1];
    if (!token) {
        return res.status(401).json({ error: "Invalid token" });
    }

    try {
        const result = await orderResult(data, conn);
        res.json({ message: "Order placed successfully", result });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ error: "Error placing order" });
    }
});

const orderResult = async (data) => {
    let connection;
    try {
        connection = await conn.getConnection();
        const selectedToppings = data.selectedToppings
            ? data.selectedToppings.join(",")
            : "";
        const values = [
            data.firstName,
            data.lastName,
            data.name,
            data.temperature,
            data.selectedSize,
            selectedToppings,
            data.price,
            data.comments,
            data.useCup,
            data.id
        ];

        const sql = `
            INSERT INTO Orders (First_name,
                                Last_name,
                                Coffee_type,
                                Temperature,
                                Size,
                                Toppings,
                                Price,
                                Order_time,
                                Comments,
                                Cup,
                                Order_ID)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)
        `;

        const [result] = await conn.query(sql, values);

        const updateSql =
            "UPDATE Accounts SET Balance = ? WHERE First_name = ?";
        const updateValues = [data.balance, data.firstName];

        await conn.query(updateSql, updateValues);

        return result;
    } catch (error) {
        console.error("Error in SQL execution or balance update:", error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

app.post("/api/addMoneyToAcc", async (req, res) => {
    const data = req.body;
    const authHeader = req.headers.authorization;
    let username = req.session.username;

    if (!username && authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split("Bearer ")[1];
        try {
            const decodedToken = jwt.verify(token, secretKey);
            username = decodedToken.username;
        } catch (error) {
            return res.status(401).json({ error: "Invalid token" });
        }
    }

    if (!username) {
        return res.status(401).json({ error: "Authentication required" });
    }

    // Convert 'amount' to a number
    const amount = parseFloat(data.amount);

    if (username) {
        const updateSql =
            "UPDATE Accounts SET Balance = Balance + ? " +
            "WHERE User_name = ?";
        const updateValues = [amount, username];
        await conn.query(updateSql, updateValues);
        res.json({ message: "Amount added to account" });
    } else {
        res.status(401).json({ error: "User not logged in" });
    }
});

app.post("/api/signin", async (req, res) => {
    const { username, password } = req.body;

    try {
        const rawCurrentPassword = await conn.execute(
            "SELECT Password FROM Accounts WHERE User_name = ?",
            [username]
        );

        if (!rawCurrentPassword) {
            return res.status(401).json({ error: "Invalid username" });
        }

        const currentPassword = rawCurrentPassword[0][0].Password;

        const isPasswordValid = await bcrypt.compare(password, currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ username }, secretKey, { expiresIn: "30d" });
        return res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Error logging in:", err);
        return res.status(500).json({ error: "Error logging in" });
    }
});

app.post("/api/signUp", async (req, res) => {
    const { username, password, firstName, lastName } = req.body;

    try {
        const checkUserSql = "SELECT * FROM Accounts WHERE User_name = ?";
        const [existingUser] = await conn.execute(checkUserSql, [username]);

        if (existingUser.length > 0) {
            console.log("Username already exists");
            return res.status(400).json({ error: "Username already exists" });
        }

        const saltRounds = 10;
        const encryptedPassword = await bcrypt.hash(password, saltRounds);

        const insertUserSql =
            "INSERT INTO Accounts (User_name, Password, First_name, Last_name) VALUES (?, ?, ?, ?)";
        await conn.execute(insertUserSql, [
            username,
            encryptedPassword,
            firstName,
            lastName
        ]);

        res.json({ message: "Account created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});

app.get("/api/user_data", async (req, res) => {
    const authHeader = req.headers.authorization;
    let username = req.session.username;

    if (!username && authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split("Bearer ")[1];
        try {
            const decodedToken = jwt.verify(token, secretKey);
            username = decodedToken.username;
        } catch (error) {
            return res.status(401).json({ error: "Invalid token" });
        }
    }

    if (!username) {
        return res.status(401).json({ error: "Authentication required" });
    }

    try {
        const [rows] = await conn.query(
            "SELECT User_name, Balance, First_name, Last_name, Password, ID FROM Accounts WHERE User_name = ?",
            [username]
        );
        if (rows.length > 0) {
            const userData = rows[0];
            res.json({
                username: userData.User_name,
                balance: userData.Balance,
                firstName: userData.First_name,
                lastName: userData.Last_name,
                password: userData.Password,
                id: userData.ID
            });
        } else {
            res.status(404).json({ error: "User data not found" });
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put("/api/update_profile", isAuthenticated, async (req, res) => {
    const {firstName, lastName, newUsername, id} = req.body;

    try {
        const query = "UPDATE Accounts SET First_name=?, Last_name=?, User_name=? WHERE id=?";
        await conn.query(query, [firstName, lastName, newUsername, id]);

        const user = {id, firstName, lastName, username: newUsername};

        const newToken = jwt.sign(user.username, secretKey);

        res.status(200).json({ newToken });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Unable to update the user.");
    }
});

app.put("/api/update_password", isAuthenticated, async (req, res) => {
    const authHeader = req.headers.authorization;
    let username = req.session.username;
    let isPasswordValid = false;

    if (!username && authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split("Bearer ")[1];
        try {
            const decodedToken = jwt.verify(token, secretKey);
            username = decodedToken.username;
        } catch (error) {
            return res.status(401).json({ error: "Invalid token" });
        }
    }

    if (!username) {
        return res.status(401).json({ error: "Authentication required" });
    }

    const { enteredCurrentPassword, newPassword, id } = req.body;

    const rawCurrentPassword = await conn.query(
        "SELECT Password FROM Accounts WHERE ID = ?",
        [id]
    );
    const currentPassword = rawCurrentPassword[0][0].Password;
    if (currentPassword && enteredCurrentPassword) {
        bcrypt.compare(
            enteredCurrentPassword,
            currentPassword,
            function() {
                isPasswordValid = true;
            }
        );
    } else {
        console.error("Error updating password");
    }

    if (!isPasswordValid) {
        res.status(401).json({ error: "Password doesn't match" });
    } else {
        try {
            const saltRounds = 10;
            const encryptedNewPassword = await bcrypt.hash(
                newPassword,
                saltRounds
            );

            await conn.query("UPDATE Accounts SET Password = ? WHERE ID = ?", [
                encryptedNewPassword,
                id
            ]);

            res.json({ message: "Password updated successfully" });
        } catch (error) {
            console.error("Error updating user password:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
});

app.get("/api/drinkData/:itemType/:itemName", async (req, res) => {
    const { itemType, itemName } = req.params;

    try {
        const allowedTables = ["Coffee", "Caffeine_free", "Breakfast"];
        if (!allowedTables.includes(itemType)) {
            return res.status(400).json({ error: "Invalid item type" });
        }

        const query = `SELECT *
                       FROM ${itemType}
                       WHERE Name = ?`;
        const [rows] = await conn.query(mysql.format(query, [itemName]));

        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).json({ error: "No orders found for this item" });
        }
    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/admin/orders", async (req, res) => {
    try {
        const date = req.query.date;
        let query = "SELECT * FROM Orders";
        const queryParams = [];

        if (date) {
            query += " WHERE DATE(order_time) = ?";
            queryParams.push(date);
        }

        query += " ORDER BY order_time DESC";

        const [results] = await conn.query(query, queryParams);
        res.json({ data: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/orders", async (req, res) => {
    const authHeader = req.headers.authorization;
    const id = req.headers.userinformation;
    let username = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split("Bearer ")[1];
        try {
            const decodedToken = jwt.verify(token, secretKey);
            username = decodedToken.username;
        } catch (error) {
            return res.status(401).json({ error: "Invalid token" });
        }
    }

    if (!username) {
        return res.status(401).json({ error: "Authentication required" });
    }

    try {
        const date = req.query.date;
        let query = "SELECT * FROM Orders WHERE Order_ID = ?";
        const queryParams = [id];

        if (date) {
            query += " AND DATE(order_time) = ?";
            queryParams.push(date);
        }

        query += " ORDER BY order_time DESC";

        const [results] = await conn.query(query, queryParams);
        res.json({ data: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    app.listen(port, host, () => {
        if (host === "0.0.0.0") {
            console.log(`Server is accessible from any network interface`);
            console.log(`- Local: http://localhost:${port}`);

            const interfaces = os.networkInterfaces();
            for (const iface of Object.values(interfaces)) {
                for (const alias of iface) {
                    if ("IPv4" !== alias.family || alias.internal !== false)
                        continue;
                    console.log(`- Network: http://${alias.address}:${port}`);
                }
            }
        } else {
            console.log(`Server running at http://${host}:${port}/`);
        }
    });
}
