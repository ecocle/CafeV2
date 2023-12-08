import { MainButton } from "@/components/MainButton";
import { OutlineButton } from "@/components/OutlineButton";
import { TextButton } from "@/components/TextButton";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Eye, LogOut, Settings, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { AddFunds } from "@/components/AddFunds";

import { ChangeTheme } from "@/components/ChangeTheme";

const baseUrl =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

const Home = () => {
    const token = Cookies.get("token");
    const [userBalance, setUserBalance] = useState(0);
    const [username, setUsername] = useState("");
    const navigation = useNavigate();

    useEffect(() => {
        document.title = "MY Cafe | Home";
    }, []);

    useEffect(() => {
        fetch(`${baseUrl}/api/user_data`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            credentials: "include"
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.balance) {
                    setUserBalance(data.balance);
                }
                if (data.username) {
                    setUsername(data.username);
                }
            })
            .catch((error) => console.error("Error:", error));
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-gray-800">
            <div className="flex justify-end space-x-4 p-4">
                <ChangeTheme />
                {token ? (
                    <div className="space-x-2 flex flex-row">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="bg-transparent text-violet-500 transition-all duration-300 hover:bg-violet-100 h-10 w-auto active:bg-transparent dark:hover:bg-transparent">
                                    <UserRound className=" text-violet-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>
                                    {username}
                                </DropdownMenuLabel>
                                <DropdownMenuLabel>
                                    Balance: {userBalance}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => navigation("/view-orders")}
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>View Orders</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    disabled
                                    onClick={() => navigation("/settings")}
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        Cookies.remove("token");
                                        window.location.reload();
                                    }}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AddFunds onClose={() => window.location.reload()} />
                    </div>
                ) : (
                    <div className="space-x-2">
                        <OutlineButton text={"Sign Up"} redirectTo="/signup" />
                        <TextButton text={"Sign In"} redirectTo="/signin" />
                    </div>
                )}
            </div>
            <div className="flex flex-col items-center justify-start flex-grow">
                <div className="p-4 text-center">
                    <h1 className="font-pacifico text-6xl md:text-7xl lg:text-8xl text-primary dark:text-foreground">
                        MY Cafe
                    </h1>
                </div>
                <div className="flex space-x-0 flex-col md:flex-row md:space-x-4 lg:space-x-16 lg:flex-row">
                    <MainButton disabled redirectTo="/coffee">Coffee</MainButton>
                    <MainButton
                        redirectTo="/caffeine-free"
                    >Non-Caffeinated</MainButton>
                    <MainButton redirectTo="/breakfast">Breakfast</MainButton>
                </div>
            </div>
            <div className="flex justify-center mb-4">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Made By Shawn
                </p>
            </div>
        </div>
    );
};

export default Home;
