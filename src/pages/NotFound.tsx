import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Grid } from '@material-ui/core';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Box textAlign="center" p={4}>
          <ErrorOutlineIcon color="error" style={{ fontSize: 100 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            404 - Page Not Found
          </Typography>
          <Typography variant="body1" component="p" gutterBottom>
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/"
            style={{ marginTop: '20px' }}
          >
            Back to Home Page
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default NotFound;
