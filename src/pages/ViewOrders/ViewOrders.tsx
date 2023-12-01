import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ViewOrders.module.scss";
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Fade,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface Order {
    id: number;
    order_time: string;
    first_name: string;
    last_name: string;
    coffee_type: string;
    temperature: string;
    toppings: string | null;
    size: string;
    price: number;
    comments: string | null;
    cup: string | null;
    charles: string;
}

const ViewOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const token = Cookies.get("token");
    const [date, setDate] = useState<string>("");
    const username = (token && (jwtDecode as any)(token).username) || "";
    const [id, setId] = useState("");

    const handleDateChange = (newDate: string | null | dayjs.Dayjs) => {
        if (newDate && typeof newDate === "string") {
            setDate(newDate);
        } else if (dayjs.isDayjs(newDate)) {
            const dateString = newDate.format("YYYY-MM-DD");
            setDate(dateString);
        } else {
            setDate("");
        }
    };

    useEffect(() => {
        setLoading(true);
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/user_data", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setId(data.id);
                await fetchOrderData(data.id, date);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchOrderData(id, date);
    }, [date]);

    const fetchOrderData = async (id: string, selectedDate = "") => {
        try {
            const endpoint =
                username === "Admin" ? "/api/admin/orders" : "/api/orders";
            const params = new URLSearchParams();

            if (selectedDate) {
                const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
                params.append("date", formattedDate);
            }

            const fullUrl = `${endpoint}?${params.toString()}`;

            const response = await fetch(fullUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    userInformation: id,
                },
                credentials: "include",
            });
            if (!response.ok) {
                console.error("Network response was not ok");
            }
            const rawData = await response.json();
            const transformedData = rawData.data.map((order: any) => ({
                id: order.ID,
                order_time: order.Order_time,
                first_name: order.First_name,
                last_name: order.Last_name,
                coffee_type: order.Coffee_type,
                temperature: order.Temperature,
                toppings: order.Toppings,
                size: order.Size,
                price: parseFloat(order.Price),
                comments: order.Comments,
                cup: order.Cup,
            }));
            setOrders(transformedData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching order data:", error);
        }
    };

    return (
        <Box>
            <Backdrop open={loading} style={{ zIndex: 9999 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {!loading && (
                <Fade in={!loading}>
                    <Box className={styles.container}>
                        <Button
                            component={Link}
                            variant="outlined"
                            to="/"
                            color="primary"
                            className={styles.button}
                        >
                            Return to Home
                        </Button>
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="ch"
                        >
                            <DatePicker
                                label="Date"
                                value={dayjs(date)}
                                onChange={(newValue) =>
                                    handleDateChange(newValue)
                                }
                            />
                        </LocalizationProvider>
                        <TableContainer
                            component={Paper}
                            className={styles.tableContainer}
                        >
                            <Table className={styles.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Order Time</TableCell>
                                        <TableCell>First Name</TableCell>
                                        <TableCell>Last Name</TableCell>
                                        <TableCell>Coffee Type</TableCell>
                                        <TableCell>Temperature</TableCell>
                                        <TableCell>Toppings</TableCell>
                                        <TableCell>Size</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Comments</TableCell>
                                        <TableCell>Cup</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>
                                                {order.order_time}
                                            </TableCell>
                                            <TableCell>
                                                {order.first_name}
                                            </TableCell>
                                            <TableCell>
                                                {order.last_name}
                                            </TableCell>
                                            <TableCell>
                                                {order.coffee_type}
                                            </TableCell>
                                            <TableCell>
                                                {order.temperature}
                                            </TableCell>
                                            <TableCell>
                                                {order.toppings}
                                            </TableCell>
                                            <TableCell>{order.size}</TableCell>
                                            <TableCell>{order.price}</TableCell>
                                            <TableCell>
                                                {order.comments}
                                            </TableCell>
                                            <TableCell>{order.cup}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Fade>
            )}
        </Box>
    );
};

export default ViewOrders;
