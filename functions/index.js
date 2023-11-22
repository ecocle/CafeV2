/* eslint-disable */
const express = require('express');
const history = require('connect-history-api-fallback');
const session = require('express-session');
const os = require('os');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const port = 5000;
const host = '0.0.0.0';
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

require('dotenv').config({ path: '../src/env.env' });
const secretKey = process.env.SECRET_KEY;

app.use(
    session({
        secret: secretKey,
        resave: false,
        saveUninitialized: true,
    })
);

const conn = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
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

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '../dist' });
});

app.get('/api/dataCoffee', async (req, res) => {
    try {
        const queryDataCoffee = 'SELECT * FROM Coffee';
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
        console.error('Error fetching coffee data:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/dataCaffeineFree', async (req, res) => {
    try {
        const queryDataCaffeineFree = 'SELECT * FROM Caffeine_free';
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
        console.error('Error fetching coffee data:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/dataBreakfast', async (req, res) => {
    try {
        const queryDataBreakfast = 'SELECT * FROM Breakfast';
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
        console.error('Error fetching coffee data:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/orders', async (req, res) => {
    const data = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header not found' });
    }

    const token = authHeader.split('Bearer ')[1];
    let username;
    try {
        const decodedToken = jwt.verify(token, secretKey);
        username = decodedToken.username;
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }

    try {
        const result = await orderResult(data, username, conn);
        res.json({ message: 'Order placed successfully', result });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Error placing order' });
    }
});

const orderResult = async (data, username) => {
    let connection;
    try {
        connection = await conn.getConnection();
        const selectedToppings = data.selectedToppings ? data.selectedToppings.join(',') : '';
        const charles = `${data.name}, ${data.selectedSize}, ${selectedToppings}, ${data.price}`;
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
            charles,
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
                                CHARLES)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)
        `;

        const [result] = await conn.query(sql, values);

        const updateSql = 'UPDATE Accounts SET Balance = ? WHERE User_name = ?';
        const updateValues = [data.balance, username];

        await conn.query(updateSql, updateValues);

        return result;
    } catch (error) {
        console.error('Error in SQL execution or balance update:', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

app.post('/api/addMoneyToAcc', async (req, res) => {
    const data = req.body;
    const authHeader = req.headers.authorization;
    let username = req.session.username;

    if (!username && authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1];
        try {
            const decodedToken = jwt.verify(token, secretKey);
            username = decodedToken.username;
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    }

    if (!username) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    // Convert 'amount' to a number
    const amount = parseFloat(data.amount);

    if (username) {
        const updateSql = 'UPDATE Accounts SET Balance = Balance + ? ' + 'WHERE User_name = ?';
        const updateValues = [amount, username];
        await conn.query(updateSql, updateValues);
        res.json({ message: 'Amount added to account' });
    } else {
        res.status(401).json({ error: 'User not logged in' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await conn.execute('SELECT * FROM Accounts WHERE User_name = ?', [username]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ username }, secretKey, { expiresIn: '30d' });
        res.cookie('access_token', token, { maxAge: 30 * 24 * 60 * 60 * 1000 });
        return res.json({ message: 'Login successful', username, token });
    } catch (err) {
        console.error('Error logging in:', err);
        return res.status(500).json({ error: 'Error logging in' });
    }
});

app.post('/api/register', async (req, res) => {
    const { username, password, firstName, lastName } = req.body;

    try {
        // Check if the username already exists
        const checkUserSql = 'SELECT * FROM Accounts WHERE User_name = ?';
        const [existingUser] = await conn.execute(checkUserSql, [username]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const saltRounds = 10;
        const encryptedPassword = await bcrypt.hash(password, saltRounds);

        const insertUserSql = 'INSERT INTO Accounts (User_name, Password, First_name, Last_name) VALUES (?, ?, ?, ?)';
        await conn.execute(insertUserSql, [username, encryptedPassword, firstName, lastName]);

        res.json({ message: 'Account created successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

app.get('/api/user_data', async (req, res) => {
    const authHeader = req.headers.authorization;
    let username = req.session.username;

    if (!username && authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1];
        try {
            const decodedToken = jwt.verify(token, secretKey);
            username = decodedToken.username;
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    }

    if (!username) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const [rows] = await conn.query(
            'SELECT User_name, Balance, First_name, Last_name FROM Accounts WHERE User_name = ?',
            [username]
        );
        if (rows.length > 0) {
            const userData = rows[0];
            res.json({ username: userData.User_name, balance: userData.Balance, firstName: userData.First_name, lastName: userData.Last_name });
        } else {
            res.status(404).json({ error: 'User data not found' });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/drinkData/:itemType/:itemName', async (req, res) => {
    const { itemType, itemName } = req.params;

    try {
        const query = `SELECT * FROM ?? WHERE Name = ?`;
        const [rows] = await conn.query(
            mysql.format(query, [itemType, itemName])
        );

        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).json({ error: 'No orders found for this item' });
        }
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/admin/orders', async (req, res) => {
    try {
        const date = req.query.date;
        let query = 'SELECT * FROM Orders';
        const queryParams = [];

        if (date) {
            query += ' WHERE DATE(order_time) = ?';
            queryParams.push(date);
        }

        query += ' ORDER BY order_time DESC';


        const [results] = await conn.query(query, queryParams);
        res.json({ data: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders', async (req, res) => {
    const authHeader = req.headers.authorization;
    let username = req.session.username;

    if (!username && authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1];
        try {
            const decodedToken = jwt.verify(token, secretKey);
            username = decodedToken.username;
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    }

    if (!username) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const date = req.query.date;
        let query = 'SELECT * FROM Orders WHERE First_name = ?';
        const queryParams = [username];

        if (date) {
            query += ' AND DATE(order_time) = ?';
            queryParams.push(date);
        }

        query += ' ORDER BY order_time DESC';


        const [results] = await conn.query(query, queryParams);
        res.json({ data: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/submit-form', async (req, res) => {
    try {
        const formData = req.body;
        const [results] = await conn.query('INSERT INTO submissions SET ?', formData);
        res.status(200).json({ message: 'Form data submitted successfully', data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.use(history());

app.use(express.static('../dist'));

app.listen(port, host, () => {
    if (host === '0.0.0.0') {
        console.log(`Server is accessible from any network interface`);
        console.log(`- Local: http://localhost:${port}`);

        const interfaces = os.networkInterfaces();
        for (const iface of Object.values(interfaces)) {
            for (const alias of iface) {
                if ('IPv4' !== alias.family || alias.internal !== false) continue;
                console.log(`- Network: http://${alias.address}:${port}`);
            }
        }
    } else {
        console.log(`Server running at http://${host}:${port}/`);
    }
});
