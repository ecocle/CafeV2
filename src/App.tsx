import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from './pages/SnackbarContext';
import { CircularProgress } from '@material-ui/core';
import Home from './pages/Home';

type LazyComponent = React.LazyExoticComponent<React.ComponentType<any>>;

const LazyCoffee = lazy(() => import('./pages/Coffee'));
const LazyCaffeineFree = lazy(() => import('./pages/CaffeineFree'));
const LazyBreakfast = lazy(() => import('./pages/Breakfast'));
const LazyOrder = lazy(() => import('./pages/Order'));
const LazySignUp = lazy(() => import('./pages/SignUp'));
const LazySignIn = lazy(() => import('./pages/SignIn'));
const LazyViewOrders = lazy(() => import('./pages/ViewOrders'));

const withSuspense = (Component: LazyComponent) => {
    return (props: any) => (
        <Suspense fallback={<CircularProgress />}>
            <Component {...props} />
        </Suspense>
    );
};

const App = () => {
    return (
        <SnackbarProvider>
            <Router>
                <Routes>
                    <Route path='/coffee' element={withSuspense(LazyCoffee)({})} />
                    <Route path='/caffeine-free' element={withSuspense(LazyCaffeineFree)({})} />
                    <Route path='/breakfast' element={withSuspense(LazyBreakfast)({})} />
                    <Route path='/order' element={withSuspense(LazyOrder)({})} />
                    <Route path='/signup' element={withSuspense(LazySignUp)({})} />
                    <Route path='/signin' element={withSuspense(LazySignIn)({})} />
                    <Route path='/orders' element={withSuspense(LazyViewOrders)({})} />
                    <Route path='/' element={<Home />} />
                    <Route path='*' element={<Home />} />
                </Routes>
            </Router>
        </SnackbarProvider>
    );
};

export default App;