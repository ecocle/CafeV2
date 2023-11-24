import { useContext, useState } from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Link,
    TextField,
    Typography
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { SnackbarContext } from './SnackbarContext';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export default function SignIn() {
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
                    Cookies.set('username', username);

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
        <Container component='main' maxWidth='xs'>
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                    Sign In
                </Typography>
                <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        id='username'
                        label='Username'
                        name='username'
                        autoComplete='username'
                        autoFocus
                    />
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='password'
                        label='Password'
                        type='password'
                        id='password'
                        autoComplete='current-password'
                    />
                    <Button disabled={signingIn} type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                        {signingIn ? <CircularProgress size={24} /> : 'Sign In'}
                    </Button>
                    {openError && <Alert severity='error'>{errorMessage}</Alert>}
                    <Grid container>
                        <Grid item xs></Grid>
                        <Grid item>
                            <Link href='/signup' variant='body2'>
                                {'Don\'t have an account? Sign Up'}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
