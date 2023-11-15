import React, { useEffect, useState, useContext, ChangeEvent } from 'react';
import {
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    Backdrop,
    CircularProgress,
    Fade,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import styles from './Breakfast.module.scss';
import { OrderContext } from './OrderContext';
import { useNavigate } from 'react-router-dom';

interface BreakfastItem {
    Name: string;
    Price: string;
}

const Breakfast = () => {
    const { setItemName, setItemPrice } = useContext(OrderContext);
    const [breakfastList, setBreakfastList] = useState<BreakfastItem[]>([]);
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    const [options, setOptions] = useState<{
        size: string;
        temperature: string;
        toppings: string[];
    }>({ size: '', temperature: '', toppings: [] });

    useEffect(() => {
        if (shouldNavigate) {
            navigate('/order');
            setShouldNavigate(false);
        }
    }, [shouldNavigate, navigate]);

    useEffect(() => {
        setOpen(true);
        fetch('/api/dataBreakfast')
            .then((response) => response.json())
            .then((data: { Name: any; Price: number }[]) => {
                const formattedData: BreakfastItem[] = data.map((item) => ({
                    Name: item.Name,
                    Price: item.Price.toString(),
                }));
                setBreakfastList(formattedData);
                setOpen(false);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <Grid container className={styles.caffeineFree} spacing={3}>
            <Backdrop open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Fade in={!open}>
                <>
                    <Button
                        className={styles.home}
                        component={Link}
                        variant="outlined"
                        to="/"
                        color="primary"
                    >
                        Return to Home
                    </Button>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Breakfasts Menu
                    </Typography>
                    <Grid container spacing={3}>
                        {breakfastList.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                                <Card className={styles.card} variant="outlined">
                                    <CardContent>
                                        <Typography variant="h5" component="h2">
                                            {item.Name}
                                        </Typography>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <div>
                                                <Typography variant="body2" component="p">
                                                    Medium: ¥{item.Price}
                                                </Typography>
                                                <Typography variant="body2" component="p">
                                                    Large:{' '}
                                                    {`¥${(
                                                        parseFloat(
                                                            item.Price.replace(/[^0-9.-]+/g, '')
                                                        ) + 3
                                                    ).toFixed(2)}`}
                                                </Typography>
                                            </div>
                                            <Button
                                                size="medium"
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    console.log('Setting itemName and itemPrice');
                                                    setItemName(item.Name);
                                                    setItemPrice(item.Price);
                                                    setShouldNavigate(true);
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
        </Grid>
    );
};

export default Breakfast;