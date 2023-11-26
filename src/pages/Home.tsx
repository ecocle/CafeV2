import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import paymentImage from '../assets/paymentImage.jpg';
import styles from './Home.module.scss';
import Cookies from 'js-cookie';
import { SnackbarContext } from './SnackbarContext';
import { Link } from 'react-router-dom';

// Lazy-loaded components
const CircularProgress = lazy(() => import('@mui/material/CircularProgress'));
const Dialog = lazy(() => import('@mui/material/Dialog'));
const DialogActions = lazy(() => import('@mui/material/DialogActions'));
const DialogContent = lazy(() => import('@mui/material/DialogContent'));
const DialogContentText = lazy(() => import('@mui/material/DialogContentText'));
const Divider = lazy(() => import('@mui/material/Divider'));
const IconButton = lazy(() => import('@mui/material/IconButton'));
const Menu = lazy(() => import('@mui/material/Menu'));
const MenuItem = lazy(() => import('@mui/material/MenuItem'));
const Snackbar = lazy(() => import('@mui/material/Snackbar'));
const TextField = lazy(() => import('@mui/material/TextField'));
const AccountCircleIcon = lazy(() => import('@mui/icons-material/AccountCircle'));
const Logout = lazy(() => import('@mui/icons-material/Logout'));
const ListItemIcon = lazy(() => import('@mui/material/ListItemIcon'));
const Alert = lazy(() => import('@mui/material/Alert'));

const Home = () => {
    const token = Cookies.get('token');
    const [amount, setAmount] = useState('0');
    const [openDialog, setOpenDialog] = useState(false);
    const { openSnackbar, snackbarMessage, setOpenSnackbar } = useContext(SnackbarContext);
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
                throw new Error('Failed to fetch user data:');
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
            throw new Error(`Error: ${response.statusText}`);
        }
    };

    const navigateToVieOrders = () => {
        window.location.href = '/orders';
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        window.location.reload();
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Suspense fallback={<CircularProgress />}>
            <Box className={styles.App}>
                {showAlert && (
                    <Snackbar
                        open={showAlert}
                        autoHideDuration={6000}
                        onClose={() => setShowAlert(false)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <div>
                            <Suspense fallback={<CircularProgress />}>
                                <Alert severity='error' onClose={() => setShowAlert(false)}>
                                    You must be signed in to order.
                                </Alert>
                            </Suspense>
                        </div>
                    </Snackbar>
                )}
                <Box className={styles.header}>
                    <Typography variant='subtitle1' component='h1'></Typography>
                    <Box className={styles.account}>
                        {token ? (
                            <>
                                <IconButton
                                    className={`${styles.button} ${styles.robotoFont}`}
                                    color='secondary'
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
                                                color='secondary'
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
                                            <Button type='submit' variant='contained' color='secondary'
                                                    sx={{ margin: 1.5 }}>
                                                Add
                                            </Button>
                                        </form>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={navigateToVieOrders}>
                                        View Orders
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem
                                        onClick={() => {
                                            Cookies.remove('token');
                                            Cookies.remove('username');
                                            window.location.reload();
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Logout fontSize='small' />
                                        </ListItemIcon>
                                        Sign Out
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Button
                                    className={`${styles.button} ${styles.robotoFont}`}
                                    variant='outlined'
                                    color='secondary'
                                    size='small'
                                    component={Link}
                                    to='/signup'
                                >
                                    Sign Up
                                </Button>
                                <Button
                                    className={`${styles.button} ${styles.robotoFont}`}
                                    variant='text'
                                    color='secondary'
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
                    {token ? (
                        <>
                            <Button
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
                                className={`${styles.button} ${styles.robotoFont}`}
                                variant='contained'
                                color='primary'
                                size='large'
                                component={Link}
                                to='/caffeine-free'
                            >
                                Non-Caffeinated Drink
                            </Button>
                            <Button
                                className={`${styles.button} ${styles.robotoFont}`}
                                variant='contained'
                                color='primary'
                                size='large'
                                component={Link}
                                to='/breakfast'
                            >
                                Breakfast
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                className={`${styles.button} ${styles.robotoFont}`}
                                variant='contained'
                                color='primary'
                                size='large'
                                component={Link}
                                to='/signin'
                            >
                                Sign In
                            </Button>
                        </>
                    )}
                </Box>
                <Box className={styles.footer}>
                    <Typography variant='caption' component='caption'>
                        Made By Shawn
                    </Typography>
                </Box>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <div>
                        <Suspense fallback={<CircularProgress />}>
                            <Alert onClose={() => setOpenSnackbar(false)} severity='success'>
                                {snackbarMessage}
                            </Alert>
                        </Suspense>
                    </div>
                </Snackbar>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <img src={paymentImage} alt='Payment Image' />
                    <DialogContent>
                        <DialogContentText>
                            Funds added successfully!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color='primary'>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Suspense>
    );
};

export default Home;
