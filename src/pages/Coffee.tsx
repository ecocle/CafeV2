import React, { useEffect, useState } from 'react';
import { Backdrop, Button, Card, CardContent, CircularProgress, Fade, Grid, Typography } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Coffee.module.scss';

interface CoffeeItem {
    Name: string;
    Price: string;
}

const Coffee = () => {
    const [breakfastList, setBreakfastList] = useState<CoffeeItem[]>([]);
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (shouldNavigate) {
            navigate('/order');
            setShouldNavigate(false);
        }
    }, [shouldNavigate, navigate]);

    useEffect(() => {
        setOpen(true);
        fetch('/api/dataCoffee')
            .then((response) => response.json())
            .then((data: { Name: any; Price: number }[]) => {
                const formattedData: CoffeeItem[] = data.map((item) => ({
                    Name: item.Name,
                    Price: item.Price.toString()
                }));
                setBreakfastList(formattedData);
                setOpen(false);
            })
            .catch((error) => console.error('Error:', error));
    }, []);

    return (
        <Grid container className={styles.coffee} spacing={3}>
            <Backdrop open={open} style={{ zIndex: 9999 }}>
                <CircularProgress color='inherit' />
            </Backdrop>
            {!open && (
                <Fade in={!open}>
                    <>
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
                            Coffees Menu
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
                                                    <Typography variant='body2' component='p'>
                                                        Large:{' '}
                                                        {`¥${(
                                                            parseFloat(
                                                                item.Price.replace(/[^0-9.-]+/g, '')
                                                            ) + 3
                                                        ).toFixed(0)}`}
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
                    </>
                </Fade>
            )}
        </Grid>
    );
};

export default Coffee;
