import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Cookies from "js-cookie";
import { Loading } from "./Loading";
import { Error } from "./Error";
import paymentImage from "@/assets/paymentImage.jpg";
const baseUrl =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

interface AddFundsProps {
    onClose: () => void;
}

export function AddFunds({ onClose }: AddFundsProps) {
    const token = Cookies.get("token");
    const [fundsToAdd, setFundsToAdd] = useState("0");
    const [addingFunds, setAddingFunds] = useState(false);
    const [error, setError] = useState("");
    const [openPayment, setOpenPayment] = useState(false);

    const handleAddFunds = async () => {
        setAddingFunds(true);

        const funds = Number(fundsToAdd);
        if (isNaN(funds)) {
            setError("Please enter a valid amount.");
            setAddingFunds(false);
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/api/addMoneyToAcc`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
                body: JSON.stringify({ amount: funds }),
            });

            if (response.ok) {
                setOpenPayment(true);
            } else if (response.status === 400) {
                setError("Please enter a valid amount.");
            } else {
                setError("Something went wrong. Please try again later.");
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setAddingFunds(false);
        }
    };

    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="ml-2 bg-transparent text-violet-500 ring-2 transition-all duration-300 ring-violet-200 hover:ring-violet-400 hover:bg-transparent w-auto h-10 text-base dark:ring-violet-400 dark:hover:ring-violet-600">
                        Add funds
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    {addingFunds ? (
                        <Loading className="h-96" message="Adding funds..." />
                    ) : error ? (
                        <Error className="h-96" message={error} />
                    ) : openPayment ? (
                        <div className="flex flex-row space-x-2">
                            <img src={paymentImage} alt="Payment Image" />
                            <span className="text-lg font-semibold">
                                Funds added successfully!
                            </span>
                        </div>
                    ) : (
                        <div>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Add Funds to Account
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Please enter the amount you want to add to
                                    your account.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex flex-col items-center space-y-4">
                                <input
                                    type="number"
                                    value={fundsToAdd}
                                    onChange={(e) =>
                                        setFundsToAdd(String(e.target.value))
                                    }
                                    placeholder="Enter amount"
                                    className="border border-gray-300 px-2 py-1 rounded-md dark:border-gray-900 text-gray-900"
                                />
                                <Button onClick={handleAddFunds}>
                                    Add Funds
                                </Button>
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={onClose}>
                                    Cancel
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                        </div>
                    )}
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
