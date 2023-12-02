import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function MainButton({
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
            className={` bg-sky-500 transition-all duration-300 hover:bg-sky-600 text-4xl mt-12 p-10 ${className}`}
        >
            {text}
        </Button>
    );
}
