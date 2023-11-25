import { createTheme } from '@material-ui/core';

const themeLight = createTheme({
    palette: {
        primary: {
            main: '#1E88E5'
        },
        secondary: {
            main: '#FF6D00'
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
        fontFamily: [
            'Roboto',
            'Arial',
            'sans-serif'
        ].join(','),
        h1: {
            fontFamily: 'Roboto',
            fontSize: 64,
            fontWeight: 600
        },
        h2: {
            fontFamily: 'Roboto',
            fontSize: 40,
            fontWeight: 600
        },
        h3: {
            fontFamily: 'Roboto',
            fontSize: 36,
            fontWeight: 600
        },
        h4: {
            fontFamily: 'Roboto',
            fontSize: 28,
            fontWeight: 600
        },
        h5: {
            fontFamily: 'Roboto',
            fontSize: 24,
            fontWeight: 600
        },
        h6: {
            fontFamily: 'Roboto',
            fontSize: 20,
            fontWeight: 600
        },
        subtitle1: {
            fontFamily: 'Roboto',
            fontSize: 16,
            fontWeight: 400
        },
        subtitle2: {
            fontFamily: 'Roboto',
            fontSize: 14,
            fontWeight: 400
        },
        body1: {
            fontFamily: 'Roboto',
            fontSize: 16,
            fontWeight: 400
        },
        body2: {
            fontFamily: 'Roboto',
            fontSize: 14,
            fontWeight: 400
        },
        button: {
            fontFamily: 'Roboto',
            fontSize: 14,
            fontWeight: 500,
            textTransform: 'uppercase'
        },
        caption: {
            fontFamily: 'Roboto',
            fontSize: 12,
            fontWeight: 400
        },
        overline: {
            fontFamily: 'Roboto',
            fontSize: 10,
            fontWeight: 400,
            textTransform: 'uppercase'
        }
    }
});

export default themeLight;
