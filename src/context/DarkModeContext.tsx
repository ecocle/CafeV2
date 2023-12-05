import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

interface DarkModeContextType {
    darkMode: boolean;
    setDarkMode: (mode: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
    undefined,
);

export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (context === undefined) {
        throw new Error("useDarkMode must be used within a DarkModeProvider");
    }
    return context;
};

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
    const [darkMode, setDarkMode] = useState(
        () =>
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches,
    );

    useEffect(() => {
        const localDarkMode = localStorage.getItem("darkMode") === "true";
        setDarkMode(localDarkMode);
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("darkMode", "true");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("darkMode", "false");
        }
    }, [darkMode]);

    return (
        <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};
