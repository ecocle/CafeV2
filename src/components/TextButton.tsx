import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function TextButton({
    text,
    className,
    redirectTo,
}: {
    text: string;
    className?: string;
    redirectTo?: string;
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
            className={`bg-transparent text-violet-500 transition-all duration-300 hover:bg-violet-100 w-auto h-8 text-base ${className}`}
        >
            {text}
        </Button>
    );
}
