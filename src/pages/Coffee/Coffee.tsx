import { OutlineButton } from "../../components/OutlineButton";
import MenuCard from "@/components/MenuCard";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { MenuSkeleton } from "@/components/MenuSkeleton";

interface CoffeeItem {
    Name: string;
    Price: string;
}

export default function Coffee() {
    const [coffeeList, setCoffeeList] = useState<CoffeeItem[]>([]);
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
        fetch("https://hualangcafe.com/api/dataCoffee")
            .then((response) => response.json())
            .then((data: { Name: string; Price: number }[]) => {
                const formattedData: CoffeeItem[] = data.map((item) => ({
                    Name: item.Name,
                    Price: item.Price.toString(),
                }));
                setCoffeeList(formattedData);
                setOpenSkeleton(false);
            })
            .catch((error) => {
                throw new Error("Error:", error);
            });
    }, []);

    return (
        <div className="flex flex-col h-screen justify-between bg-neutral-50 mt-1">
            <div className="flex justify-center space-x-4 p-4">
                <OutlineButton text={"Return Home"} redirectTo="/" />
            </div>
            <div className="flex flex-wrap justify-center items-start overflow-auto mt-1 flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {openSkeleton
                        ? Array.from({ length: 7 }).map((_, index) => (
                              <MenuSkeleton className=" w-64" />
                          ))
                        : coffeeList.map((coffeeItem, index) => (
                              <MenuCard
                                  key={index}
                                  item={coffeeItem.Name}
                                  mediumPrice={parseFloat(coffeeItem.Price)}
                                  largePrice={parseFloat(coffeeItem.Price) + 3}
                              />
                          ))}
                </div>
            </div>
            <div className="flex justify-center p-4">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Made By Shawn
                </p>
            </div>
        </div>
    );
}
