import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { OutlineButton } from '@/components/OutlineButton';
import { DatePicker } from '@/components/DatePicker';
import { Loading } from '@/components/Loading';
import { Error } from '@/components/Error';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const baseUrl =
    process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

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
}

export default function ViewOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = Cookies.get('token');
    const [isEmpty, setIsEmpty] = useState(false);
    const [date, setDate] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const username = (token && (jwtDecode as any)(token).username) || '';
    const [id, setId] = useState('');
    const totalPrice = orders.reduce((total, order) => total + order.price, 0);

    const handleDateChange = (selectedDate: Date | undefined) => {
        setSelectedDate(selectedDate);
        if (selectedDate) {
            const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
            setDate(formattedDate);
        } else {
            setDate('');
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/user_data`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setId(data.id);
                await fetchOrderData(data.id, date);
            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchOrderData(id, date);
    }, [date]);

    const fetchOrderData = async (id: string, selectedDate = '') => {
        try {
            const endpoint =
                username === 'Admin'
                    ? `${baseUrl}/api/admin/orders`
                    : `${baseUrl}/api/orders`;
            const params = new URLSearchParams();

            if (selectedDate) {
                const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD')
                params.append('date', formattedDate);
            }

            const fullUrl = `${endpoint}?${params.toString()}`;

            const response = await fetch(fullUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    userInformation: id
                },
                credentials: 'include'
            });
            if (!response.ok) {
                setError(
                    'Failed to fetch order data, network response was not ok'
                );
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
            if (transformedData.length === 0) {
                setIsEmpty(true);
            } else {
                setIsEmpty(false);
            }
            setOrders(transformedData);
            setLoading(false);
        } catch (error: any) {
            setError(error.message);
            console.error('Error fetching order data:', error);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen dark:bg-gray-800'>
            {loading ? (
                <Loading message='Fetching order data...' />
            ) : error ? (
                <Error message={error} />
            ) : (
                <div className='overflow-auto'>
                    <div className='flex justify-center space-x-4 mt-4'>
                        <OutlineButton text={'Return Home'} redirectTo='/' />
                    </div>
                    <div className='flex justify-center space-x-4 p-4'>
                        <DatePicker
                            date={selectedDate}
                            onDateChange={handleDateChange}
                        />
                    </div>
                    {isEmpty ? (
                        <div>
                            <span className='text-4xl font-bold flex item-center justify-center'>
                                No Orders Found For This Date
                            </span>
                        </div>
                    ) : (
                        <Table className='dark:bg-gray-900 rounded-lg mx-auto'>
                            <TableHeader className=''>
                                <TableRow>
                                    <TableHead>
                                        Order Time
                                    </TableHead>
                                    <TableHead>
                                        First Name
                                    </TableHead>
                                    <TableHead>
                                        Last Name
                                    </TableHead>
                                    <TableHead>
                                        Coffee Type
                                    </TableHead>
                                    <TableHead>
                                        Temperature
                                    </TableHead>
                                    <TableHead >Toppings</TableHead>
                                    <TableHead >Size</TableHead>
                                    <TableHead >Cup</TableHead>
                                    <TableHead >Comments</TableHead>
                                    <TableHead >Price</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody className=''>
                                {orders.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            {item.order_time}
                                        </TableCell>
                                        <TableCell>
                                            {item.first_name}
                                        </TableCell>
                                        <TableCell>
                                            {item.last_name}
                                        </TableCell>
                                        <TableCell>
                                            {item.coffee_type}
                                        </TableCell>
                                        <TableCell>
                                            {item.temperature}
                                        </TableCell>
                                        <TableCell>
                                            {item.toppings}
                                        </TableCell>
                                        <TableCell>
                                            {item.size}
                                        </TableCell>
                                        <TableCell>
                                            {item.cup}
                                        </TableCell>
                                        <TableCell>
                                            {item.comments}
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            ¥{item.price}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={9}>
                                        Total:
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        ¥{totalPrice}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    )}
                </div>
            )}
            <div className='mt-auto'></div>
            <div className='flex justify-center mt-auto'>
                <p className='text-sm mb-3 text-neutral-700 dark:text-neutral-300'>
                    Made By Shawn
                </p>
            </div>
        </div>
    );
}
