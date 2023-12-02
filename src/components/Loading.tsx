import { Loader2 } from "lucide-react";

interface LoadingProps {
    message: string;
}

export function Loading({ message }: LoadingProps) {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="animate-spin">
                <Loader2 />
            </div>
            <p className="text-2xl font-semibold mt-4">{message}</p>
        </div>
    );
}
