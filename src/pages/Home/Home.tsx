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
import { LogOut, Settings, UserRound, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

const Home = () => {
    const token = Cookies.get("token");
    const navigation = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950">
            <div className="flex justify-end space-x-4 p-4">
                {token ? (
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-transparent text-violet-500 transition-all duration-300 hover:bg-violet-100 h-8 p-0">
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
                                <DropdownMenuItem>
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
                    <h1 className="font-pacifico text-6xl lg:text-8xl text-primary dark:text-secondary">
                        MY Cafe
                    </h1>
                </div>
                <div className="flex space-x-0 flex-col md:flex-row md:space-x-16 lg:flex-row">
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
