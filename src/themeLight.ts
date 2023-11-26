import { createTheme } from '@mui/material/styles';

const themeLight = createTheme({
    palette: {
        primary: {
            main: '#1E88E5'
        },
        secondary: {
            main: '#7b1ee5'
        },
        error: {
            main: '#F44336'
        },
        warning: {
            main: '#FF9800'
        },
        info: {
            main: '#2196F3'
        },
        success: {
            main: '#4CAF50'
        }
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h1: {
            fontSize: '4rem',
            fontWeight: 600
        },
        h2: {
            fontSize: '2.5rem',
            fontWeight: 600
        },
        h3: {
            fontSize: '2.25rem',
            fontWeight: 600
        },
        h4: {
            fontSize: '1.75rem',
            fontWeight: 600
        },
        h5: {
            fontSize: '1.5rem',
            fontWeight: 600
        },
        h6: {
            fontSize: '1.25rem',
            fontWeight: 600
        },
        subtitle1: {
            fontSize: '1rem',
            fontWeight: 400
        },
        subtitle2: {
            fontSize: '0.875rem',
            fontWeight: 400
        },
        body1: {
            fontSize: '1rem',
            fontWeight: 400
        },
        body2: {
            fontSize: '0.875rem',
            fontWeight: 400
        },
        button: {
            fontSize: '0.875rem',
            fontWeight: 500,
            textTransform: 'uppercase'
        },
        caption: {
            fontSize: '0.75rem',
            fontWeight: 400
        },
        overline: {
            fontSize: '0.625rem',
            fontWeight: 400,
            textTransform: 'uppercase'
        }
    }
});

export default themeLight;
