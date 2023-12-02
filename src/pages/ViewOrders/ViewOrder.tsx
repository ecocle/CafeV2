import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

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
                headers: {
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
            console.log(transformedData);
            setOrders(transformedData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching order data:", error);
        }
    };

    return (
        <div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            First Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Coffee Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Temperature
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Comments
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cup
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
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
        </div>
    );
}
