import React, { useEffect, useState } from "react";
import {
    Alert,
    Backdrop,
    Button,
    CircularProgress,
    Container,
    Fade,
    Grid,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import styles from "./AccountSettings.module.scss";

const AccountSettings: React.FC = () => {
    const token = Cookies.get("token");
    const [open, setOpen] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState("");
    const [profileError, setProfileError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [userData, setUserData] = useState({
        id: 0,
        firstName: "",
        lastName: "",
        username: "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (token) {
            fetch("/api/user_data", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.username) {
                        setUserData({
                            id: data.id,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            username: data.username,
                            currentPassword: "",
                            newPassword: "",
                            confirmNewPassword: "",
                        });
                        setOpen(false);
                    }
                })
                .catch((error) => console.error("Error:", error));
        }
    }, []);

    const handleSaveProfile = async () => {
        try {
            setLoadingProfile(true);

            const response = await fetch("/api/update_profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    newUsername: userData.username,
                    id: userData.id,
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                const token = responseData.token;
                Cookies.remove("token");
                Cookies.set("token", token);
                setLoadingProfile(false);
                setProfileSuccess("Profile updated successfully");
            } else {
                setLoadingProfile(false);
                setProfileError("Profile update failed");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleChangePassword = async () => {
        try {
            setLoadingPassword(true);

            if (userData.newPassword != userData.confirmNewPassword) {
                setPasswordError("New Password Doesn't match");
                setLoadingPassword(false);
                return;
            }

            await fetch("/api/update_password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    enteredCurrentPassword: userData.currentPassword,
                    newPassword: userData.newPassword,
                    id: userData.id,
                }),
            })
                .then((response) => {
                    if (response.status === 200) {
                        setLoadingPassword(false);
                        setPasswordSuccess("Password updated successfully");
                    } else if (response.status === 401) {
                        response.json().then((data) => {
                            if (data.error === "Password doesn't match") {
                                setLoadingPassword(false);
                                setPasswordError("Current password is wrong");
                            } else {
                                setLoadingPassword(false);
                                setPasswordError("Password update failed");
                            }
                        });
                    } else {
                        setLoadingPassword(false);
                        setPasswordError("Password update failed");
                    }
                })
                .catch((error) => {
                    setLoadingPassword(false);
                    setPasswordError("Password update failed");
                    console.error("Error updating password:", error);
                });
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error("Error: " + error.message);
            } else {
                throw new Error("An unknown error occurred");
            }
        }
    };

    return (
        <Container maxWidth="md">
            <Backdrop
                open={open}
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {!open && (
                <Fade in={!open}>
                    <Paper elevation={3} className={styles.settingsSection}>
                        <Typography variant="h4" gutterBottom>
                            Account Settings
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper
                                    elevation={3}
                                    className="settings-section"
                                >
                                    <Typography variant="h6" gutterBottom>
                                        Profile Information
                                    </Typography>
                                    <form>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="First Name *"
                                                    value={userData.firstName}
                                                    onChange={(e) =>
                                                        setUserData({
                                                            ...userData,
                                                            firstName:
                                                                e.target.value,
                                                        })
                                                    }
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Last Name"
                                                    value={userData.lastName}
                                                    onChange={(e) =>
                                                        setUserData({
                                                            ...userData,
                                                            lastName:
                                                                e.target.value,
                                                        })
                                                    }
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Username *"
                                                    value={userData.username}
                                                    onChange={(e) =>
                                                        setUserData({
                                                            ...userData,
                                                            username:
                                                                e.target.value,
                                                        })
                                                    }
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button
                                                    variant="contained"
                                                    onClick={handleSaveProfile}
                                                    disabled={loadingProfile}
                                                >
                                                    {loadingProfile ? (
                                                        <CircularProgress
                                                            size={24}
                                                            color="secondary"
                                                        />
                                                    ) : (
                                                        "Save Profile"
                                                    )}
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12}>
                                                {profileSuccess && (
                                                    <Alert severity="success">
                                                        {profileSuccess}
                                                    </Alert>
                                                )}
                                                {profileError && (
                                                    <Alert severity="error">
                                                        {profileError}
                                                    </Alert>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </form>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper
                                    elevation={3}
                                    className="settings-section"
                                >
                                    <Typography variant="h6" gutterBottom>
                                        Change Password
                                    </Typography>
                                    <form>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    type="password"
                                                    label="Current Password"
                                                    onChange={(e) =>
                                                        setUserData({
                                                            ...userData,
                                                            currentPassword:
                                                                e.target.value,
                                                        })
                                                    }
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    type="password"
                                                    label="New Password"
                                                    value={userData.newPassword}
                                                    onChange={(e) =>
                                                        setUserData({
                                                            ...userData,
                                                            newPassword:
                                                                e.target.value,
                                                        })
                                                    }
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    type="password"
                                                    label="Confirm New Password"
                                                    value={
                                                        userData.confirmNewPassword
                                                    }
                                                    onChange={(e) =>
                                                        setUserData({
                                                            ...userData,
                                                            confirmNewPassword:
                                                                e.target.value,
                                                        })
                                                    }
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button
                                                    variant="contained"
                                                    onClick={
                                                        handleChangePassword
                                                    }
                                                    color="primary"
                                                    disabled={loadingPassword}
                                                >
                                                    {loadingPassword ? (
                                                        <CircularProgress
                                                            size={24}
                                                            color="secondary"
                                                        />
                                                    ) : (
                                                        "Change Password"
                                                    )}
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12}>
                                                {passwordSuccess && (
                                                    <Alert severity="success">
                                                        {passwordSuccess}
                                                    </Alert>
                                                )}
                                                {passwordError && (
                                                    <Alert severity="error">
                                                        {passwordError}
                                                    </Alert>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </form>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Paper>
                </Fade>
            )}
        </Container>
    );
};

export default AccountSettings;
