import React, { useContext, useState } from "react";
import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Grid,
    LinearProgress,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import { SnackbarContext } from "../../context/SnackbarContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import styles from "./SignIn.module.scss";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const SignIn = () => {
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { setOpenSnackbar, setSnackbarMessage } = useContext(SnackbarContext);
    const [signingIn, setSigningIn] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = async (username: string, password: string) => {
        const loginData = { username, password };

        if (!username || !password) {
            setOpenError(true);
            setErrorMessage("Username and password are required");
            return;
        }

        setSigningIn(true);
        try {
            const response = await fetch("/api/signIn", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const responseData = await response.json();
                const token = responseData.token;
                Cookies.set("token", token);

                try {
                    const decodedToken: { username: string } = jwtDecode(token);
                    const { username } = decodedToken;

                    navigate("/");
                    setOpenSnackbar(true);
                    setSnackbarMessage(
                        `Sign in successful, welcome ${username}!`,
                    );
                    setSigningIn(false);
                } catch (error: any) {
                    console.error("Error decoding token:", error);
                    setOpenError(true);
                    setErrorMessage(
                        `Error decoding token: ${
                            error.message || "Unknown error"
                        }`,
                    );
                }
            } else {
                setSigningIn(false);

                if (response.status === 401) {
                    setOpenError(true);
                    setErrorMessage("Incorrect username or password");
                    console.error("Error: Incorrect username or password");
                } else {
                    setOpenError(true);
                    setErrorMessage(`Error: ${response.statusText}`);
                    console.error(`Error: ${response.statusText}`);
                }
            }
        } catch (error) {
            setSigningIn(false);
            setOpenError(true);
            setErrorMessage(
                "Error: Something went wrong, please try again later",
            );
            console.error("Error: Something went wrong");
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get("username") as string;
        const password = data.get("password") as string;
        handleSignIn(username, password);
    };

    return (
        <Box className={styles.root}>
            <div className={styles.container}>
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5" gutterBottom className={styles.title}>
                    Sign In
                </Typography>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {signingIn && (
                        <Box sx={{ width: "100%" }}>
                            <LinearProgress />
                        </Box>
                    )}
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                className={styles.signInButton}
                                disabled={signingIn}
                            >
                                {signingIn ? (
                                    <CircularProgress
                                        size={24}
                                        color="secondary"
                                    />
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            {openError && (
                                <Alert severity="error">{errorMessage}</Alert>
                            )}
                        </Grid>
                        <Grid container>
                            <Grid item xs></Grid>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
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
