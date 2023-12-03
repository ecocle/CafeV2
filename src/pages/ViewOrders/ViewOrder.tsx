import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { OutlineButton } from "@/components/OutlineButton";
import { DatePicker } from "@/components/DatePicker";
import { Loading } from "@/components/Loading";
import { Error } from "@/components/Error";
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
    const username = (token && (jwtDecode as any)(token).username) || "";
    const [id, setId] = useState("");

    const handleDateChange = (date: Date) => {
        setDate(dayjs(date).format("YYYY-MM-DD"));
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/user_data`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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
                    userInformation: id,
                },
                credentials: "include",
            });
            if (!response.ok) {
                setError(
                    "Failed to fetch order data, network response was not ok",
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
                cup: order.Cup,
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
                <div className="w-full overflow-x-auto">
                    <div className="flex justify-center space-x-4 mt-4">
                        <OutlineButton text={"Return Home"} redirectTo="/" />
                    </div>
                    <div className="flex justify-center space-x-4 p-4">
                        <DatePicker onDateChange={handleDateChange} />
                    </div>
                    {isEmpty ? (
                        <div>
                            <span className="text-4xl font-bold flex item-center justify-center">
                                No Orders Found For This Date
                            </span>
                        </div>
                    ) : (
                        <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                                        Order Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                                        First Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                                        Last Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                                        Coffee Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                                        Temperature
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                                        Size
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                                        Comments
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                                        Cup
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-600">
                                {orders.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.order_time}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.first_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.last_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.coffee_type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.temperature}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.size}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.comments}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.cup}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
            <div className="fixed inset-x-3 bottom-0 flex justify-center mt-auto">
                <p className="text-sm mb-3 text-neutral-700 dark:text-neutral-300">
                    Made By Shawn
                </p>
            </div>
        </div>
    );
}
