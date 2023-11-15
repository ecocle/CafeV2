import React from 'react';

export const OrderContext = React.createContext({
    itemName: '',
    setItemName: (name: string) => {},
    itemPrice: '',
    setItemPrice: (price: string) => {},
});
