import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((i) => i._id === product._id);
      if (found) {
        if (found.qty >= product.stock) return prev;
        return prev.map((i) => (i._id === product._id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const changeQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i._id !== id) return i;
          const qty = i.qty + delta;
          return { ...i, qty: Math.min(qty, i.stock) };
        })
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i._id !== id));
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, changeQty, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);