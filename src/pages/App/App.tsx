import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "../../context/SnackbarContext";
import Home from "../Home/Home";
import Coffee from "../Coffee/Coffee";
import Breakfast from "../Breakfast/Breakfast";
import CaffeineFree from "../CaffeineFree/CaffeineFree";
import Order from "../Order/Order";
import SignUp from "../SignUp/SignUp";
import SignIn from "../SignIn/SignIn";
import ViewOrders from "../ViewOrders/ViewOrder";

const App = () => {
    return (
        <SnackbarProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/coffee/*">
                        <Route index element={<Coffee />} />
                        <Route
                            path="order"
                            element={<Order itemType="Coffee" />}
                        />
                    </Route>
                    <Route path="/caffeine-free/*">
                        <Route index element={<CaffeineFree />} />
                        <Route
                            path="order"
                            element={<Order itemType="Caffeine_free" />}
                        />
                    </Route>
                    <Route path="/breakfast/*">
                        <Route index element={<Breakfast />} />
                        <Route
                            path="order"
                            element={<Order itemType="Breakfast" />}
                        />
                    </Route>
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/view-orders" element={<ViewOrders />} />
                </Routes>
            </Router>
        </SnackbarProvider>
    );
};

export default App;
