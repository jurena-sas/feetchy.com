"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { buildLocalizedPath, defaultLang, getLocalizedValue } from '../config';

const getItemName = (item, lang) =>
  getLocalizedValue(item?.nameTranslations, lang, item?.name || '');

const textByLang = {
  account: {
    fr: 'Mon compte',
    en: 'My account',
    it: 'Il mio account',
    de: 'Mein Konto',
    es: 'Mi cuenta',
  },
  cartLabel: {
    fr: 'Mon panier',
    en: 'My cart',
    it: 'Il mio carrello',
    de: 'Mein Warenkorb',
  },
  items: {
    fr: 'articles',
    en: 'items',
    it: 'articoli',
    de: 'Artikel',
  },
  empty: {
    fr: 'Votre panier est vide',
    en: 'Your cart is empty',
    it: 'Il tuo carrello è vuoto',
    de: 'Ihr Warenkorb ist leer',
  },
  subtotal: {
    fr: 'Sous-total',
    en: 'Subtotal',
    it: 'Subtotale',
    de: 'Zwischensumme',
  },
  discount: {
    fr: 'Remise',
    en: 'Discount',
    it: 'Sconto',
    de: 'Rabatt',
  },
  total: {
    fr: 'Total',
    en: 'Total',
    it: 'Totale',
    de: 'Gesamt',
  },
  checkout: {
    fr: 'Paiement',
    en: 'Checkout',
    it: 'Pagamento',
    de: 'Kasse',
  },
};

const getText = (lang, key, fallback = '') => {
  const entry = textByLang[key];
  return entry?.[lang] || entry?.[defaultLang] || fallback;
};

const formatPrice = (value) => `${Number(value || 0).toFixed(2)} €`;

const HeaderCart = ({ lang = defaultLang }) => {
  const {
    cart,
    totalItems,
    subtotalPrice,
    discountPercent,
    discountAmount,
    totalPrice,
    removeFromCart,
  } = useCart();

  const cartPath = lang === defaultLang ? '/cart' : `/${lang}/cart`;
  const checkoutPath = lang === defaultLang ? '/checkout' : `/${lang}/checkout`;
  const accountPath = buildLocalizedPath(lang, 'account');

  const [pulse, setPulse] = useState(false);
  const previousTotal = useRef(totalItems);

  useEffect(() => {
    const increased = totalItems > previousTotal.current;
    previousTotal.current = totalItems;

    if (increased) {
      setPulse(true);
      const timeout = setTimeout(() => setPulse(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [totalItems]);

  return (
    <div className="header-bottom-right header-bottom-right-2">
      <Link
        href={accountPath}
        className="header-account-link hidden-md hidden-sm hidden-xs"
        title={getText(lang, 'account', 'Mon compte')}
      >
        {getText(lang, 'account', 'Mon compte')}
      </Link>

      <div className="shop-cart">
        <Link href={cartPath} title={getText(lang, 'cartLabel', 'Mon panier')}>
          <span className={`lnr lnr-cart${pulse ? ' cart-pulse' : ''}`}></span>{' '}
          ({totalItems}{''})
        </Link>
      </div>

      {cart.length > 0 && (
      <div className="shop-cart-hover fix">
        <ul>
              {cart.map((item) => {
                const itemName = getItemName(item, lang);

                return (
                <li key={`${item.id}-${item.referenceIndex ?? 0}`}>
                  <div className="cart-img">
                    <Link href={cartPath} title={itemName}>
                      <img
                        src={item.image}
                        alt={itemName}
                        title={itemName}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </Link>
                  </div>

                  <div className="cart-content">
                    <h4>
                      <Link href={cartPath} title={itemName}>
                        {item.quantity} x {itemName}
                      </Link>
                    </h4>
                    {item.referenceTitle ? <span>{item.referenceTitle}</span> : null}
                    <span className="cart-price">
                      {(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)} €
                    </span>
                  </div>

                  <div className="cart-del">
                    <button
                      type="button"
                      aria-label={`Supprimer ${itemName} du panier`}
                      onClick={() => removeFromCart(item.id, item.referenceIndex ?? 0)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                      }}
                    >
                      <i className="fa fa-times-circle"></i>
                    </button>
                  </div>
                </li>
                );
              })}

              <li className="total-price">
                <span>
                  {getText(lang, 'subtotal', 'Sous-total')} {formatPrice(subtotalPrice)}
                </span>
              </li>

              {discountAmount > 0 ? (
                <li className="total-price">
                  <span>
                    {getText(lang, 'discount', 'Remise')} (-{Number(discountPercent || 0)}%) -{formatPrice(discountAmount)}
                  </span>
                </li>
              ) : null}

              <li className="total-price">
                <span>
                  {getText(lang, 'total', 'Total')} {formatPrice(totalPrice)}
                </span>
              </li>

              <li className="checkout-bg">
                <Link href={checkoutPath} title={getText(lang, 'checkout', 'Paiement')}>
                  {getText(lang, 'checkout', 'Paiement')} <i className="fa fa-angle-right"></i>
                </Link>
              </li>
        </ul>
      </div>
      )}
    </div>
  );
};

export default HeaderCart;