/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from "react";
import { config } from "../config";

export const CartContext = createContext();

function getToken() {
  return localStorage.getItem("tb_token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const syncCartFromServer = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${config.api.baseUrl}/api/cart`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success && data.data?.cartItems) {
        const mapped = data.data.cartItems.map((ci) => ({
          id: ci.productId,
          title: ci.title,
          image: ci.image,
          price: ci.price,
          quantity: ci.quantity,
          category: ci.category,
        }));
        setCartItems(mapped);
      }
    } catch {
      // keep local cart
    }
  }, []);

  const addToCart = async (product) => {
    const token = getToken();
    if (token) {
      try {
        const res = await fetch(`${config.api.baseUrl}/api/cart/add`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        });
        const data = await res.json();
        if (data.success && data.data?.cartItems) {
          const mapped = data.data.cartItems.map((ci) => ({
            id: ci.productId,
            title: ci.title,
            image: ci.image,
            price: ci.price,
            quantity: ci.quantity,
            category: ci.category,
          }));
          setCartItems(mapped);
          return;
        }
      } catch {
        // fallback to local
      }
    }
    setCartItems((prevItems) => {
      const isExisting = prevItems.find((item) => item.id === product.id);
      if (isExisting) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = async (id) => {
    const token = getToken();
    if (token) {
      try {
        const existingItem = cartItems.find((item) => item.id === id);
        if (existingItem && existingItem.quantity > 1) {
          const res = await fetch(`${config.api.baseUrl}/api/cart/${id}`, {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify({ quantity: existingItem.quantity - 1 }),
          });
          const data = await res.json();
          if (data.success && data.data?.cartItems) {
            const mapped = data.data.cartItems.map((ci) => ({
              id: ci.productId,
              title: ci.title,
              image: ci.image,
              price: ci.price,
              quantity: ci.quantity,
              category: ci.category,
            }));
            setCartItems(mapped);
            return;
          }
        } else {
          const res = await fetch(`${config.api.baseUrl}/api/cart/${id}`, {
            method: "DELETE",
            headers: authHeaders(),
          });
          const data = await res.json();
          if (data.success && data.data?.cartItems) {
            const mapped = data.data.cartItems.map((ci) => ({
              id: ci.productId,
              title: ci.title,
              image: ci.image,
              price: ci.price,
              quantity: ci.quantity,
              category: ci.category,
            }));
            setCartItems(mapped);
            return;
          }
        }
      } catch {
        // fallback to local
      }
    }
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const getItemQuantity = (id) => {
    const item = cartItems.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const clearCart = async () => {
    const token = getToken();
    if (token) {
      try {
        await fetch(`${config.api.baseUrl}/api/cart`, {
          method: "DELETE",
          headers: authHeaders(),
        });
      } catch {
        // ignore
      }
    }
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        getItemQuantity,
        getCartCount,
        getCartTotal,
        clearCart,
        syncCartFromServer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
