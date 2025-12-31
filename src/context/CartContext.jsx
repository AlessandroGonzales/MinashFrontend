import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
  setCart(prev => {
    const existing = prev.find(i =>
      i.idService === item.idService &&
      i.selectedColor === item.selectedColor &&
      i.selectedSize === item.selectedSize
    );

    if (existing) {
      return prev.map(i =>
        i === existing
          ? {
              ...i,
              count: i.count + item.count,
              subtotal: (i.count + item.count) * i.unitPrice
            }
          : i
      );
    }

    return [...prev, item];
  });
};

 const getTotalItems = () =>
  cart.reduce((sum, i) => sum + i.count, 0);

const getTotalPrice = () =>
  cart.reduce((sum, i) => sum + i.subtotal, 0);
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, getTotalItems, getTotalPrice, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);