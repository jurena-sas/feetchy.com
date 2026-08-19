"use client";

import { CartProvider } from "./context/CartContext";
import { DiscountProvider } from "./context/DiscountContext";
import { AccountProvider } from "./context/AccountContext";

export default function Providers({ children }) {
  return (
    <DiscountProvider>
      <CartProvider>
        <AccountProvider>{children}</AccountProvider>
      </CartProvider>
    </DiscountProvider>
  );
}