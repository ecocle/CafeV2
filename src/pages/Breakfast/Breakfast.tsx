import { OutlineButton } from "../../components/OutlineButton";
import MenuCard from "@/components/MenuCard";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { MenuSkeleton } from "@/components/MenuSkeleton";
const baseUrl =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

interface BreakfastItem {
    Name: string;
    Price: string;
}
export default function Coffee() {
    const [breakfastList, setBreakfastList] = useState<BreakfastItem[]>([]);
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get("token");
    const [openSkeleton, setOpenSkeleton] = useState(false);

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
        setOpenSkeleton(true);
        fetch(`${baseUrl}/api/dataBreakfast`)
            .then((response) => response.json())
            .then((data: { Name: string; Price: number }[]) => {
                const formattedData: BreakfastItem[] = data.map((item) => ({
                    Name: item.Name,
                    Price: item.Price.toString(),
                }));
                setBreakfastList(formattedData);
                setOpenSkeleton(false);
            })
            .catch((error) => {
                throw new Error("Error:", error);
            });
    }, []);

    return (
        <div className="flex flex-col h-screen justify-between bg-neutral-50 dark:bg-gray-800 mt-1">
            <div className="flex justify-center space-x-4 p-4">
                <OutlineButton text={"Return Home"} redirectTo="/" />
            </div>
            <div className="flex flex-wrap justify-center items-start overflow-auto mt-1 flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {openSkeleton
                        ? Array.from({ length: 5 }).map((_, index) => (
                              <MenuSkeleton key={index} className="w-96" />
                          ))
                        : breakfastList.map((breakfastItem, index) => (
                              <MenuCard
                                  key={index}
                                  item={breakfastItem.Name}
                                  mediumPrice={parseFloat(breakfastItem.Price)}
                              />
                          ))}
                </div>
            </div>
            <div className="flex justify-center mb-4">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Made By Shawn
                </p>
            </div>
        </div>
    );
}
