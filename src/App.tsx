import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from './pages/SnackbarContext';
import Home from './pages/Home';
import Coffee from './pages/Coffee';
import CaffeineFree from './pages/CaffeineFree';
import Breakfast from './pages/Breakfast';
import Order from './pages/Order';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ViewOrders from './pages/ViewOrders';

function App() {

    return (
        <SnackbarProvider>
            <Router>
                <Routes>
                    <Route path='/orders' element={<ViewOrders />} />
                    <Route path='/signin' element={<SignIn />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/order' element={<Order />} />
                    <Route path='/breakfast' element={<Breakfast />} />
                    <Route path='/caffeine-free' element={<CaffeineFree />} />
                    <Route path='/coffee' element={<Coffee />} />
                    <Route path='/' element={<Home />} />
                    <Route path='*' element={<Home />} />
                </Routes>
            </Router>
        </SnackbarProvider>
    );
}

export default App;
