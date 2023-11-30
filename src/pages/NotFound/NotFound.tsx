// NotFound.tsx
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Grid, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import styles from "./NotFound.module.scss";

const NotFound = () => {
    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            className={styles.root}
        >
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <Box className={styles.item}>
                    <ErrorOutlineIcon color="error" className={styles.icon} />
                    <Typography variant="h4" component="h1" gutterBottom>
                        404 - Page Not Found
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        The page you are looking for might have been removed,
                        had its name changed, or is temporarily unavailable.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to="/"
                        className={styles.button}
                    >
                        Back to Home Page
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
};

export default NotFound;
