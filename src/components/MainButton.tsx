import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import React from "react";

export function MainButton({
    children,
    className,
    redirectTo,
    disabled,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    redirectTo?: string;
    disabled?: boolean;
}) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (redirectTo) {
            navigate(redirectTo);
        }
    };
    return (
        <div className={`transition-all duration-300 ${className}`}>
            <Button
                onClick={handleClick}
                className="bg-sky-500 hover:bg-sky-600 text-2xl mt-12 p-10 w-64 lg:w-auto md:w-auto lg:text-4xl md:text-3xl"
                disabled={disabled}
                {...props}
            >
                {children}
            </Button>
        </div>
    );
}
