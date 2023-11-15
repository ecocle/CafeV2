import React, { useState, useContext, useEffect } from 'react';
import { Alert } from '@mui/material';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, IconButton, Snackbar } from '@material-ui/core';
import { SnackbarContext } from './SnackbarContext';
import Cookies from 'js-cookie';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Home = () => {
    const token = Cookies.get('token');
    const username = Cookies.get('username');
    const { open, setOpen } = useContext(SnackbarContext);
    const [showAlert, setShowAlert] = useState(false);
    const [loginSuccessful, setLoginSuccessful] = useState(false);

    useEffect(() => {
        if (token && username) {
            setLoginSuccessful(true);
        }
    }, []);

    const checkLogin = (event: React.MouseEvent) => {
        if (!token) {
            event.preventDefault();
            setShowAlert(true);
        }
    };

    return (
        <Box className={styles.App}>
            {showAlert && (
                <Alert severity="error" onClose={() => setShowAlert(false)}>
                    You must be signed in to order.
                </Alert>
            )}
            <Box className={styles.header}>
                <Typography variant="subtitle1" component="h1"></Typography>
                <Box className={styles.account}>
                    {token && username ? (
                        <>
                            <IconButton
                                className={`${styles.button} ${styles.robotoFont}`}
                                color="primary"
                                size="small"
                                component={Link}
                                to="/account"
                            >
                                <AccountCircleIcon />
                            </IconButton>
                            <Button
                                className={`${styles.button} ${styles.robotoFont}`}
                                variant="text"
                                color="primary"
                                size="small"
                                onClick={() => {
                                    Cookies.remove('token');
                                    Cookies.remove('username');
                                    window.location.reload();
                                }}
                            >
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                className={`${styles.button} ${styles.robotoFont}`}
                                variant="outlined"
                                color="primary"
                                size="small"
                                component={Link}
                                to="/signup"
                            >
                                Sign Up
                            </Button>
                            <Button
                                className={`${styles.button} ${styles.robotoFont}`}
                                variant="text"
                                color="primary"
                                size="small"
                                component={Link}
                                to="/signin"
                            >
                                Sign In
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
            <Box className={styles.title}>
                <Typography className={styles.pacificoFont} variant="h1" component="h1">
                    MY Cafe
                </Typography>
            </Box>
            <Box className={styles.main}>
                <Button
                    onClick={checkLogin}
                    className={`${styles.button} ${styles.robotoFont}`}
                    variant="contained"
                    color="primary"
                    size="large"
                    component={Link}
                    to="/coffee"
                >
                    Coffee
                </Button>
                <Button
                    onClick={checkLogin}
                    className={`${styles.button} ${styles.robotoFont}`}
                    variant="contained"
                    color="primary"
                    size="large"
                    component={Link}
                    to="/caffeine-free"
                >
                    Non-Caffeine drinks
                </Button>
                <Button
                    onClick={checkLogin}
                    className={`${styles.button} ${styles.robotoFont}`}
                    variant="contained"
                    color="primary"
                    size="large"
                    component={Link}
                    to="/breakfast"
                >
                    Breakfast
                </Button>
            </Box>
            <Box className={styles.footer}>
                <Typography variant="caption" component="caption">
                    Powered By Shawn
                </Typography>
            </Box>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity="success">
                    Order placed successfully
                </Alert>
            </Snackbar>
            <Snackbar open={loginSuccessful} autoHideDuration={6000} onClose={() => setLoginSuccessful(false)}>
                <Alert onClose={() => setLoginSuccessful(false)} severity="success">
                    Login successful, welcome {username}.
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Home;
