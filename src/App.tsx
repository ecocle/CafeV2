import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OrderContext } from './pages/OrderContext';
import { SnackbarProvider } from './pages/SnackbarContext';
import Home from './pages/Home';
import Coffee from './pages/Coffee';
import CaffeineFree from './pages/CaffeineFree';
import Breakfast from './pages/Breakfast';
import Order from './pages/Order';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

function App() {
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');

    return (
        <OrderContext.Provider value={{ itemName, setItemName, itemPrice, setItemPrice }}>
            <SnackbarProvider>
                <Router>
                    <Routes>
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/order" element={<Order />} />
                        <Route path="/breakfast" element={<Breakfast />} />
                        <Route path="/caffeine-free" element={<CaffeineFree />} />
                        <Route path="/coffee" element={<Coffee />} />
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<Home />} />
                    </Routes>
                </Router>
            </SnackbarProvider>
        </OrderContext.Provider>
    );
}

export default App;
