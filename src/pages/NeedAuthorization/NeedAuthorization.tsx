import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Grid, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import styles from "./NeedAuthorization.module.scss";

const NeedAuthorization = () => {
    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            className={styles.root}
        >
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <Box className={styles.item}>
                    <LockIcon color="primary" className={styles.icon} />
                    <Typography variant="h4" component="h1" gutterBottom>
                        Authorization Required
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        This content requires authorization. Please sign in to
                        continue.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to="/signin"
                        className={styles.button}
                    >
                        Sign In
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        component={RouterLink}
                        to="/signup"
                        className={styles.buttonOutlined}
                    >
                        Sign Up
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
};

export default NeedAuthorization;
