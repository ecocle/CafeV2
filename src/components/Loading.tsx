import { Loader2 } from "lucide-react";

interface LoadingProps {
    message: string;
    className?: string;
}

export function Loading({ message, className }: LoadingProps) {
    return (
        <div
            className={`flex flex-col justify-center items-center h-screen ${className}`}
        >
            <div className="animate-spin">
                <Loader2 />
            </div>
            <p className="text-2xl font-semibold mt-4">{message}</p>
        </div>
    );
}
