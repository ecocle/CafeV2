import { OutlineButton } from "@/components/OutlineButton";
import MenuCard from "@/components/MenuCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Loading } from "@/components/Loading";

const baseUrl =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

interface BreakfastItem {
    Name: string;
    Price: string;
}

export default function Breakfast() {
    const [breakfastList, setBreakfastList] = useState<BreakfastItem[]>([]);
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get("token");
    const [loading, isLoading] = useState(true);

    useEffect(() => {
        document.title = "MY Cafe | Breakfast";
    }, []);

    useEffect(() => {
        if (!token) {
            navigate("/not-authorized");
        }
    }, []);

    useEffect(() => {
        if (shouldNavigate) {
            navigate("/order");
            setShouldNavigate(false);
        }
    }, [shouldNavigate, navigate]);

    useEffect(() => {
        fetch(`${baseUrl}/api/dataBreakfast`)
            .then((response) => response.json())
            .then((data: { Name: string; Price: number }[]) => {
                const formattedData: BreakfastItem[] = data.map((item) => ({
                    Name: item.Name,
                    Price: item.Price.toString()
                }));
                isLoading(false);
                setBreakfastList(formattedData);
            })
            .catch((error) => {
                throw new Error("Error:", error);
            });
    }, []);

    function renderMenuCard() {
        return breakfastList.map((breakfastItem, index) => {
            const price = parseFloat(breakfastItem.Price);
            return (
                <MenuCard
                    key={`menucard-${index}`}
                    item={breakfastItem.Name}
                    mediumPrice={price}
                />
            );
        });
    }

    return (
        <div className="flex flex-col h-screen justify-center items-center bg-neutral-50 dark:bg-gray-800">
            <div className="flex justify-center space-x-4 m-4">
                <OutlineButton text={"Return Home"} redirectTo="/" />
            </div>
            { loading ? (
                <Loading message="Fetching breakfasts..."/>    
            ) : (
                <div className="flex flex-wrap justify-center items-start overflow-auto mt-1 flex-grow w-11/12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {renderMenuCard()}
                    </div>
                </div>
            )}
            <div className="flex justify-center mb-4">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Made By Shawn
                </p>
            </div>
        </div>
    );
}
