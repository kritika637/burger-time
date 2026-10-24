/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import { config } from "../config";

export const AuthContext = createContext();

const SESSION_KEY = "tb_user";
const TOKEN_KEY = "tb_token";

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${config.api.baseUrl}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Request failed");
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession());
  const [token, setToken] = useState(() => getToken());

  useEffect(() => {
    if (user && token) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [user, token]);

  const register = async (name, email, password, phone) => {
    try {
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, phone }),
      });
      setUser(data.data.user);
      setToken(data.data.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const login = async (email, password) => {
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setUser(data.data.user);
      setToken(data.data.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const updateProfile = async (name, phone) => {
    try {
      const data = await apiFetch("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify({ name, phone }),
      });
      setUser(data.data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // --- Address CRUD ---
  const getAddresses = async () => {
    try {
      const data = await apiFetch("/api/addresses");
      return data.data || [];
    } catch {
      return [];
    }
  };

  const addAddress = async (address) => {
    try {
      await apiFetch("/api/addresses", {
        method: "POST",
        body: JSON.stringify(address),
      });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateAddress = async (id, address) => {
    try {
      await apiFetch(`/api/addresses/${id}`, {
        method: "PUT",
        body: JSON.stringify(address),
      });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteAddress = async (id) => {
    try {
      await apiFetch(`/api/addresses/${id}`, { method: "DELETE" });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      await apiFetch(`/api/addresses/${id}/default`, { method: "PUT" });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // --- Wishlist ---
  const getWishlist = async () => {
    try {
      const data = await apiFetch("/api/wishlist");
      return data.data || [];
    } catch {
      return [];
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      const data = await apiFetch("/api/wishlist/toggle", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });
      return { success: true, added: data.data.added, wishlist: data.data.wishlist };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const isInWishlist = async (productId) => {
    try {
      const data = await apiFetch(`/api/wishlist/check/${productId}`);
      return data.data.isInWishlist;
    } catch {
      return false;
    }
  };

  // --- Orders ---
  const saveOrder = async (order) => {
    try {
      const data = await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(order),
      });
      return { success: true, order: data.data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const getOrders = async () => {
    try {
      const data = await apiFetch("/api/orders");
      return data.data || [];
    } catch {
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateProfile,
        getAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getWishlist,
        toggleWishlist,
        isInWishlist,
        saveOrder,
        getOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
