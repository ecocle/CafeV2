import React, { useState } from 'react';

export const SnackbarContext = React.createContext({
    open: false,
    message: '',
    setOpen: (open: boolean) => {
    },
    setMessage: (message: string) => {
    }
});

interface SnackbarProviderProps {
    children: React.ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    return (
        <SnackbarContext.Provider value={{ open, message, setOpen, setMessage }}>
            {children}
        </SnackbarContext.Provider>
    );
};
