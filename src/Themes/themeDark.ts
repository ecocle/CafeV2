import { createTheme } from "@mui/material/styles";

const themeDark = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#90caf9",
        },
        secondary: {
            main: "#ce93d8",
        },
        error: {
            main: "#EF5350",
        },
        warning: {
            main: "#FFD54F",
        },
        info: {
            main: "#2196F3",
        },
        success: {
            main: "#81C784",
        },
        background: {
            default: "#121212",
            paper: "#121212",
        },
    },
    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
        h1: {
            fontSize: "4rem",
            fontWeight: 600,
        },
        h2: {
            fontSize: "2.5rem",
            fontWeight: 600,
        },
        h3: {
            fontSize: "2.25rem",
            fontWeight: 600,
        },
        h4: {
            fontSize: "1.75rem",
            fontWeight: 600,
        },
        h5: {
            fontSize: "1.5rem",
            fontWeight: 600,
        },
        h6: {
            fontSize: "1.25rem",
            fontWeight: 600,
        },
        subtitle1: {
            fontSize: "1rem",
            fontWeight: 400,
        },
        subtitle2: {
            fontSize: "0.875rem",
            fontWeight: 400,
        },
        body1: {
            fontSize: "1rem",
            fontWeight: 400,
        },
        body2: {
            fontSize: "0.875rem",
            fontWeight: 400,
        },
        button: {
            fontSize: "0.875rem",
            fontWeight: 500,
            textTransform: "uppercase",
        },
        caption: {
            fontSize: "0.75rem",
            fontWeight: 400,
        },
        overline: {
            fontSize: "0.625rem",
            fontWeight: 400,
            textTransform: "uppercase",
        },
    },
});

export default themeDark;