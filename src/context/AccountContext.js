"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AccountContext = createContext();

const TOKEN_STORAGE_KEY = "account_token";
const CUSTOMER_STORAGE_KEY = "account_customer";

const ACCOUNT_API_BASE = "/laceter-api-payment";

export const AccountProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const savedCustomer = localStorage.getItem(CUSTOMER_STORAGE_KEY);

      setToken(savedToken || null);
      setCustomer(savedCustomer ? JSON.parse(savedCustomer) : null);
    } catch (error) {
      console.error("Erreur lecture compte:", error);
    } finally {
      setReady(true);
    }
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(`${ACCOUNT_API_BASE}/account-login.php`, {
      email,
      password,
    });

    const data = response.data || {};

    if (!data.success) {
      throw new Error(data.message || "Identifiants invalides.");
    }

    setToken(data.token);
    setCustomer(data.customer || null);
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(data.customer || null));

    return data.customer;
  };

  const requestPassword = async (email, lang = "fr") => {
    const response = await axios.post(
      `${ACCOUNT_API_BASE}/account-request-password.php`,
      { email, lang }
    );

    const data = response.data || {};

    if (!data.success) {
      throw new Error(data.message || "Impossible d'envoyer le lien.");
    }

    return true;
  };

  const setPassword = async (code, password) => {
    const response = await axios.post(
      `${ACCOUNT_API_BASE}/account-set-password.php`,
      { code, password }
    );

    const data = response.data || {};

    if (!data.success) {
      throw new Error(data.message || "Impossible de définir le mot de passe.");
    }

    setToken(data.token);
    setCustomer(data.customer || null);
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(data.customer || null));

    return data.customer;
  };

  const fetchOrders = async () => {
    if (!token) throw new Error("Non connecté.");

    const response = await axios.post(`${ACCOUNT_API_BASE}/account-orders.php`, {
      token,
    });

    const data = response.data || {};

    if (!data.success) {
      throw new Error(data.message || "Impossible de charger les commandes.");
    }

    return data.orders || [];
  };

  const getInvoiceUrl = (order) => {
    if (!token || !order?.hasInvoice) return null;

    const params = new URLSearchParams({
      token,
      ref: order.reference,
      period: order.period,
    });

    return `${ACCOUNT_API_BASE}/account-invoice.php?${params.toString()}`;
  };

  const logout = () => {
    setToken(null);
    setCustomer(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
  };

  return (
    <AccountContext.Provider
      value={{
        token,
        customer,
        isLoggedIn: Boolean(token),
        ready,
        login,
        requestPassword,
        setPassword,
        fetchOrders,
        getInvoiceUrl,
        logout,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
