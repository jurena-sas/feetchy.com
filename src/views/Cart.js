"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { allowedLangs, defaultLang, getLocalizedValue } from '../config';

const getItemName = (item, lang) =>
  getLocalizedValue(item?.nameTranslations, lang, item?.name || '');

const textByLang = {
  pageTitle: {
    fr: 'Mon panier',
    en: 'My cart',
    it: 'Il mio carrello',
    de: 'Mein Warenkorb',
  },
  empty: {
    fr: 'Votre panier est vide.',
    en: 'Your cart is empty.',
    it: 'Il tuo carrello è vuoto.',
    de: 'Ihr Warenkorb ist leer.',
  },
  continueShopping: {
    fr: 'Continuer mes achats',
    en: 'Continue shopping',
    it: 'Continua gli acquisti',
    de: 'Weiter einkaufen',
  },
  product: {
    fr: 'Intitulé',
    en: 'Product',
    it: 'Prodotto',
    de: 'Produkt',
  },
  unitPrice: {
    fr: 'Prix',
    en: 'Price',
    it: 'Prezzo',
    de: 'Preis',
  },
  quantity: {
    fr: 'Qté',
    en: 'Qty',
    it: 'Qtà',
    de: 'Menge',
  },
  total: {
    fr: 'Total',
    en: 'Total',
    it: 'Totale',
    de: 'Gesamt',
  },
  orderSummary: {
    fr: 'Votre commande',
    en: 'Your order',
    it: 'Il tuo ordine',
    de: 'Ihre Bestellung',
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
  shipping: {
    fr: 'Préparation & envoi',
    en: 'Shipping',
    it: 'Preparazione e spedizione',
    de: 'Versand',
  },
  shippingInfo: {
    fr: 'Livraison en : France',
    en: 'Delivery in: France',
    it: 'Consegna in: Francia',
    de: 'Lieferung in: Frankreich',
  },
  freeShippingReached: {
    fr: 'La livraison est offerte !',
    en: 'Shipping is free!',
    it: 'La spedizione è gratuita!',
    de: 'Der Versand ist kostenlos!',
  },
  freeShippingRemaining: {
    fr: 'Encore {count} paire(s), et la livraison est offerte !',
    en: '{count} more pair(s) for free shipping!',
    it: 'Ancora {count} paia per la spedizione gratuita!',
    de: 'Noch {count} Paar(e) bis zum kostenlosen Versand!',
  },
  checkout: {
    fr: 'Je passe ma commande',
    en: 'Proceed to checkout',
    it: 'Procedo al pagamento',
    de: 'Zur Kasse',
  },
  remove: {
    fr: '×',
    en: '×',
    it: '×',
    de: '×',
  },
  size: {
    fr: 'Taille',
    en: 'Size',
    it: 'Taglia',
    de: 'Größe',
  },
  color: {
    fr: 'Couleur',
    en: 'Color',
    it: 'Colore',
    de: 'Farbe',
  },
  orderNote: {
    fr: 'Livraison à 4.90€ et GRATUITE dès 4 paires achetées.',
    en: 'Shipping is €4.90 and FREE from 4 pairs purchased.',
    it: 'Spedizione a 4,90€ e GRATUITA da 4 paia acquistate.',
    de: 'Versand 4,90 € und KOSTENLOS ab 4 gekauften Paaren.',
  },
};

const getText = (lang, key, fallback = '') => {
  const entry = textByLang[key];
  return entry?.[lang] || entry?.[defaultLang] || fallback;
};

const replaceCount = (text, count) => text.replace('{count}', String(count));
const formatPrice = (value) => `${Number(value || 0).toFixed(2)} eur`;

const Cart = ({ lang: langProp } = {}) => {
  const params = useParams();
  const lang = langProp || params?.lang || params?.segments?.[0];
  const currentLang = allowedLangs.includes(lang) ? lang : defaultLang;

  const {
    cart,
    subtotalPrice,
    discountPercent,
    discountAmount,
    discountedSubtotalPrice,
    shippingPrice,
    totalPrice,
    isFreeShipping,
    remainingForFreeShipping,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const checkoutPath =
    currentLang === defaultLang ? '/checkout' : `/${currentLang}/checkout`;

  const homePath =
    currentLang === defaultLang ? '/' : `/${currentLang}`;

  return (
    <div>
      <Header lang={currentLang} />

      <div className="cart-page">
        <div className="container">
          <h1 className="cart-page__title">
            {getText(currentLang, 'pageTitle', 'Mon panier')}
          </h1>

          {cart.length === 0 ? (
            <div className="cart-empty">
              <p>{getText(currentLang, 'empty', 'Votre panier est vide.')}</p>
              <Link href={homePath} className="cart-empty__link">
                {getText(currentLang, 'continueShopping', 'Continuer mes achats')}
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-main">
                <div className="cart-table">
                  <div className="cart-table__head">
                    <div>{getText(currentLang, 'product', 'Intitulé')}</div>
                    <div>{getText(currentLang, 'unitPrice', 'Prix')}</div>
                    <div>{getText(currentLang, 'quantity', 'Qté')}</div>
                    <div>{getText(currentLang, 'total', 'Total')}</div>
                  </div>

                  {cart.map((item) => {
                    const referenceIndex = item.referenceIndex ?? 0;
                    const itemName = getItemName(item, currentLang);
                    const lineTotal =
                      Number(item.price || 0) * Number(item.quantity || 0);

                    return (
                      <div
                        className="cart-table__row"
                        key={`${item.id}-${referenceIndex}`}
                      >
                        <button
                          type="button"
                          className="cart-remove"
                          onClick={() => removeFromCart(item.id, referenceIndex)}
                          aria-label="Supprimer"
                        >
                          {getText(currentLang, 'remove', '×')}
                        </button>

                        <div className="cart-product">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={itemName}
                              className="cart-product__image"
                            />
                          ) : (
                            <div className="cart-product__placeholder" />
                          )}

                          <div className="cart-product__content">
                            <h3 className="cart-product__name">{itemName}</h3>

                            {item.color ? (
                              <p className="cart-product__meta">
                                {getText(currentLang, 'color', 'Couleur')} : {item.color}
                              </p>
                            ) : null}

                            {item.referenceTitle ? (
                              <p className="cart-product__meta">{item.referenceTitle}</p>
                            ) : null}

                            {item.size ? (
                              <p className="cart-product__meta">
                                {getText(currentLang, 'size', 'Taille')} : {item.size}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="cart-table__price">
                          {formatPrice(item.price)}
                        </div>

                        <div>
                          <div className="cart-qty">
                            <button
                              type="button"
                              className="cart-qty__btn"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  referenceIndex,
                                  Number(item.quantity || 1) - 1
                                )
                              }
                            >
                              -
                            </button>

                            <input
                              type="number"
                              min="1"
                              className="cart-qty__input"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.id,
                                  referenceIndex,
                                  Number(e.target.value || 1)
                                )
                              }
                            />

                            <button
                              type="button"
                              className="cart-qty__btn"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  referenceIndex,
                                  Number(item.quantity || 1) + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="cart-table__line-total">
                          {formatPrice(lineTotal)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <aside className="cart-summary">
                <div className="cart-summary__box">
                  <h2 className="cart-summary__title">
                    {getText(currentLang, 'orderSummary', 'Votre commande')}
                  </h2>

                  <div className="cart-summary__row">
                    <div className="cart-summary__label">
                      {getText(currentLang, 'subtotal', 'Sous-total')}
                    </div>
                    <div className="cart-summary__value">
                      {formatPrice(subtotalPrice)}
                    </div>
                  </div>

                  {discountAmount > 0 ? (
                    <div className="cart-summary__row">
                      <div className="cart-summary__label">
                        {getText(currentLang, 'discount', 'Remise')} (-{Number(discountPercent || 0)}%)
                      </div>
                      <div className="cart-summary__value">
                        -{formatPrice(discountAmount)}
                      </div>
                    </div>
                  ) : null}

                  <div className="cart-summary__row">
                    <div className="cart-summary__label">
                      {getText(currentLang, 'shipping', 'Préparation & envoi')}
                      <span className="cart-summary__sub">
                        {getText(currentLang, 'shippingInfo', 'Livraison en : France')}
                      </span>
                    </div>
                    <div className="cart-summary__value">
                      {shippingPrice === 0 ? '0.00 eur' : formatPrice(shippingPrice)}
                    </div>
                  </div>

                  <div className="cart-summary__info">
                    {isFreeShipping
                      ? getText(currentLang, 'freeShippingReached', 'La livraison est offerte !')
                      : replaceCount(
                        getText(
                          currentLang,
                          'freeShippingRemaining',
                          'Encore {count} paire(s), et la livraison est offerte !'
                        ),
                        remainingForFreeShipping
                      )}
                  </div>

                  <div className="cart-summary__total">
                    <span>{getText(currentLang, 'total', 'Total')}</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>

                  {discountAmount > 0 ? (
                    <p className="cart-summary__note">
                      Total produits remisés : {formatPrice(discountedSubtotalPrice)}
                    </p>
                  ) : null}

                  <p className="cart-summary__note">
                    {getText(
                      currentLang,
                      'orderNote',
                      'Livraison à 4.90€ et GRATUITE dès 4 paires achetées.'
                    )}
                  </p>
                </div>

                <Link href={checkoutPath} className="cart-summary__checkout">
                  {getText(currentLang, 'checkout', 'Je passe ma commande')}
                </Link>
              </aside>
            </div>
          )}
        </div>
      </div>

      <Footer lang={currentLang} />
    </div>
  );
};

export default Cart;