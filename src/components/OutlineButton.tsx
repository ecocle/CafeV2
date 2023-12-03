import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function OutlineButton({
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
            className={`bg-transparent text-violet-500 ring-2 transition-all duration-300 ring-violet-200 hover:ring-violet-400 hover:bg-transparent w-auto h-8 text-base dark:ring-violet-400 dark:hover:ring-violet-600 ${className}`}
        >
            {text}
        </Button>
    );
}
