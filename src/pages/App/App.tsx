import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Breadcrumb } from "../Breadcrumb/Breadcrumb";
import Home from "../Home/Home";
import Coffee from "../Coffee/Coffee";
import Breakfast from "../Breakfast/Breakfast";
import CaffeineFree from "../CaffeineFree/CaffeineFree";
import Order from "../Order/Order";
import SignUp from "../SignUp/SignUp";
import SignIn from "../SignIn/SignIn";
import ViewOrders from "../ViewOrders/ViewOrder";
import Settings from "../Settings/Settings";
import { NotAuthorized } from "../NotAuthorized/NotAuthorized";
import { NotFound } from "../NotFound/NotFound";
import { DarkModeProvider } from "@/context/DarkModeContext";

const App = () => {
    return (
        <DarkModeProvider>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <Breadcrumb
                                    paths={[{ name: "Home", path: "/" }]}
                                />
                                <Home />
                            </>
                        }
                    />
                    <Route path="/coffee/*">
                        <Route
                            index
                            element={
                                <>
                                    <Breadcrumb
                                        paths={[
                                            { name: "Home", path: "/" },
                                            { name: "Coffee", path: "/coffee" },
                                        ]}
                                    />
                                    <Coffee />
                                </>
                            }
                        />
                        <Route
                            path="order"
                            element={
                                <>
                                    <Breadcrumb
                                        paths={[
                                            { name: "Home", path: "/" },
                                            { name: "Coffee", path: "/coffee" },
                                            {
                                                name: "Order",
                                                path: "/coffee/order",
                                            },
                                        ]}
                                    />
                                    <Order itemType="Coffee" />
                                </>
                            }
                        />
                    </Route>
                    <Route path="/caffeine-free/*">
                        <Route
                            index
                            element={
                                <>
                                    <Breadcrumb
                                        paths={[
                                            { name: "Home", path: "/" },
                                            {
                                                name: "Caffeine Free",
                                                path: "/caffeine-free",
                                            },
                                        ]}
                                    />
                                    <CaffeineFree />
                                </>
                            }
                        />
                        <Route
                            path="order"
                            element={
                                <>
                                    <Breadcrumb
                                        paths={[
                                            { name: "Home", path: "/" },
                                            {
                                                name: "Caffeine Free",
                                                path: "/caffeine-free",
                                            },
                                            {
                                                name: "Order",
                                                path: "/caffeine-free/order",
                                            },
                                        ]}
                                    />
                                    <Order itemType="Caffeine_free" />
                                </>
                            }
                        />
                    </Route>
                    <Route path="/breakfast/*">
                        <Route
                            index
                            element={
                                <>
                                    <Breadcrumb
                                        paths={[
                                            { name: "Home", path: "/" },
                                            {
                                                name: "Breakfast",
                                                path: "/breakfast",
                                            },
                                        ]}
                                    />
                                    <Breakfast />
                                </>
                            }
                        />
                        <Route
                            path="order"
                            element={
                                <>
                                    <Breadcrumb
                                        paths={[
                                            { name: "Home", path: "/" },
                                            {
                                                name: "Breakfast",
                                                path: "/breakfast",
                                            },
                                            {
                                                name: "Order",
                                                path: "/breakfast/order",
                                            },
                                        ]}
                                    />
                                    <Order itemType="Breakfast" />
                                </>
                            }
                        />
                    </Route>
                    <Route
                        path="/signup"
                        element={
                            <>
                                <Breadcrumb
                                    paths={[
                                        { name: "Home", path: "/" },
                                        { name: "Sign Up", path: "/signup" },
                                    ]}
                                />
                                <SignUp />
                            </>
                        }
                    />
                    <Route
                        path="/signin"
                        element={
                            <>
                                <Breadcrumb
                                    paths={[
                                        { name: "Home", path: "/" },
                                        { name: "Sign In", path: "/signin" },
                                    ]}
                                />
                                <SignIn />
                            </>
                        }
                    />
                    <Route
                        path="/view-orders"
                        element={
                            <>
                                <Breadcrumb
                                    paths={[
                                        { name: "Home", path: "/" },
                                        {
                                            name: "View Orders",
                                            path: "/view-orders",
                                        },
                                    ]}
                                />
                                <ViewOrders />
                            </>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <>
                                <Breadcrumb
                                    paths={[
                                        { name: "Home", path: "/" },
                                        { name: "Settings", path: "/settings" },
                                    ]}
                                />
                                <Settings />
                            </>
                        }
                    />
                    <Route
                        path="/not-authorized"
                        element={
                            <>
                                <Breadcrumb
                                    paths={[
                                        { name: "Home", path: "/" },
                                        {
                                            name: "Not Authorized",
                                            path: "/not-authorized",
                                        },
                                    ]}
                                />
                                <NotAuthorized />
                            </>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <>
                                <Breadcrumb
                                    paths={[
                                        { name: "Home", path: "/" },
                                        { name: "Not Found", path: "*" },
                                    ]}
                                />
                                <NotFound />
                            </>
                        }
                    />
                </Routes>
            </Router>
        </DarkModeProvider>
    );
};

export default App;
