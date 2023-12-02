import React from "react";
import { useNavigate } from "react-router-dom";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MenuCardProps {
    item: string;
    mediumPrice: number;
    largePrice?: number;
    className?: string;
}

const MenuCard: React.FC<MenuCardProps> = ({
    item,
    mediumPrice,
    largePrice,
    className,
}) => {
    const navigation = useNavigate();

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{item}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>Medium Price: ${mediumPrice}</CardDescription>
                {largePrice && (
                    <CardDescription>
                        Large Price: ${largePrice}
                    </CardDescription>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    className="bg-sky-500 transition-all duration-300 hover:bg-sky-600"
                    onClick={() => navigation(`./order#name=${item}`)}
                >
                    Order
                </Button>
            </CardFooter>
        </Card>
    );
};

export default MenuCard;
