import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App/App";
import themeLight from "./Themes/themeLight";
import themeDark from "./Themes/themeDark";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";

const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)",
).matches;
const theme = prefersDarkMode ? themeDark : themeLight;

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
);
root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
    </ThemeProvider>,
);
