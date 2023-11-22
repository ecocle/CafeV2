import React, { useContext, useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    IconButton,
    Menu,
    MenuItem,
    Snackbar,
    TextField,
    Typography
} from '@material-ui/core';
import { SnackbarContext } from './SnackbarContext';
import Cookies from 'js-cookie';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import paymentImage from '../assets/paymentImage.jpg';

const Home = () => {
    const token = Cookies.get('token');
    const username = Cookies.get('username');
    const [amount, setAmount] = useState('0');
    const [openDialog, setOpenDialog] = useState(false);
    const { open, message, setOpen } = useContext(SnackbarContext);
    const [showAlert, setShowAlert] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user_data', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setBalance(data.balance);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleAddFunds = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch('/api/addMoneyToAcc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify({ amount })
        });

        if (response.ok) {
            setOpenDialog(true);
        } else if (response.status === 400) {
        } else {
            console.error(`Error: ${response.statusText}`);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        window.location.reload();
    };

    const checkLogin = (event: React.MouseEvent) => {
        if (!token) {
            event.preventDefault();
            setShowAlert(true);
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box className={styles.App}>
            {showAlert && (
                <Snackbar
                    open={showAlert}
                    autoHideDuration={6000}
                    onClose={() => setShowAlert(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity='error' onClose={() => setShowAlert(false)}>
                        You must be signed in to order.
                    </Alert>
                </Snackbar>
            )}
            <Box className={styles.header}>
                <Typography variant='subtitle1' component='h1'></Typography>
                <Box className={styles.account}>
                    {token && username ? (
                        <>
                            <IconButton
                                className={`${styles.button} ${styles.robotoFont}`}
                                color='primary'
                                size='small'
                                onClick={handleClick}
                                title='Account'
                            >
                                <AccountCircleIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem>
                                    <Typography>Balance: {balance}</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <form onSubmit={handleAddFunds}>
                                        <TextField
                                            type='number'
                                            label='Amount'
                                            value={amount}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => {
                                                let value = e.target.value;
                                                if (value.startsWith('0') && value !== '0') {
                                                    value = value.slice(1);
                                                }
                                                setAmount(value !== '' ? value : '0');
                                            }}
                                            InputProps={{ inputProps: { min: 0 } }}
                                        />
                                        <Button type='submit' variant='contained' color='primary'>
                                            Add
                                        </Button>
                                    </form>
                                </MenuItem>
                                <MenuItem onClick={handleClose} component={Link} to='/orders'>
                                    View Orders
                                </MenuItem>
                            </Menu>
                            <Button
                                className={`${styles.button} ${styles.robotoFont}`}
                                variant='text'
                                color='primary'
                                size='small'
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
                                variant='outlined'
                                color='primary'
                                size='small'
                                component={Link}
                                to='/signup'
                            >
                                Sign Up
                            </Button>
                            <Button
                                className={`${styles.button} ${styles.robotoFont}`}
                                variant='text'
                                color='primary'
                                size='small'
                                component={Link}
                                to='/signin'
                            >
                                Sign In
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
            <Box className={styles.title}>
                <Typography className={styles.pacificoFont} variant='h1' component='h1'>
                    MY Cafe
                </Typography>
            </Box>
            <Box className={styles.main}>
                <Button
                    onClick={checkLogin}
                    className={`${styles.button} ${styles.robotoFont}`}
                    variant='contained'
                    color='primary'
                    size='large'
                    component={Link}
                    to='/coffee'
                    disabled
                >
                    Coffee
                </Button>
                <Button
                    onClick={checkLogin}
                    className={`${styles.button} ${styles.robotoFont}`}
                    variant='contained'
                    color='primary'
                    size='large'
                    component={Link}
                    to='/caffeine-free'
                >
                    Non-Caffeinated drinks
                </Button>
                <Button
                    onClick={checkLogin}
                    className={`${styles.button} ${styles.robotoFont}`}
                    variant='contained'
                    color='primary'
                    size='large'
                    component={Link}
                    to='/breakfast'
                >
                    Breakfast
                </Button>
            </Box>
            <Box className={styles.footer}>
                <Typography variant='caption' component='caption'>
                    Made By Shawn
                </Typography>
            </Box>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity='success'>
                    {message}
                </Alert>
            </Snackbar>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <img src={paymentImage} alt='Payment Image' />
                <DialogContent>
                    <DialogContentText>Funds added successfully!</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color='primary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Home;
