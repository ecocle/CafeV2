import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "../../context/SnackbarContext";
import { CircularProgress } from "@mui/material";
import Home from "../Home/Home";
import Breadcrumb from "../Breadcrumb/Breadcrumb";

const LazyCoffee = lazy(() => import("../Coffee/Coffee"));
const LazyCaffeineFree = lazy(() => import("../CaffeineFree/CaffeineFree"));
const LazyBreakfast = lazy(() => import("../Breakfast/Breakfast"));
const LazyOrder = lazy(() => import("../Order/Order"));
const LazySignUp = lazy(() => import("../SignUp/SignUp"));
const LazySignIn = lazy(() => import("../SignIn/SignIn"));
const LazyViewOrders = lazy(() => import("../ViewOrders/ViewOrders"));
const LazyAccountSettings = lazy(
    () => import("../AccountSettings/AccountSettings"),
);
const LazyNotFound = lazy(() => import("../NotFound/NotFound"));
const LazyNeedAuthorization = lazy(
    () => import("../NeedAuthorization/NeedAuthorization"),
);

const withSuspense = (Component: React.ComponentType<any>) => {
    const ComponentWithSuspense = (props: any) => (
        <Suspense fallback={<CircularProgress />}>
            <Component {...props} />
        </Suspense>
    );

    ComponentWithSuspense.displayName = "ComponentWithSuspense";

    return ComponentWithSuspense;
};

const App = () => {
    return (
        <SnackbarProvider>
            <Router>
                <div style={{ position: "relative" }}>
                    <Breadcrumb />
                    <Routes>
                        <Route path="/coffee/*">
                            <Route
                                index
                                element={withSuspense(LazyCoffee)({})}
                            />
                            <Route
                                path="order"
                                element={withSuspense(LazyOrder)({
                                    itemType: "Coffee",
                                })}
                            />
                        </Route>
                        <Route path="/caffeine-free/*">
                            <Route
                                index
                                element={withSuspense(LazyCaffeineFree)({})}
                            />
                            <Route
                                path="order"
                                element={withSuspense(LazyOrder)({
                                    itemType: "Caffeine_free",
                                })}
                            />
                        </Route>
                        <Route path="/breakfast/*">
                            <Route
                                index
                                element={withSuspense(LazyBreakfast)({})}
                            />
                            <Route
                                path="order"
                                element={withSuspense(LazyOrder)({
                                    itemType: "Breakfast",
                                })}
                            />
                        </Route>
                        <Route
                            path="/signup"
                            element={withSuspense(LazySignUp)({})}
                        />
                        <Route
                            path="/signin"
                            element={withSuspense(LazySignIn)({})}
                        />
                        <Route
                            path="/account-settings"
                            element={withSuspense(LazyAccountSettings)({})}
                        />
                        <Route
                            path="/orders"
                            element={withSuspense(LazyViewOrders)({})}
                        />
                        <Route path="/" element={<Home />} />
                        <Route
                            path="*"
                            element={withSuspense(LazyNotFound)({})}
                        />
                        <Route
                            path="/not-authorized"
                            element={withSuspense(LazyNeedAuthorization)({})}
                        />
                    </Routes>
                </div>
            </Router>
        </SnackbarProvider>
    );
};

export default App;
