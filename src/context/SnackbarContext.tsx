import React, { createContext, useState } from "react";

export const SnackbarContext = createContext({
    openSnackbar: false,
    snackbarMessage: "",
    setOpenSnackbar: (open: boolean) => {},
    setSnackbarMessage: (message: string) => {},
});

interface SnackbarProviderProps {
    children: React.ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const contextValue = {
        openSnackbar,
        snackbarMessage,
        setOpenSnackbar,
        setSnackbarMessage,
    };

    return (
        <SnackbarContext.Provider value={contextValue}>
            {children}
        </SnackbarContext.Provider>
    );
};
