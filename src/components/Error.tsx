import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ErrorProps {
    message: string;
}

export function Error({ message }: ErrorProps) {
    const [isLoading, setIsLoading] = useState(false);

    const onRetry = () => {
        setIsLoading(true);
        window.location.reload();
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <p className="text-2xl font-semibold mt-4">{message}</p>
            <Button onClick={onRetry} disabled={isLoading}>
                {isLoading ? (
                    <div>
                        <div className="animate-spin">
                            <Loader2 />
                        </div>
                    </div>
                ) : (
                    <span>Retry</span>
                )}
            </Button>
        </div>
    );
}
