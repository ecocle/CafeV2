import { Skeleton } from "@/components/ui/skeleton";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function MenuSkeleton({ className, large }: { className?: string, large?: boolean }) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-6 w-40" ></Skeleton>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    <Skeleton className="h-4 w-32 mt-1" />
                    { large && <Skeleton className="h-4 w-28 mt-1" />}
                </CardDescription>
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-20" />
            </CardFooter>
        </Card>
    );
}
