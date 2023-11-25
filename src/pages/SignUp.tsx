import React, { FormEvent, useContext, useState } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { SnackbarContext } from './SnackbarContext';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './SignUp.module.scss';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';

const SignUp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { setOpenSnackbar, setSnackbarMessage } = useContext(SnackbarContext);
    const navigation = useNavigate();

    const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const username = formData.get('username');
        const password = formData.get('password');
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');

        if (!firstName || !username || !password) {
            setError('First name, username, and password are required');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/signUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, firstName, lastName })
            });

            if (!response.ok) {
                const responseData = await response.json();
                if (response.status === 400) {
                    setError('Username already exists');
                } else {
                    setError(responseData.message || 'Error signing up');
                }
            } else {
                navigation('/');
                setOpenSnackbar(true);
                setSnackbarMessage('Sign up successful');
            }
        } catch (error) {
            setError('Error signing up');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box className={styles.root}>
            <div className={styles.container}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant='h5' gutterBottom className={styles.title}>
                    Sign Up
                </Typography>
                <form onSubmit={handleSignUp} className={styles.form}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant='outlined'
                                autoComplete='given-name'
                                name='firstName'
                                required
                                fullWidth
                                id='firstName'
                                label='First Name'
                                className={styles.textField}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant='outlined'
                                fullWidth
                                id='lastName'
                                label='Last Name'
                                name='lastName'
                                autoComplete='family-name'
                                className={styles.textField}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant='outlined'
                                required
                                fullWidth
                                id='username'
                                label='Username'
                                name='username'
                                autoComplete='username'
                                className={styles.textField}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant='outlined'
                                required
                                fullWidth
                                name='password'
                                label='Password'
                                type='password'
                                id='password'
                                autoComplete='new-password'
                                className={styles.textField}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                variant='contained'
                                color='primary'
                                fullWidth
                                disabled={isLoading}
                                className={styles.signUpButton}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
                            </Button>
                            <Grid item xs={12}>
                                {error && <Alert severity='error'>{error}</Alert>}
                            </Grid>
                            <Grid container justifyContent='flex-end'>
                                <Grid item>
                                    <Link href='/signin' variant='body2'>
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Box>
    );
};

export default SignUp;
