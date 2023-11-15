import { createTheme } from '@material-ui/core';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1E88E5', // Bright cyan
        },
        secondary: {
            main: '#FF6D00', // Amber 900
        },
        error: {
            main: '#F44336', // Red 500
        },
        warning: {
            main: '#FF9800', // Orange 500
        },
        info: {
            main: '#2196F3', // Blue 500
        },
        success: {
            main: '#4CAF50', // Green 500
        },
    },
    typography: {
        h1: {
            fontFamily: 'Roboto',
            fontSize: 64,
            fontWeight: 700,
        },
    },
});

export default theme;
