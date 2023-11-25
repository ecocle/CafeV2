import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import themeLight from './themeLight';
import themeDark from './themeDark';
import { ThemeProvider } from '@mui/material';
import './index.css';

const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = prefersDarkMode ? themeDark : themeLight;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
);
