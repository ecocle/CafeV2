import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from './pages/SnackbarContext';
import { CircularProgress } from '@mui/material';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import NeedAuthorization from './pages/NeedAuthorization';
import Breadcrumb from './pages/Breadcrumb';

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
                <div style={{ position: 'relative' }}>
                    <Breadcrumb />
                    <Routes>
                        <Route path='/coffee/*'>
                            <Route
                                index
                                element={withSuspense(LazyCoffee)({})}
                            />
                            <Route
                                path='order'
                                element={
                                    <Suspense fallback={<CircularProgress />}>
                                        <LazyOrder
                                            itemType='Coffee'
                                        />
                                    </Suspense>
                                }

                            />
                        </Route>
                        <Route path='/caffeine-free/*'>
                            <Route
                                index
                                element={withSuspense(LazyCaffeineFree)({})}
                            />
                            <Route
                                path='order'
                                element={
                                    <Suspense fallback={<CircularProgress />}>
                                        <LazyOrder
                                            itemType='Caffeine_free'
                                        />
                                    </Suspense>
                                }
                            />
                        </Route>
                        <Route path='/breakfast/*'>
                            <Route
                                index
                                element={withSuspense(LazyBreakfast)({})}
                            />
                            <Route
                                path='order'
                                element={
                                    <Suspense fallback={<CircularProgress />}>
                                        <LazyOrder
                                            itemType='Breakfast'
                                        />
                                    </Suspense>
                                }
                            />
                        </Route>
                        <Route path='/signup' element={withSuspense(LazySignUp)({})} />
                        <Route path='/signin' element={withSuspense(LazySignIn)({})} />
                        <Route path='/orders' element={withSuspense(LazyViewOrders)({})} />
                        <Route path='/' element={<Home />} />
                        <Route path='*' element={<NotFound />} />
                        <Route path='/not-authorized' element={<NeedAuthorization />} />
                    </Routes>
                </div>
            </Router>
        </SnackbarProvider>
    )
        ;
};

export default App;