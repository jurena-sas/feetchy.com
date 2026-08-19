"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useDiscount } from "./DiscountContext";

const CartContext = createContext();

const CART_STORAGE_KEY = "cart";
const COMMAND_REF_STORAGE_KEY = "command_ref";

const SHIPPING_PRICE = 4.9;
const FREE_SHIPPING_FROM_QTY = 4;

const generateCommandRef = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

export const CartProvider = ({ children }) => {
  const { activeDiscount } = useDiscount();

  const [cart, setCart] = useState([]);
  const [commandRef, setCommandRef] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      setCart(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.error("Erreur lecture panier:", error);
      setCart([]);
    }

    const savedRef = localStorage.getItem(COMMAND_REF_STORAGE_KEY);
    setCommandRef(savedRef || null);
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (commandRef) {
      localStorage.setItem(COMMAND_REF_STORAGE_KEY, commandRef);
    } else {
      localStorage.removeItem(COMMAND_REF_STORAGE_KEY);
    }
  }, [commandRef]);

  const ensureCommandRef = () => {
    if (commandRef) return commandRef;

    const newRef = generateCommandRef();
    setCommandRef(newRef);
    return newRef;
  };

  const resetCommandRef = () => {
    const newRef = generateCommandRef();
    setCommandRef(newRef);
    return newRef;
  };

  const clearCommandRef = () => {
    setCommandRef(null);
    localStorage.removeItem(COMMAND_REF_STORAGE_KEY);
  };

  const clearCart = () => {
    setCart([]);
    clearCommandRef();
  };

  const clearCartAndCreateNewRef = () => {
    setCart([]);
    const newRef = generateCommandRef();
    setCommandRef(newRef);
    localStorage.setItem(COMMAND_REF_STORAGE_KEY, newRef);
    return newRef;
  };

  const addToCart = (product, quantity = 1) => {
    ensureCommandRef();

    setCart((prev) => {
      const safeQuantity = Math.max(1, Number(quantity) || 1);
      const referenceIndex = product.referenceIndex ?? 0;
      const productPrice = Number(product.price || 0);

      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          (item.referenceIndex ?? 0) === referenceIndex
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id &&
          (item.referenceIndex ?? 0) === referenceIndex
            ? {
                ...item,
                quantity: Number(item.quantity || 0) + safeQuantity,
                price: productPrice,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          referenceIndex,
          price: productPrice,
          quantity: safeQuantity,
        },
      ];
    });
  };

  const removeFromCart = (id, referenceIndex = 0) => {
    setCart((prev) => {
      const next = prev.filter(
        (item) =>
          !(item.id === id && (item.referenceIndex ?? 0) === referenceIndex)
      );

      if (next.length === 0) {
        clearCommandRef();
      }

      return next;
    });
  };

  const updateQuantity = (id, referenceIndex = 0, quantity) => {
    const nextQuantity = Number(quantity);

    if (!nextQuantity || nextQuantity <= 0) {
      removeFromCart(id, referenceIndex);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === id && (item.referenceIndex ?? 0) === referenceIndex
          ? { ...item, quantity: nextQuantity }
          : item
      )
    );
  };

  const totalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
  }, [cart]);

  const subtotalPrice = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
  }, [cart]);

  const shippingPrice = useMemo(() => {
    if (cart.length === 0) return 0;
    if (totalItems >= FREE_SHIPPING_FROM_QTY) return 0;
    return SHIPPING_PRICE;
  }, [cart.length, totalItems]);

  const isFreeShipping = useMemo(() => {
    return cart.length > 0 && totalItems >= FREE_SHIPPING_FROM_QTY;
  }, [cart.length, totalItems]);

  const remainingForFreeShipping = useMemo(() => {
    return Math.max(FREE_SHIPPING_FROM_QTY - totalItems, 0);
  }, [totalItems]);

  const discountPercent = useMemo(() => {
    if (!activeDiscount) return 0;
    return Number(activeDiscount.discount_percent || 0);
  }, [activeDiscount]);

  const discountAmount = useMemo(() => {
    if (!activeDiscount || discountPercent <= 0) return 0;
    return subtotalPrice * (discountPercent / 100);
  }, [activeDiscount, discountPercent, subtotalPrice]);

  const discountedSubtotalPrice = useMemo(() => {
    return Math.max(subtotalPrice - discountAmount, 0);
  }, [subtotalPrice, discountAmount]);

  const totalPrice = useMemo(() => {
    return discountedSubtotalPrice + shippingPrice;
  }, [discountedSubtotalPrice, shippingPrice]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearCartAndCreateNewRef,
        totalItems,
        subtotalPrice,
        discountPercent,
        discountAmount,
        discountedSubtotalPrice,
        shippingPrice,
        totalPrice,
        isFreeShipping,
        remainingForFreeShipping,
        commandRef,
        ensureCommandRef,
        resetCommandRef,
        clearCommandRef,
        freeShippingFromQty: FREE_SHIPPING_FROM_QTY,
        activeDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);