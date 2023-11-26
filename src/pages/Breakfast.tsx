import React, { useEffect, useState } from 'react';
import { Backdrop, Button, Card, CardContent, CircularProgress, Fade, Grid, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Breakfast.module.scss';
import Cookies from 'js-cookie';

interface BreakfastItem {
    Name: string;
    Price: string;
}

const Breakfast = () => {
    const [breakfastList, setBreakfastList] = useState<BreakfastItem[]>([]);
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [open, setOpen] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/not-authorized');
        }
    }, []);

    useEffect(() => {
        fetch('/api/dataBreakfast')
            .then((response) => response.json())
            .then((data: { Name: any; Price: number }[]) => {
                const formattedData: BreakfastItem[] = data.map((item) => ({
                    Name: item.Name,
                    Price: item.Price.toString()
                }));
                setBreakfastList(formattedData);
                setOpen(false);
            })
            .catch((error) => {
                throw new Error('Error:', error);
            });
    }, []);

    return (
        <Grid container spacing={3}>
            <Backdrop open={open} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color='inherit' />
            </Backdrop>
            {!open && (
                <Fade in={!open}>
                    <div className={styles.breakfast}>
                        <Button
                            className={styles.home}
                            component={Link}
                            variant='outlined'
                            to='/'
                            color='primary'
                        >
                            Return to Home
                        </Button>
                        <Typography variant='h4' component='h1' gutterBottom>
                            Breakfasts Menu
                        </Typography>
                        <Grid container spacing={3}>
                            {breakfastList.map((item, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                                    <Card className={styles.card} variant='outlined'>
                                        <CardContent>
                                            <Typography variant='h5' component='h2'>
                                                {item.Name}
                                            </Typography>
                                            <Grid
                                                container
                                                direction='row'
                                                justifyContent='space-between'
                                                alignItems='center'
                                            >
                                                <div>
                                                    <Typography variant='body2' component='p'>
                                                        Medium: ¥{item.Price}
                                                    </Typography>
                                                </div>
                                                <Button
                                                    size='medium'
                                                    variant='contained'
                                                    color='primary'
                                                    onClick={() => {
                                                        navigate(`./order#name=${item.Name}`);
                                                    }}
                                                    disableElevation
                                                >
                                                    Order
                                                </Button>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </Fade>
            )}
        </Grid>
    );
};

export default Breakfast;
