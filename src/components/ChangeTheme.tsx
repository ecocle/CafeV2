import { useDarkMode } from "@/context/DarkModeContext";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

export const ChangeTheme = () => {
    const { darkMode, setDarkMode } = useDarkMode();

    return (
        <Button
            className="mb-4 bg-transparent hover:bg-transparent active:bg-transparent h-10 mr-2"
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
    );
};
