import { MainButton } from "../../components/MainButton";
import { OutlineButton } from "../../components/OutlineButton";
import { TextButton } from "../../components/TextButton";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, UserRound, Eye, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { AddFunds } from "@/components/AddFunds";
import { useDarkMode } from "@/context/DarkModeContext";

const Home = () => {
    const token = Cookies.get("token");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { darkMode, setDarkMode } = useDarkMode();
    const navigation = useNavigate();

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-gray-800">
            <div className="flex justify-end space-x-4 p-4">
                <Button
                    className="mb-4 bg-transparent hover:bg-transparent active:bg-transparent h-8 mr-2"
                    onClick={() => setDarkMode(!darkMode)}
                >
                    <div className="relative mb-6">
                        <Moon
                            className={`absolute transition-all duration-300 ease-in-out transform ${
                                darkMode
                                    ? "-translate-y-10 opacity-0 text-violet-500"
                                    : "translate-y-0 opacity-100 text-violet-400"
                            }`}
                        />
                        <Sun
                            className={`absolute transition-all duration-300 ease-in-out transform ${
                                darkMode
                                    ? "translate-y-0 opacity-100 text-violet-400"
                                    : "translate-y-10 opacity-0 text-violet-500"
                            }`}
                        />
                    </div>
                </Button>
                {token ? (
                    <div className="space-x-2 flex flex-row">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-transparent text-violet-500 transition-all duration-300 hover:bg-violet-100 h-8 w-auto dark:hover:bg-transparent">
                                    <UserRound className=" text-violet-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => navigation("/view-orders")}
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>View Orders</span>
                                    <DropdownMenuShortcut>
                                        ⇧⌘P
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => navigation("/settings")}
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                    <DropdownMenuShortcut>
                                        ⌘S
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        Cookies.remove("token");
                                        window.location.reload();
                                    }}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sign Out</span>
                                    <DropdownMenuShortcut>
                                        ⇧⌘Q
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AddFunds onClose={handleCloseDialog} />
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
                    <MainButton text={"Coffee"} redirectTo="/coffee" />
                    <MainButton
                        text={"Non-Caffeinated"}
                        redirectTo="/caffeine-free"
                    />
                    <MainButton text={"Breakfast"} redirectTo="/breakfast" />
                </div>
            </div>
            <div className="flex justify-center p-3">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Made By Shawn
                </p>
            </div>
        </div>
    );
};

export default Home;
