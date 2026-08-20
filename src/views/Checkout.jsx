"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { allowedLangs, defaultLang } from '../config';

const CHECKOUT_STORAGE_KEY = 'checkout_form';

const initialForm = {
  'del-firstname': '',
  'del-lastname': '',
  'del-compagny': '',
  'del-address-street': '',
  'del-address-zip': '',
  'del-address-locality': '',
  'del-address-country': 'France',
  'del-mail': '',
  'del-phone': '',
  'fact-other': '0',
  'fact-firstname': '',
  'fact-lastname': '',
  'fact-compagny': '',
  'fact-address-street': '',
  'fact-address-zip': '',
  'fact-address-locality': '',
  'fact-address-country': 'France',
  message: '',
  'mailing-accept': '0',
  'cgv-accept': '0',
};

const textByLang = {
  pageTitle: {
    fr: 'Livraison',
    en: 'Delivery',
    it: 'Consegna',
    de: 'Lieferung',
    es: 'Envío',
  },
  empty: {
    fr: 'Votre panier est vide.',
    en: 'Your cart is empty.',
    it: 'Il tuo carrello è vuoto.',
    de: 'Ihr Warenkorb ist leer.',
    es: 'Tu carrito está vacío.',
  },
  continueShopping: {
    fr: 'Continuer mes achats',
    en: 'Continue shopping',
    it: 'Continua gli acquisti',
    de: 'Weiter einkaufen',
    es: 'Seguir comprando',
  },
  cartStep: {
    fr: 'Mon panier',
    en: 'My cart',
    it: 'Il mio carrello',
    de: 'Mein Warenkorb',
    es: 'Mi carrito',
  },
  deliveryStep: {
    fr: 'Livraison',
    en: 'Delivery',
    it: 'Consegna',
    de: 'Lieferung',
    es: 'Entrega',
  },
  confirmStep: {
    fr: 'Confirmation',
    en: 'Confirmation',
    it: 'Conferma',
    de: 'Bestätigung',
    es: 'Confirmación',
  },
  cartStepSub: {
    fr: 'Détail de votre produits',
    en: 'Your products details',
    it: 'Dettaglio dei prodotti',
    de: 'Details Ihrer Produkte',
    es: 'Detalle de tus productos',
  },
  deliveryStepSub: {
    fr: 'Mes information de livraison',
    en: 'My delivery information',
    it: 'Le mie informazioni di consegna',
    de: 'Meine Lieferinformationen',
    es: 'Mi información de entrega',
  },
  confirmStepSub: {
    fr: 'Récapitulatif de ma commande',
    en: 'Order summary',
    it: 'Riepilogo del mio ordine',
    de: 'Zusammenfassung meiner Bestellung',
    es: 'Resumen de mi pedido',
  },
  coords: {
    fr: 'Vos coordonnées',
    en: 'Your details',
    it: 'I tuoi dati',
    de: 'Ihre Angaben',
    es: 'Tus datos',
  },
  country: {
    fr: 'Pays *',
    en: 'Country *',
    it: 'Paese *',
    de: 'Land *',
    es: 'País *',
  },
  firstname: {
    fr: 'Prénom *',
    en: 'First name *',
    it: 'Nome *',
    de: 'Vorname *',
    es: 'Nombre *',
  },
  lastname: {
    fr: 'Nom *',
    en: 'Last name *',
    it: 'Cognome *',
    de: 'Nachname *',
    es: 'Apellido *',
  },
  company: {
    fr: 'Société',
    en: 'Company',
    it: 'Azienda',
    de: 'Firma',
    es: 'Empresa',
  },
  address: {
    fr: 'Numéro et Rue *',
    en: 'Street and number *',
    it: 'Numero e via *',
    de: 'Straße und Nummer *',
    es: 'Calle y número *',
  },
  zip: {
    fr: 'Code postal *',
    en: 'ZIP code *',
    it: 'CAP *',
    de: 'Postleitzahl *',
    es: 'Código postal *',
  },
  city: {
    fr: 'Ville *',
    en: 'City *',
    it: 'Città *',
    de: 'Stadt *',
    es: 'Ciudad *',
  },
  email: {
    fr: 'Email *',
    en: 'Email *',
    it: 'Email *',
    de: 'E-Mail *',
    es: 'Email *',
  },
  phone: {
    fr: 'Téléphone *',
    en: 'Phone *',
    it: 'Telefono *',
    de: 'Telefon *',
    es: 'Teléfono *',
  },
  billingOther: {
    fr: 'Utiliser une adresse de facturation différente',
    en: 'Use a different billing address',
    it: 'Usa un indirizzo di fatturazione diverso',
    de: 'Andere Rechnungsadresse verwenden',
    es: 'Usar una dirección de facturación diferente',
  },
  billingTitle: {
    fr: 'Adresse de facturation',
    en: 'Billing address',
    it: 'Indirizzo di fatturazione',
    de: 'Rechnungsadresse',
    es: 'Dirección de facturación',
  },
  orderMessage: {
    fr: 'Message de commande',
    en: 'Order message',
    it: 'Messaggio ordine',
    de: 'Bestellnachricht',
    es: 'Mensaje del pedido',
  },
  newsletter: {
    fr: 'Recevoir la newsletter',
    en: 'Receive newsletter',
    it: 'Ricevere la newsletter',
    de: 'Newsletter erhalten',
    es: 'Recibir la newsletter',
  },
  cgv: {
    fr: 'J’accepte les conditions générales de vente',
    en: 'I accept the terms and conditions',
    it: 'Accetto i termini e condizioni di vendita',
    de: 'Ich akzeptiere die AGB',
    es: 'Acepto los términos y condiciones de venta',
  },
  orderSummary: {
    fr: 'Votre commande',
    en: 'Your order',
    it: 'Il tuo ordine',
    de: 'Ihre Bestellung',
    es: 'Tu pedido',
  },
  subtotal: {
    fr: 'Sous-total',
    en: 'Subtotal',
    it: 'Subtotale',
    de: 'Zwischensumme',
    es: 'Subtotal',
  },
  discount: {
    fr: 'Remise',
    en: 'Discount',
    it: 'Sconto',
    de: 'Rabatt',
    es: 'Descuento',
  },
  shipping: {
    fr: 'Préparation & envoi',
    en: 'Shipping',
    it: 'Preparazione e spedizione',
    de: 'Versand',
    es: 'Preparación y envío',
  },
  shippingInfo: {
    fr: 'Livraison en : France',
    en: 'Delivery in: France',
    it: 'Consegna in: Francia',
    de: 'Lieferung in: Frankreich',
    es: 'Entrega en: Francia',
  },
  total: {
    fr: 'Total',
    en: 'Total',
    it: 'Totale',
    de: 'Gesamt',
    es: 'Total',
  },
  freeShippingReached: {
    fr: 'La livraison est offerte !',
    en: 'Shipping is free!',
    it: 'La spedizione è gratuita!',
    de: 'Der Versand ist kostenlos!',
    es: '¡El envío es gratis!',
  },
  freeShippingRemaining: {
    fr: 'Encore {count} paire(s), et la livraison est offerte !',
    en: '{count} more pair(s) for free shipping!',
    it: 'Ancora {count} paia per la spedizione gratuita!',
    de: 'Noch {count} Paar(e) bis zum kostenlosen Versand!',
    es: '¡{count} par(es) más para el envío gratis!',
  },
  orderNote: {
    fr: 'Livraison à 4.90€ et GRATUITE dès 4 paires achetées.',
    en: 'Shipping is €4.90 and FREE from 4 pairs purchased.',
    it: 'Spedizione a 4,90€ e GRATUITA da 4 paia acquistate.',
    de: 'Versand 4,90 € und KOSTENLOS ab 4 gekauften Paaren.',
    es: 'Envío a 4,90€ y GRATIS a partir de 4 pares comprados.',
  },
  submit: {
    fr: 'Je finalise ma commande',
    en: 'Continue',
    it: 'Continuo',
    de: 'Weiter',
    es: 'Continuar',
  },
  errorCartEmpty: {
    fr: 'Votre panier est vide.',
    en: 'Your cart is empty.',
    it: 'Il tuo carrello è vuoto.',
    de: 'Ihr Warenkorb ist leer.',
    es: 'Tu carrito está vacío.',
  },
  errorFirstname: {
    fr: 'Le prénom est obligatoire.',
    en: 'First name is required.',
    it: 'Il nome è obbligatorio.',
    de: 'Vorname ist erforderlich.',
    es: 'El nombre es obligatorio.',
  },
  errorLastname: {
    fr: 'Le nom est obligatoire.',
    en: 'Last name is required.',
    it: 'Il cognome è obbligatorio.',
    de: 'Nachname ist erforderlich.',
    es: 'El apellido es obligatorio.',
  },
  errorStreet: {
    fr: "L'adresse est obligatoire.",
    en: 'Address is required.',
    it: "L'indirizzo è obbligatorio.",
    de: 'Adresse ist erforderlich.',
    es: 'La dirección es obligatoria.',
  },
  errorZip: {
    fr: 'Le code postal est obligatoire.',
    en: 'ZIP code is required.',
    it: 'Il CAP è obbligatorio.',
    de: 'Postleitzahl ist erforderlich.',
    es: 'El código postal es obligatorio.',
  },
  errorCity: {
    fr: 'La ville est obligatoire.',
    en: 'City is required.',
    it: 'La città è obbligatoria.',
    de: 'Stadt ist erforderlich.',
    es: 'La ciudad es obligatoria.',
  },
  errorEmail: {
    fr: "L'email est obligatoire.",
    en: 'Email is required.',
    it: "L'email è obbligatoria.",
    de: 'E-Mail ist erforderlich.',
    es: 'El email es obligatorio.',
  },
  errorPhone: {
    fr: 'Le téléphone est obligatoire.',
    en: 'Phone number is required.',
    it: 'Il telefono è obbligatorio.',
    de: 'Telefonnummer ist erforderlich.',
    es: 'El teléfono es obligatorio.',
  },
  errorBillingFirstname: {
    fr: 'Le prénom de facturation est obligatoire.',
    en: 'Billing first name is required.',
    it: 'Il nome di fatturazione è obbligatorio.',
    de: 'Vorname für die Rechnung ist erforderlich.',
    es: 'El nombre de facturación es obligatorio.',
  },
  errorBillingLastname: {
    fr: 'Le nom de facturation est obligatoire.',
    en: 'Billing last name is required.',
    it: 'Il cognome di fatturazione è obbligatorio.',
    de: 'Nachname für die Rechnung ist erforderlich.',
    es: 'El apellido de facturación es obligatorio.',
  },
  errorBillingStreet: {
    fr: "L'adresse de facturation est obligatoire.",
    en: 'Billing address is required.',
    it: "L'indirizzo di fatturazione è obbligatorio.",
    de: 'Rechnungsadresse ist erforderlich.',
    es: 'La dirección de facturación es obligatoria.',
  },
  errorBillingZip: {
    fr: 'Le code postal de facturation est obligatoire.',
    en: 'Billing ZIP code is required.',
    it: 'Il CAP di fatturazione è obbligatorio.',
    de: 'Postleitzahl für die Rechnung ist erforderlich.',
    es: 'El código postal de facturación es obligatorio.',
  },
  errorBillingCity: {
    fr: 'La ville de facturation est obligatoire.',
    en: 'Billing city is required.',
    it: 'La città di fatturazione è obbligatoria.',
    de: 'Stadt für die Rechnung ist erforderlich.',
    es: 'La ciudad de facturación es obligatoria.',
  },
};

const getText = (lang, key, fallback = '') => {
  const entry = textByLang[key];
  return entry?.[lang] || entry?.[defaultLang] || fallback;
};

const replaceCount = (text, count) => text.replace('{count}', String(count));
const formatPrice = (value) => `${Number(value || 0).toFixed(2)} eur`;

const readSavedForm = () => {
  try {
    const raw = localStorage.getItem(CHECKOUT_STORAGE_KEY);
    return raw ? { ...initialForm, ...JSON.parse(raw) } : initialForm;
  } catch (error) {
    return initialForm;
  }
};

const Checkout = ({ lang: langProp } = {}) => {
  const params = useParams();
  const lang = langProp || params?.lang || params?.segments?.[0];
  const currentLang = allowedLangs.includes(lang) ? lang : defaultLang;
  const router = useRouter();

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
  } = useCart();

  const [form, setForm] = useState(readSavedForm);
  const [error, setError] = useState('');

  const homePath = currentLang === defaultLang ? '/' : `/${currentLang}`;
  const confirmPath = currentLang === defaultLang ? '/confirm' : `/${currentLang}/confirm`;

  const showBillingForm = form['fact-other'] === '1';

  const shippingCountry = useMemo(() => {
    return form['del-address-country'] || 'France';
  }, [form]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? (checked ? '1' : '0') : value;

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const validateForm = () => {
    if (!cart.length) return getText(currentLang, 'errorCartEmpty', 'Votre panier est vide.');
    if (!form['del-firstname'].trim()) return getText(currentLang, 'errorFirstname', 'Le prénom est obligatoire.');
    if (!form['del-lastname'].trim()) return getText(currentLang, 'errorLastname', 'Le nom est obligatoire.');
    if (!form['del-address-street'].trim()) return getText(currentLang, 'errorStreet', "L'adresse est obligatoire.");
    if (!form['del-address-zip'].trim()) return getText(currentLang, 'errorZip', 'Le code postal est obligatoire.');
    if (!form['del-address-locality'].trim()) return getText(currentLang, 'errorCity', 'La ville est obligatoire.');
    if (!form['del-mail'].trim()) return getText(currentLang, 'errorEmail', "L'email est obligatoire.");
    if (!form['del-phone'].trim()) return getText(currentLang, 'errorPhone', 'Le téléphone est obligatoire.');

    if (showBillingForm) {
      if (!form['fact-firstname'].trim()) return getText(currentLang, 'errorBillingFirstname', 'Le prénom de facturation est obligatoire.');
      if (!form['fact-lastname'].trim()) return getText(currentLang, 'errorBillingLastname', 'Le nom de facturation est obligatoire.');
      if (!form['fact-address-street'].trim()) return getText(currentLang, 'errorBillingStreet', "L'adresse de facturation est obligatoire.");
      if (!form['fact-address-zip'].trim()) return getText(currentLang, 'errorBillingZip', 'Le code postal de facturation est obligatoire.');
      if (!form['fact-address-locality'].trim()) return getText(currentLang, 'errorBillingCity', 'La ville de facturation est obligatoire.');
    }

    return '';
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(form));
    router.push(confirmPath);
  };

  return (
    <div>
      <Header lang={currentLang} />

      <div className="checkout-page">
        <div className="container">
          <h1 className="checkout-page__title">
            {getText(currentLang, 'pageTitle', 'Livraison')}
          </h1>

          {cart.length === 0 ? (
            <div className="checkout-empty">
              <p>{getText(currentLang, 'empty', 'Votre panier est vide.')}</p>
              <Link
                href={homePath}
                className="checkout-empty__link"
                title={getText(currentLang, 'continueShopping', 'Continuer mes achats')}
              >
                {getText(currentLang, 'continueShopping', 'Continuer mes achats')}
              </Link>
            </div>
          ) : (
            <div className="checkout-layout">
              <div className="checkout-main">
                <div className="checkout-steps">
                  <div className="checkout-step">
                    <div className="checkout-step__title-row">
                      <span className="checkout-step__index">01</span>
                      <span className="checkout-step__title">
                        {getText(currentLang, 'cartStep', 'Mon panier')}
                      </span>
                    </div>
                    <div className="checkout-step__sub">
                      {getText(currentLang, 'cartStepSub', 'Détail de votre produits')}
                    </div>
                  </div>

                  <div className="checkout-step checkout-step--active">
                    <div className="checkout-step__title-row">
                      <span className="checkout-step__index">02</span>
                      <span className="checkout-step__title">
                        {getText(currentLang, 'deliveryStep', 'Livraison')}
                      </span>
                    </div>
                    <div className="checkout-step__sub">
                      {getText(currentLang, 'deliveryStepSub', 'Mes information de livraison')}
                    </div>
                  </div>

                  <div className="checkout-step">
                    <div className="checkout-step__title-row">
                      <span className="checkout-step__index">03</span>
                      <span className="checkout-step__title">
                        {getText(currentLang, 'confirmStep', 'Confirmation')}
                      </span>
                    </div>
                    <div className="checkout-step__sub">
                      {getText(currentLang, 'confirmStepSub', 'Récapitulatif de ma commande')}
                    </div>
                  </div>
                </div>

                <form className="checkout-form" onSubmit={handleSubmit}>
                  <h2 className="checkout-form__title">
                    {getText(currentLang, 'coords', 'Vos coordonnées')}
                  </h2>

                  <div className="checkout-form__group">
                    <label className="checkout-form__label">
                      {getText(currentLang, 'country', 'Pays *')}
                    </label>
                    <input
                      className="checkout-form__input"
                      name="del-address-country"
                      value={form['del-address-country']}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="checkout-form__row checkout-form__row--2">
                    <input
                      className="checkout-form__input"
                      name="del-firstname"
                      placeholder={getText(currentLang, 'firstname', 'Prénom *')}
                      value={form['del-firstname']}
                      onChange={handleChange}
                    />
                    <input
                      className="checkout-form__input"
                      name="del-lastname"
                      placeholder={getText(currentLang, 'lastname', 'Nom *')}
                      value={form['del-lastname']}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="checkout-form__group">
                    <input
                      className="checkout-form__input"
                      name="del-compagny"
                      placeholder={getText(currentLang, 'company', 'Société')}
                      value={form['del-compagny']}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="checkout-form__group">
                    <input
                      className="checkout-form__input"
                      name="del-address-street"
                      placeholder={getText(currentLang, 'address', 'Numéro et Rue *')}
                      value={form['del-address-street']}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="checkout-form__row checkout-form__row--2">
                    <input
                      className="checkout-form__input"
                      name="del-address-zip"
                      placeholder={getText(currentLang, 'zip', 'Code postal *')}
                      value={form['del-address-zip']}
                      onChange={handleChange}
                    />
                    <input
                      className="checkout-form__input"
                      name="del-address-locality"
                      placeholder={getText(currentLang, 'city', 'Ville *')}
                      value={form['del-address-locality']}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="checkout-form__row checkout-form__row--2">
                    <input
                      className="checkout-form__input"
                      type="email"
                      name="del-mail"
                      placeholder={getText(currentLang, 'email', 'Email *')}
                      value={form['del-mail']}
                      onChange={handleChange}
                    />
                    <input
                      className="checkout-form__input"
                      name="del-phone"
                      placeholder={getText(currentLang, 'phone', 'Téléphone *')}
                      value={form['del-phone']}
                      onChange={handleChange}
                    />
                  </div>

                  <label className="checkout-form__check">
                    <input
                      type="checkbox"
                      name="fact-other"
                      checked={form['fact-other'] === '1'}
                      onChange={handleChange}
                    />
                    <span>
                      {getText(
                        currentLang,
                        'billingOther',
                        'Utiliser une adresse de facturation différente'
                      )}
                    </span>
                  </label>

                  {showBillingForm ? (
                    <div className="checkout-billing">
                      <h3 className="checkout-billing__title">
                        {getText(currentLang, 'billingTitle', 'Adresse de facturation')}
                      </h3>

                      <div className="checkout-form__row checkout-form__row--2">
                        <input
                          className="checkout-form__input"
                          name="fact-firstname"
                          placeholder={getText(currentLang, 'firstname', 'Prénom *')}
                          value={form['fact-firstname']}
                          onChange={handleChange}
                        />
                        <input
                          className="checkout-form__input"
                          name="fact-lastname"
                          placeholder={getText(currentLang, 'lastname', 'Nom *')}
                          value={form['fact-lastname']}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="checkout-form__group">
                        <input
                          className="checkout-form__input"
                          name="fact-compagny"
                          placeholder={getText(currentLang, 'company', 'Société')}
                          value={form['fact-compagny']}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="checkout-form__group">
                        <input
                          className="checkout-form__input"
                          name="fact-address-street"
                          placeholder={getText(currentLang, 'address', 'Numéro et Rue *')}
                          value={form['fact-address-street']}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="checkout-form__row checkout-form__row--2">
                        <input
                          className="checkout-form__input"
                          name="fact-address-zip"
                          placeholder={getText(currentLang, 'zip', 'Code postal *')}
                          value={form['fact-address-zip']}
                          onChange={handleChange}
                        />
                        <input
                          className="checkout-form__input"
                          name="fact-address-locality"
                          placeholder={getText(currentLang, 'city', 'Ville *')}
                          value={form['fact-address-locality']}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="checkout-form__group">
                        <input
                          className="checkout-form__input"
                          name="fact-address-country"
                          placeholder={getText(currentLang, 'country', 'Pays *')}
                          value={form['fact-address-country']}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="checkout-form__group">
                    <textarea
                      className="checkout-form__textarea"
                      name="message"
                      placeholder={getText(currentLang, 'orderMessage', 'Message de commande')}
                      value={form.message}
                      onChange={handleChange}
                      rows="5"
                    />
                  </div>

                  <label className="checkout-form__check">
                    <input
                      type="checkbox"
                      name="mailing-accept"
                      checked={form['mailing-accept'] === '1'}
                      onChange={handleChange}
                    />
                    <span>{getText(currentLang, 'newsletter', 'Recevoir la newsletter')}</span>
                  </label>

                  {error ? <p className="checkout-form__error">{error}</p> : null}

                  <button type="submit" className="checkout-submit">
                    {getText(currentLang, 'submit', 'Je finalise ma commande')}
                  </button>
                </form>
              </div>

              <aside className="checkout-summary">
                <div className="checkout-summary__box">
                  <h2 className="checkout-summary__title">
                    {getText(currentLang, 'orderSummary', 'Votre commande')}
                  </h2>

                  <div className="checkout-summary__row">
                    <div className="checkout-summary__label">
                      {getText(currentLang, 'subtotal', 'Sous-total')}
                    </div>
                    <div className="checkout-summary__value">
                      {formatPrice(subtotalPrice)}
                    </div>
                  </div>

                  {discountAmount > 0 ? (
                    <div className="checkout-summary__row">
                      <div className="checkout-summary__label">
                        {getText(currentLang, 'discount', 'Remise')} (-{Number(discountPercent || 0)}%)
                      </div>
                      <div className="checkout-summary__value">
                        -{formatPrice(discountAmount)}
                      </div>
                    </div>
                  ) : null}

                  <div className="checkout-summary__row">
                    <div className="checkout-summary__label">
                      {getText(currentLang, 'shipping', 'Préparation & envoi')}
                      <span className="checkout-summary__sub">
                        Livraison en : {shippingCountry}
                      </span>
                    </div>
                    <div className="checkout-summary__value">
                      {shippingPrice === 0 ? '0.00 eur' : formatPrice(shippingPrice)}
                    </div>
                  </div>

                  <div className="checkout-summary__info">
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

                  <div className="checkout-summary__total">
                    <span>{getText(currentLang, 'total', 'Total')}</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>

                  {discountAmount > 0 ? (
                    <p className="checkout-summary__note">
                      Total produits remisés : {formatPrice(discountedSubtotalPrice)}
                    </p>
                  ) : null}

                  <p className="checkout-summary__note">
                    {getText(
                      currentLang,
                      'orderNote',
                      'Livraison à 4.90€ et GRATUITE dès 4 paires achetées.'
                    )}
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>

      <Footer lang={currentLang} />
    </div>
  );
};

export default Checkout;