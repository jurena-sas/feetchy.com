"use client";

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { syncCartToBackend } from '../services/cartApi';

const CheckoutButton = ({
  apiBaseUrl = '',
  checkoutUrl = '/checkout.php',
  className = '',
  children = 'Passer la commande',
}) => {
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError('');

      await syncCartToBackend({ cart, apiBaseUrl });
      window.location.href = `${apiBaseUrl}${checkoutUrl}`;
    } catch (err) {
      console.error(err);
      setError("Impossible d'envoyer le panier au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" className={className} onClick={handleCheckout} disabled={loading || cart.length === 0}>
        {loading ? 'Chargement...' : children}
      </button>
      {error ? <p style={{ color: 'red', marginTop: 8 }}>{error}</p> : null}
    </>
  );
};

export default CheckoutButton;
