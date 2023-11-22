import React, { ChangeEvent, FormEvent, useState, useContext, useEffect } from 'react';
import { OrderContext } from './OrderContext';
import { SnackbarContext } from './SnackbarContext';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@material-ui/core';
import styles from './Order.module.scss';

const toppings = [
    { name: 'Oat Milk Substitution', price: 1.0 },
    { name: 'Boba', price: 1.0 },
    { name: 'Extra Espresso Shot', price: 2.0 },
    { name: 'Red Bean', price: 1.0 },
];

const Order = () => {
    const { itemName, itemPrice } = useContext(OrderContext);
    const { setOpen, setMessage } = useContext(SnackbarContext);
    const token = Cookies.get('token');
    const username = Cookies.get('username') || '';
    const [userData, setUserData] = useState<{ balance: number; username: string }>({
        balance: 0,
        username: username,
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
    const navigate = useNavigate();

    useEffect(() => {
<<<<<<< HEAD
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
    }, [itemName]);

    useEffect(() => {
        setLoadingBack(true);
=======
>>>>>>> parent of 35db7aa (Changed the way i store order data)
        fetch('/api/user_data', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.username) {
                    setUserData(data);
                }
            })
            .catch((error) => console.error('Error:', error));
    }, []);

    useEffect(() => {
        if (isNaN(parseFloat(itemPrice))) {
            navigate(-1);
        }
    }, []);

    useEffect(() => {
        setOptions((prevOptions) => ({ ...prevOptions, total: parseFloat(itemPrice) }));
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
                    total: prevOptions.total + toppingPrice,
                };
            } else {
                return {
                    ...prevOptions,
                    toppings: prevOptions.toppings.filter((t) => t !== topping),
                    total: prevOptions.total - toppingPrice,
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

        const orderDetails = {
            firstName: username,
            lastName: username,
            name: itemName,
            temperature: options.temperature,
            selectedSize: options.size,
            selectedToppings: options.toppings,
            price: finalTotal,
            comments,
            useCup,
            balance: userData.balance,
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderDetails),
            });

            if (!response.ok) {
                throw new Error('Error placing order');
            }

            const data = await response.json();
            navigate(`/`);
            setOpen(true);
            setMessage('Order placed successfully');
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    return (
        <form className={styles.orderForm} onSubmit={handleSubmit}>
            <Typography variant="h6">Information</Typography>
            <TextField
                variant="outlined"
                className={styles.textField}
                label="Comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                multiline
            />
            <FormControlLabel
                className={styles.FormControlLabel}
                control={<Checkbox color="primary" checked={useCup} onChange={handleCupChange} />}
                label="Use own cup"
            />
            <Typography variant="h6">Order Details</Typography>
            <FormControl className={styles.FormControl} error={Boolean(sizeError)}>
                <InputLabel>Size *</InputLabel>
                <Select value={options.size} onChange={handleOptionChange} name="size">
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="large">Large</MenuItem>
                </Select>
                {sizeError && <FormHelperText>{sizeError}</FormHelperText>}
            </FormControl>
            <FormControl className={styles.FormControl} error={Boolean(temperatureError)}>
                <InputLabel>Temperature *</InputLabel>
                <Select
                    value={options.temperature}
                    onChange={handleOptionChange}
                    name="temperature"
                >
                    <MenuItem value="hot">Hot</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="cold">Cold</MenuItem>
                </Select>
                {temperatureError && <FormHelperText>{temperatureError}</FormHelperText>}
            </FormControl>
            <Typography variant="h6">Toppings</Typography>
            <FormControl className={styles.FormControl}>
                <FormGroup className={styles.FormGroup}>
                    {toppings.map((topping) => (
                        <FormControlLabel
                            key={topping.name}
                            className={styles.FormControlLabel}
                            control={
                                <Checkbox
                                    color="primary"
                                    checked={options.toppings.includes(topping.name)}
                                    onChange={handleToppingChange}
                                    name={topping.name}
                                />
                            }
                            label={`Add ${topping.name} (¥${topping.price})`}
                        />
                    ))}
                </FormGroup>
            </FormControl>
            <Typography variant="h6">Total: ¥{options.total.toFixed(2)}</Typography>
            <Button
                className={styles.submitButton}
                variant="contained"
                color="primary"
                type="submit"
            >
                Submit Order
            </Button>
        </form>
    );
};

export default Order;
