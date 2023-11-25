import React, { useContext, useState } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@material-ui/core';
import { SnackbarContext } from './SnackbarContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import styles from './SignIn.module.scss';
import { Alert, Avatar, CircularProgress, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const SignIn = () => {
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { setOpenSnackbar, setSnackbarMessage } = useContext(SnackbarContext);
    const [signingIn, setSigningIn] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = async (username: string, password: string) => {
        setSigningIn(true);
        const loginData = { username, password };

        try {
            const response = await fetch('/api/signIn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const responseData = await response.json();
                const token = responseData.token;
                Cookies.set('token', token);

                try {
                    const decodedToken: { username: string } = (jwtDecode as any)(token);
                    const { username } = decodedToken;

                    navigate('/');
                    setOpenSnackbar(true);
                    setSnackbarMessage(`Sign in successful, welcome ${username}!`);
                    setSigningIn(false);
                } catch (error: any) {
                    console.error('Error decoding token:', error);
                    setOpenError(true);
                    setErrorMessage(`Error decoding token: ${error.message || 'Unknown error'}`);
                }
            } else {
                setSigningIn(false);

                if (response.status === 401) {
                    setOpenError(true);
                    setErrorMessage('Incorrect username or password');
                    console.error('Error: Incorrect username or password');
                } else {
                    setOpenError(true);
                    setErrorMessage(`Error: ${response.statusText}`);
                    console.error(`Error: ${response.statusText}`);
                }
            }
        } catch (error) {
            setSigningIn(false);
            setOpenError(true);
            setErrorMessage('Error: Something went wrong, please try again later');
            console.error('Error: Something went wrong');
        }
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username') as string;
        const password = data.get('password') as string;
        handleSignIn(username, password);
    };

    return (
        <Box className={styles.root}>
            <div className={styles.container}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant='h5' gutterBottom className={styles.title}>
                    Sign In
                </Typography>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                id='username'
                                label='Username'
                                name='username'
                                autoComplete='username'
                                className={styles.textField}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                name='password'
                                label='Password'
                                type='password'
                                id='password'
                                autoComplete='current-password'
                                className={styles.textField}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                variant='contained'
                                color='primary'
                                fullWidth
                                className={styles.signInButton}
                                disabled={signingIn}
                            >
                                {signingIn ? <CircularProgress size={24} /> : 'Sign In'}
                            </Button>
                        </Grid>
                        {openError && <Alert severity='error'>{errorMessage}</Alert>}
                        <Grid container>
                            <Grid item xs></Grid>
                            <Grid item>
                                <Link href='/signup' variant='body2'>
                                    {'Don\'t have an account? Sign Up'}
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Box>
    );
};

export default SignIn;
