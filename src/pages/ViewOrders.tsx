import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ViewOrders.module.scss';
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
    TextField
} from '@material-ui/core';
import Cookies from 'js-cookie';

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
    const token = Cookies.get('token');
    const username = Cookies.get('username');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [temporaryDate, setTemporaryDate] = useState('');

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTemporaryDate(event.target.value);
    };

    const handleBlur = async () => {
        setDate(temporaryDate);
        await fetchOrderData(temporaryDate, 0);
    };

    useEffect(() => {
        fetchOrderData('', 100);
    }, []);

    const fetchOrderData = async (selectedDate: string = '', limit: number = 0) => {
        try {
            setLoading(true);
            let endpoint = username === 'Admin' ? `/api/admin/orders` : `/api/orders`;
            const params = new URLSearchParams();
            if (selectedDate) params.append('date', selectedDate);
            if (limit > 0) params.append('limit', limit.toString());
            if (params.toString()) endpoint += `?${params.toString()}`;
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                credentials: 'include'
            });
            if (!response.ok) {
                console.error('Network response was not ok');
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
                cup: order.Cup
            }));
            setOrders(transformedData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching order data:', error);
        }
    };

    return (
        <Box>
            <Backdrop open={loading} style={{ zIndex: 9999 }}>
                <CircularProgress color='inherit' />
            </Backdrop>
            {!loading && (
                <Fade in={!loading}>
                    <Box className={styles.container}>
                        <Button component={Link} variant='outlined' to='/' color='primary' className={styles.button}>
                            Return to Home
                        </Button>
                        <TextField
                            id='date'
                            label='Date'
                            type='date'
                            value={temporaryDate || date} // Show temporaryDate when it exists
                            className={styles.dateField}
                            onChange={handleDateChange}
                            onBlur={handleBlur}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                        <TableContainer component={Paper} className={styles.tableContainer}>
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
                                            <TableCell>{order.order_time}</TableCell>
                                            <TableCell>{order.first_name}</TableCell>
                                            <TableCell>{order.last_name}</TableCell>
                                            <TableCell>{order.coffee_type}</TableCell>
                                            <TableCell>{order.temperature}</TableCell>
                                            <TableCell>{order.toppings}</TableCell>
                                            <TableCell>{order.size}</TableCell>
                                            <TableCell>{order.price}</TableCell>
                                            <TableCell>{order.comments}</TableCell>
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
