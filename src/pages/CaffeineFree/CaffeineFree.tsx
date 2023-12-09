import { OutlineButton } from "@/components/OutlineButton";
import MenuCard from "@/components/MenuCard";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { MenuSkeleton } from "@/components/MenuSkeleton";

const baseUrl =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

interface CaffeineFreeItem {
    Name: string;
    Price: string;
}

export default function CaffeineFree() {
    const [caffeineFreeList, setCaffeineFreeList] = useState<
        CaffeineFreeItem[]
    >([]);
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get("token");
    const [openSkeleton, setOpenSkeleton] = useState(false);
    const MENU_SKELETON_COUNT = 12;

    useEffect(() => {
        document.title = "MY Cafe | Non Caffeinated";
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
        setOpenSkeleton(true);
        fetch(`${baseUrl}/api/dataCaffeineFree`)
            .then((response) => response.json())
            .then((data: { Name: string; Price: number }[]) => {
                const formattedData: CaffeineFreeItem[] = data.map((item) => ({
                    Name: item.Name,
                    Price: item.Price.toString()
                }));
                setCaffeineFreeList(formattedData);
                setOpenSkeleton(false);
            })
            .catch((error) => {
                throw new Error("Error:", error);
            });
    }, []);

    function renderMenuSkeletons() {
        return Array.from({ length: MENU_SKELETON_COUNT }).map((_, index) =>
            <MenuSkeleton key={`skeleton-${index}`} className="w-80" large />
        );
    }

    function renderMenuCards() {
        return caffeineFreeList.map((caffeineFreeItem, index) => {
            const price = parseFloat(caffeineFreeItem.Price);
            const largePrice = price + 3;
            return <MenuCard
                key={`menucard-${index}`}
                item={caffeineFreeItem.Name}
                mediumPrice={price}
                largePrice={largePrice}
            />;
        });
    }

    return (
        <div className="flex flex-col h-screen items-center bg-neutral-50 dark:bg-gray-800">
            <div className="flex justify-center space-x-4 m-4">
                <OutlineButton text={"Return Home"} redirectTo="/" />
            </div>
            <div className="flex flex-wrap justify-center items-start overflow-auto mt-1 flex-grow w-11/12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {openSkeleton ? renderMenuSkeletons() : renderMenuCards()}
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
