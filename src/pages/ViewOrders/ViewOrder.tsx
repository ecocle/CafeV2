import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { OutlineButton } from "@/components/OutlineButton";
import { DatePicker } from "@/components/DatePicker";
import { Loading } from "@/components/Loading";
import { Error } from "@/components/Error";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const baseUrl =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

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
    const [error, setError] = useState("");
    const token = Cookies.get("token");
    const [isEmpty, setIsEmpty] = useState(false);
    const [date, setDate] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const username = (token && (jwtDecode as any)(token).username) || "";
    const [id, setId] = useState("");
    const totalPrice = orders.reduce((total, order) => total + order.price, 0);

    useEffect(() => {
        document.title = "MY Cafe | View Orders";
    }, []);

    const handleDateChange = (selectedDate: Date | undefined) => {
        setSelectedDate(selectedDate);
        if (selectedDate) {
            const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
            setDate(formattedDate);
        } else {
            setDate("");
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

    const fetchOrderData = async (id: string, selectedDate = "") => {
        try {
            const endpoint =
                username === "Admin"
                    ? `${baseUrl}/api/admin/orders`
                    : `${baseUrl}/api/orders`;
            const params = new URLSearchParams();

            if (selectedDate) {
                const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
                params.append("date", formattedDate);
            }

            const fullUrl = `${endpoint}?${params.toString()}`;

            const response = await fetch(fullUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    userInformation: id
                },
                credentials: "include"
            });
            if (!response.ok) {
                setError(
                    "Failed to fetch order data, network response was not ok"
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
            console.error("Error fetching order data:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {loading ? (
                <Loading message="Fetching order data..." />
            ) : error ? (
                <Error message={error} />
            ) : (
                <div className="overflow-auto">
                    <div className="flex justify-center space-x-4 mt-4">
                        <OutlineButton text={"Return Home"} redirectTo="/" />
                    </div>
                    <div className="flex justify-center space-x-4 m-4">
                        <DatePicker
                            date={selectedDate}
                            onDateChange={handleDateChange}
                        />
                    </div>
                    {isEmpty ? (
                        <div>
                            <span className="text-4xl font-bold flex item-center justify-center">
                                No Orders Found For This Date
                            </span>
                        </div>
                    ) : (
                        <Table className="dark:bg-gray-800 rounded-lg mx-auto w-11/12 block">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hidden lg:table-cell md:table-cell">
                                        Order Time
                                    </TableHead>
                                    <TableHead className="hidden lg:table-cell md:table-cell">
                                        First Name
                                    </TableHead>
                                    <TableHead className="hidden lg:table-cell md:table-cell">
                                        Last Name
                                    </TableHead>
                                    <TableHead className="hidden lg:table-cell md:table-cell">
                                        Type
                                    </TableHead>
                                    <TableHead className="hidden lg:table-cell md:table-cell">
                                        Temperature
                                    </TableHead>
                                    <TableHead className="hidden lg:table-cell md:table-cell">Toppings</TableHead>
                                    <TableHead className="hidden lg:table-cell md:table-cell">Size</TableHead>
                                    <TableHead className="hidden lg:table-cell md:table-cell">Comments</TableHead>
                                    <TableHead className="hidden lg:table-cell md:table-cell">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-gray-700">
                                        <TableCell dataCell="Order Time" className="lg:table-cell md:table-cell lg:before:content-none md:before:content-none before:content-[attr(dataCell)_':_'] before:font-bold block ">
                                            {item.order_time}
                                        </TableCell>
                                        <TableCell dataCell="First Name" className="lg:table-cell md:table-cell lg:before:content-none md:before:content-none before:content-[attr(dataCell)_':_'] before:font-bold block">
                                            {item.first_name}
                                        </TableCell>
                                        <TableCell dataCell="Last Name" className="lg:table-cell md:table-cell lg:before:content-none md:before:content-none before:content-[attr(dataCell)_':_'] before:font-bold block">
                                            {item.last_name}
                                        </TableCell>
                                        <TableCell dataCell="Type" className="lg:table-cell md:table-cell lg:before:content-none md:before:content-none before:content-[attr(dataCell)_':_'] before:font-bold block">
                                            {item.coffee_type}
                                        </TableCell>
                                        <TableCell dataCell="Temperature" className="lg:table-cell md:table-cell lg:before:content-none md:before:content-none before:content-[attr(dataCell)_':_'] before:font-bold block">
                                            {item.temperature}
                                        </TableCell>
                                        <TableCell dataCell="Toppings" className="lg:table-cell md:table-cell lg:before:content-none md:before:content-none before:content-[attr(dataCell)_':_'] before:font-bold block">
                                            {item.toppings}
                                        </TableCell>
                                        <TableCell dataCell="Size" className="lg:table-cell md:table-cell lg:before:content-none md:before:content-none before:content-[attr(dataCell)_':_'] before:font-bold block">
                                            {item.size}
                                        </TableCell>
                                        <TableCell dataCell="Comments" className="lg:table-cell md:table-cell lg:before:content-none md:before:content-none before:content-[attr(dataCell)_':_'] before:font-bold block">
                                            {item.comments}
                                        </TableCell>
                                        <TableCell dataCell="Price" className="lg:text-right md:text-right lg:table-cell md:table-cell lg:before:content-none md:before:content-none before:content-[attr(dataCell)_':_'] before:font-bold block">
                                            ¥{item.price}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter className="bg-gray-900 lg:table-cell md:table-cell block">
                                <TableRow>
                                    <TableCell colSpan={8}>
                                        Total:
                                    </TableCell>
                                    <TableCell className="lg:text-right md:text-right lg:table-cell md:table-cell block">
                                        ¥{totalPrice}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    )}
                </div>
            )}
            <div className="mt-auto"></div>
            <div className="flex justify-center mb-4 mt-2">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Made By Shawn
                </p>
            </div>
        </div>
    );
}
