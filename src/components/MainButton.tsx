import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function MainButton({
    text,
    className,
    redirectTo,
    disabled,
    ...props
}: {
    text: string;
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
        <Button
            onClick={handleClick}
            className={` bg-sky-500 transition-all duration-300 hover:bg-sky-600 text-2xl mt-12 p-10 lg:text-4xl md:text-3xl ${className}`}
            disabled={disabled}
            {...props}
        >
            {text}
        </Button>
    );
}
