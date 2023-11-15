import React, { createContext, useState } from 'react';

interface SnackbarContextProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SnackbarContext = createContext<SnackbarContextProps>({ open: false, setOpen: () => {} });

interface SnackbarProviderProps {
    children: React.ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
    const [open, setOpen] = useState(false);

    return (
        <SnackbarContext.Provider value={{ open, setOpen }}>
            {children}
        </SnackbarContext.Provider>
    );
};