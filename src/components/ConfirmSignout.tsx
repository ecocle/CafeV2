import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

export function ConfirmSignout() {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    className={`bg-transparent text-violet-500 ring-2 transition-all duration-300 ring-violet-200 hover:ring-violet-400 hover:bg-transparent w-auto h-8 text-base`}
                >
                    Sign Out
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You will be logged out of your account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        className={`bg-transparent text-sky-500 transition-all duration-300 hover:bg-sky-100 hover:text-sky-500`}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-sky-500 hover:bg-sky-600"
                        onClick={() => {
                            Cookies.remove("token");
                            window.location.reload();
                        }}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
