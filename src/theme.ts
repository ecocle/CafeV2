import { createTheme } from '@material-ui/core';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1E88E5',
        },
        secondary: {
            main: '#FF6D00',
        },
        error: {
            main: '#F44336',
        },
        warning: {
            main: '#FF9800',
        },
        info: {
            main: '#2196F3',
        },
        success: {
            main: '#4CAF50',
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
