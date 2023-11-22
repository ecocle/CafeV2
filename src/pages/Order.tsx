import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { SnackbarContext } from './SnackbarContext';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {
    Backdrop,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Fade,
    FormControl,
    FormControlLabel,
    FormGroup,
    TextField,
    Typography
} from '@material-ui/core';
import Autocomplete from '@mui/material/Autocomplete';
import styles from './Order.module.scss';

const toppings = [
    { name: 'Oat Milk Substitution', price: 1.0 },
    { name: 'Boba', price: 1.0 },
    { name: 'Extra Espresso Shot', price: 2.0 },
    { name: 'Red Bean', price: 1.0 }
];

const Order = () => {
    const hashParams = new URLSearchParams(window.location.hash.substr(1));
    const itemName = hashParams.get('name') || '';
    const itemType = hashParams.get('type') || '';
    const [itemPrice, setItemPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingBack, setLoadingBack] = useState(false);
    const { setOpen, setMessage } = useContext(SnackbarContext);
    const token = Cookies.get('token');
    const username = Cookies.get('username') || '';
    const [userData, setUserData] = useState<{
        balance: number;
        username: string;
        firstName: string;
        lastName: string;
    }>({
        balance: 0,
        username: username,
        firstName: '',
        lastName: ''
    });
    const [options, setOptions] = useState<{
        size: string | undefined;
        temperature: string | undefined;
        toppings: string[];
        total: number;
    }>({ size: undefined, temperature: undefined, toppings: [], total: 0 });
    const [comments, setComments] = useState('');
    const [useCup, setUseCup] = useState(false);
    const [sizeError, setSizeError] = useState('');
    const [temperatureError, setTemperatureError] = useState('');
    const noLarge = [
        'Crispy cereal in milk(classic)',
        'Crispy cereal in milk(honey)',
        'Crispy cereal in milk(chocolate)',
        'Classic flavoured Porridge',
        'Chocolate flavoured Porridge'
    ];
    const noToppings = [
        'Crispy cereal in milk(classic)',
        'Crispy cereal in milk(honey)',
        'Crispy cereal in milk(chocolate)',
        'Classic flavoured Porridge',
        'Chocolate flavoured Porridge'
    ];
    const noHot = [
        'Crispy cereal in milk(classic)',
        'Crispy cereal in milk(honey)',
        'Crispy cereal in milk(chocolate)',
        'Cocoa',
        'Matcha milk',
        'Matcha boba',
        'Tai Red Tea',
        'Coconut Water',
        'Milk tea',
        'Jasmine Milktea',
        'Boba',
        'Refreshing babyblue drink',
        'Pure milk',
        'Black currant oolang tea'
    ];
    const noCold = ['Classic flavoured Porridge', 'Chocolate flavoured Porridge'];
    const noNormal = [
        'Crispy cereal in milk(classic)',
        'Crispy cereal in milk(honey)',
        'Crispy cereal in milk(chocolate)',
        'Classic flavoured Porridge',
        'Chocolate flavoured Porridge'
    ];
    const navigate = useNavigate();

    useEffect(() => {
        setLoadingBack(true);
        const fetchDrinkDetails = async () => {
            try {
                const response = await fetch(`/api/drinkData/${itemType}/${itemName}`);
                const data = await response.json();

                if (response.ok) {
                    setItemPrice(parseFloat(data[0].Price));
                    setLoadingBack(false);
                } else {
                    console.error('Error fetching drink details:', data.error);
                    setLoadingBack(false);
                }
            } catch (error) {
                console.error('Error fetching drink details:', error);
                setLoadingBack(false);
            }
        };

        fetchDrinkDetails();
    }, [itemName, itemType, setItemPrice]);

    useEffect(() => {
        setLoadingBack(true);
        fetch('/api/user_data', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.username) {
                    setUserData(data);
                    setLoadingBack(false);
                }
            })
            .catch((error) => console.error('Error:', error));
    }, []);

    useEffect(() => {
        setOptions((prevOptions) => ({ ...prevOptions, total: itemPrice }));
    }, [itemPrice]);

    const handleCupChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUseCup(event.target.checked);

        setOptions((prevOptions) => {
            if (event.target.checked) {
                return { ...prevOptions, total: prevOptions.total - 1 };
            } else {
                return { ...prevOptions, total: prevOptions.total + 1 };
            }
        });
    };

    const handleOptionChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
        const name = event.target.name as keyof typeof options;
        const value = event.target.value as string;

        setOptions((prevOptions) => {
            if (name === 'size' && value === 'large' && prevOptions.size !== 'large') {
                setSizeError('');
                return { ...prevOptions, [name]: value, total: prevOptions.total + 3 };
            } else if (name === 'size' && value !== 'large' && prevOptions.size === 'large') {
                setSizeError('');
                return { ...prevOptions, [name]: value, total: prevOptions.total - 3 };
            } else {
                if (name === 'size') setSizeError('');
                if (name === 'temperature') setTemperatureError('');
                return { ...prevOptions, [name]: value };
            }
        });
    };

    const handleToppingChange = (event: ChangeEvent<HTMLInputElement>) => {
        const topping = event.target.name;
        const toppingPrice = toppings.find((t) => t.name === topping)?.price || 0;

        setOptions((prevOptions) => {
            if (event.target.checked) {
                return {
                    ...prevOptions,
                    toppings: [...prevOptions.toppings, topping],
                    total: prevOptions.total + toppingPrice
                };
            } else {
                return {
                    ...prevOptions,
                    toppings: prevOptions.toppings.filter((t) => t !== topping),
                    total: prevOptions.total - toppingPrice
                };
            }
        });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        let isValid = true;

        if (!options.size) {
            setSizeError('Please select a size');
            isValid = false;
        } else {
            setSizeError('');
        }

        if (!options.temperature) {
            setTemperatureError('Please select a temperature');
            isValid = false;
        } else {
            setTemperatureError('');
        }

        if (!isValid) {
            return;
        }

        let finalTotal = options.total;
        if (useCup) {
            finalTotal -= 1;
        }

        setLoading(true);
        const orderDetails = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            name: itemName,
            temperature: options.temperature,
            selectedSize: options.size,
            selectedToppings: options.toppings,
            price: finalTotal,
            comments,
            useCup,
            balance: userData.balance
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(orderDetails)
            });

            if (!response.ok) {
                console.error('Error placing order');
                setLoading(false);
            }

            navigate(`/`);
            setOpen(true);
            setMessage('Order placed successfully');
            setLoading(false);
        } catch (error) {
            console.error('Error placing order:', error);
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Backdrop open={loadingBack} style={{ zIndex: 9999 }}>
                <CircularProgress color='inherit' />
            </Backdrop>
            {!loadingBack && (
                <Fade in={!loadingBack}>
                    <>
                        <form className={styles.orderForm} onSubmit={handleSubmit}>
                            <Typography variant='h6'>Information</Typography>
                            <TextField
                                variant='outlined'
                                className={styles.textField}
                                label='Comments'
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                multiline
                            />
                            <FormControlLabel
                                className={styles.FormControlLabel}
                                control={
                                    <Checkbox
                                        color='primary'
                                        checked={useCup}
                                        onChange={handleCupChange}
                                    />
                                }
                                label='Use own cup'
                            />
                            <Typography variant='h6'>Order Details</Typography>
                            <Box marginBottom={2}>
                                <Autocomplete
                                    value={options.size}
                                    onChange={(_event, newValue) => {
                                        const changeEvent = {
                                            target: {
                                                name: 'size',
                                                value: newValue
                                            }
                                        } as React.ChangeEvent<{ name?: string; value: unknown }>;
                                        handleOptionChange(changeEvent);
                                    }}
                                    options={['Medium', 'Large'].filter(
                                        (size) => !(size === 'Large' && noLarge.includes(itemName))
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label='Size *'
                                            variant='outlined'
                                            error={Boolean(sizeError)}
                                            helperText={sizeError}
                                        />
                                    )}
                                />
                            </Box>
                            <Box marginBottom={2}>
                                <Autocomplete
                                    value={options.temperature}
                                    onChange={(newValue) => {
                                        const changeEvent = {
                                            target: {
                                                name: 'temperature',
                                                value: newValue
                                            }
                                        } as React.ChangeEvent<{ name?: string; value: unknown }>;
                                        handleOptionChange(changeEvent);
                                    }}
                                    options={['Hot', 'Normal', 'Cold'].filter(
                                        (temp) =>
                                            !(temp === 'Hot' && noHot.includes(itemName)) &&
                                            !(temp === 'Cold' && noCold.includes(itemName)) &&
                                            !(temp === 'Normal' && noNormal.includes(itemName))
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label='Temperature *'
                                            variant='outlined'
                                            error={Boolean(temperatureError)}
                                            helperText={temperatureError}
                                        />
                                    )}
                                />
                            </Box>
                            {!noToppings.includes(itemName) && (
                                <>
                                    <Typography variant='h6'>Toppings</Typography>
                                    <FormControl className={styles.FormControl}>
                                        <FormGroup className={styles.FormGroup}>
                                            {toppings.map((topping) => (
                                                <FormControlLabel
                                                    key={topping.name}
                                                    className={styles.FormControlLabel}
                                                    control={
                                                        <Checkbox
                                                            color='primary'
                                                            checked={options.toppings.includes(
                                                                topping.name
                                                            )}
                                                            onChange={handleToppingChange}
                                                            name={topping.name}
                                                        />
                                                    }
                                                    label={`Add ${topping.name} (¥${topping.price})`}
                                                />
                                            ))}
                                        </FormGroup>
                                    </FormControl>
                                </>
                            )}
                            <Typography variant='h6'>Total: ¥{options.total.toFixed(1)}</Typography>
                            <Button
                                className={styles.submitButton}
                                variant='contained'
                                color='primary'
                                type='submit'
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Submit Order'}
                            </Button>
                        </form>
                    </>
                </Fade>
            )}
        </div>
    );
};

export default Order;
