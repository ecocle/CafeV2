import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Grid, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const NeedAuthorization = () => {
    return (
        <Grid
            container
            justifyContent='center'
            alignItems='center'
            style={{ minHeight: '100vh' }}
        >
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <Box textAlign='center' p={4}>
                    <LockIcon color='primary' style={{ fontSize: 100 }} />
                    <Typography variant='h4' component='h1' gutterBottom>
                        Authorization Required
                    </Typography>
                    <Typography variant='body1' component='p' gutterBottom>
                        This content requires authorization. Please sign in to continue.
                    </Typography>
                    <Button
                        variant='contained'
                        color='primary'
                        component={RouterLink}
                        to='/signin'
                        style={{ marginTop: '20px' }}
                    >
                        Sign In
                    </Button>
                    <Button
                        variant='outlined'
                        color='primary'
                        component={RouterLink}
                        to='/signup'
                        style={{ marginTop: '20px', marginLeft: '20px' }}
                    >
                        Sign Up
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
};

export default NeedAuthorization;
