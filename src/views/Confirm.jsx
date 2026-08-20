"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { allowedLangs, defaultLang, getLocalizedValue } from '../config';

const getItemName = (item, lang) =>
    getLocalizedValue(item?.nameTranslations, lang, item?.name || '');

const PAYMENT_API_URL = '/laceter-api-payment/prepare_payment.php';
const CHECKOUT_STORAGE_KEY = 'checkout_form';

const textByLang = {
    pageTitle: {
        fr: 'Mon panier',
        en: 'My cart',
        it: 'Il mio carrello',
        de: 'Mein Warenkorb',
        es: 'Mi carrito',
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
    addresses: {
        fr: 'Adresses',
        en: 'Addresses',
        it: 'Indirizzi',
        de: 'Adressen',
        es: 'Direcciones',
    },
    deliveryAddress: {
        fr: 'Adresse de livraison',
        en: 'Delivery address',
        it: 'Indirizzo di consegna',
        de: 'Lieferadresse',
        es: 'Dirección de entrega',
    },
    billingAddress: {
        fr: 'Adresse de facturation',
        en: 'Billing address',
        it: 'Indirizzo di fatturazione',
        de: 'Rechnungsadresse',
        es: 'Dirección de facturación',
    },
    orderTitle: {
        fr: 'Votre commande',
        en: 'Your order',
        it: 'Il tuo ordine',
        de: 'Ihre Bestellung',
        es: 'Tu pedido',
    },
    product: {
        fr: 'Intitulé',
        en: 'Product',
        it: 'Prodotto',
        de: 'Produkt',
        es: 'Producto',
    },
    price: {
        fr: 'Price',
        en: 'Price',
        it: 'Prezzo',
        de: 'Preis',
        es: 'Precio',
    },
    quantity: {
        fr: 'Qté',
        en: 'Qty',
        it: 'Qtà',
        de: 'Menge',
        es: 'Cant.',
    },
    total: {
        fr: 'Total',
        en: 'Total',
        it: 'Totale',
        de: 'Gesamt',
        es: 'Total',
    },
    color: {
        fr: 'Couleur',
        en: 'Color',
        it: 'Colore',
        de: 'Farbe',
        es: 'Color',
    },
    size: {
        fr: 'Taille',
        en: 'Size',
        it: 'Taglia',
        de: 'Größe',
        es: 'Talla',
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
    shipping: {
        fr: 'Préparation & envoi',
        en: 'Shipping',
        it: 'Preparazione e spedizione',
        de: 'Versand',
        es: 'Preparación y envío',
    },
    paymentMethod: {
        fr: 'Moyen de paiement',
        en: 'Payment method',
        it: 'Metodo di pagamento',
        de: 'Zahlungsmethode',
        es: 'Método de pago',
    },
    card: {
        fr: 'Carte bancaire',
        en: 'Credit card',
        it: 'Carta bancaria',
        de: 'Kreditkarte',
        es: 'Tarjeta bancaria',
    },
    paypal: {
        fr: 'Paypal (+3% de frais)',
        en: 'PayPal (+3% fee)',
        it: 'Paypal (+3% di costi)',
        de: 'PayPal (+3% Gebühr)',
        es: 'Paypal (+3% de comisión)',
    },
    cgv: {
        fr: 'J’accepte les conditions générales de vente',
        en: 'I accept the terms and conditions',
        it: 'Accetto i termini e condizioni di vendita',
        de: 'Ich akzeptiere die AGB',
        es: 'Acepto los términos y condiciones de venta',
    },
    submit: {
        fr: 'Je finalise ma commande',
        en: 'Finalize order',
        it: 'Finalizzo il mio ordine',
        de: 'Bestellung abschließen',
        es: 'Finalizar mi pedido',
    },
};

const getText = (lang, key, fallback = '') => {
    const entry = textByLang[key];
    return entry?.[lang] || entry?.[defaultLang] || fallback;
};

const formatPrice = (value) => `${Number(value || 0).toFixed(2)} eur`;

const readSavedForm = () => {
    try {
        const raw = localStorage.getItem(CHECKOUT_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
};

const Confirm = ({ lang: langProp } = {}) => {
    const params = useParams();
  const lang = langProp || params?.lang || params?.segments?.[0];
    const currentLang = allowedLangs.includes(lang) ? lang : defaultLang;
    const router = useRouter();

    const {
        cart,
        subtotalPrice,
        shippingPrice,
        totalPrice,
        commandRef,
        ensureCommandRef,
        clearCartAndCreateNewRef,
    } = useCart();

    const [checkoutForm] = useState(readSavedForm);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [acceptCgv, setAcceptCgv] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const homePath = currentLang === defaultLang ? '/' : `/${currentLang}`;
    const checkoutPath = currentLang === defaultLang ? '/checkout' : `/${currentLang}/checkout`;

    const paymentFee = useMemo(() => {
        if (paymentMethod !== 'paypal') return 0;
        return totalPrice * 0.03;
    }, [paymentMethod, totalPrice]);

    const finalTotal = totalPrice + paymentFee;

    const normalizeCartForApi = () => {
        return cart.map((item) => ({
            id: Number(item.id),
            sku: item.sku || '',
            referenceIndex: Number(item.referenceIndex ?? 0),
            quantity: Number(item.quantity ?? 1),
            price: Number(item.price ?? 0),
            name: getItemName(item, currentLang),
            referenceTitle: item.referenceTitle || '',
            range: item.range ?? '',
        }));
    };

    const handleSubmit = async () => {
        if (!cart.length) {
            setError('Votre panier est vide.');
            return;
        }

        if (!checkoutForm) {
            setError('Les informations de livraison sont introuvables.');
            router.push(checkoutPath);
            return;
        }

        if (!acceptCgv) {
            setError('Vous devez accepter les conditions générales de vente.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const ref = commandRef || ensureCommandRef();

            const response = await fetch(PAYMENT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cart: normalizeCartForApi(),
                    command_ref: ref,
                    payment_method: paymentMethod,
                    payment_fee: Number(paymentFee.toFixed(2)),
                    total_price: Number(finalTotal.toFixed(2)),
                    ...checkoutForm,
                    'cgv-accept': acceptCgv ? '1' : '0',
                }),
            });

            const text = await response.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch (jsonError) {
                throw new Error(text || 'Réponse serveur invalide.');
            }

            if (!response.ok || !data.success) {
                throw new Error(data.message || `Erreur HTTP ${response.status}`);
            }

            if (!data.redirect_url) {
                throw new Error('URL de redirection manquante.');
            }

            localStorage.removeItem(CHECKOUT_STORAGE_KEY);
            clearCartAndCreateNewRef();
            window.location.href = data.redirect_url;
        } catch (err) {
            console.error(err);
            setError(err.message || 'Impossible de préparer le paiement.');
        } finally {
            setLoading(false);
        }
    };

    const deliveryAddress = checkoutForm
        ? [
            `${checkoutForm['del-firstname']} ${checkoutForm['del-lastname']}`.trim(),
            checkoutForm['del-compagny'],
            checkoutForm['del-address-street'],
            `${checkoutForm['del-address-zip']} ${checkoutForm['del-address-locality']}, ${checkoutForm['del-address-country']}`.trim(),
        ].filter(Boolean)
        : [];

    const billingAddress = checkoutForm
        ? checkoutForm['fact-other'] === '1'
            ? [
                `${checkoutForm['fact-firstname']} ${checkoutForm['fact-lastname']}`.trim(),
                checkoutForm['fact-compagny'],
                checkoutForm['fact-address-street'],
                `${checkoutForm['fact-address-zip']} ${checkoutForm['fact-address-locality']}, ${checkoutForm['fact-address-country']}`.trim(),
            ].filter(Boolean)
            : deliveryAddress
        : [];

    return (
        <div>
            <Header lang={currentLang} />

            <div className="confirm-page">
                <div className="container">
                    <h1 className="confirm-page__title">
                        {getText(currentLang, 'pageTitle', 'Mon panier')}
                    </h1>

                    {cart.length === 0 ? (
                        <div className="confirm-empty">
                            <p>{getText(currentLang, 'empty', 'Votre panier est vide.')}</p>
                            <Link
                                href={homePath}
                                className="confirm-empty__link"
                                title={getText(currentLang, 'continueShopping', 'Continuer mes achats')}
                            >
                                {getText(currentLang, 'continueShopping', 'Continuer mes achats')}
                            </Link>
                        </div>
                    ) : (
                        <div className="confirm-layout">
                            <div className="confirm-main">
                                <div className="confirm-steps">
                                    <div className="confirm-step">
                                        <div className="confirm-step__title-row">
                                            <span className="confirm-step__index">01</span>
                                            <span className="confirm-step__title">
                                                {getText(currentLang, 'cartStep', 'Mon panier')}
                                            </span>
                                        </div>
                                        <div className="confirm-step__sub">
                                            {getText(currentLang, 'cartStepSub', 'Détail de votre produits')}
                                        </div>
                                    </div>

                                    <div className="confirm-step">
                                        <div className="confirm-step__title-row">
                                            <span className="confirm-step__index">02</span>
                                            <span className="confirm-step__title">
                                                {getText(currentLang, 'deliveryStep', 'Livraison')}
                                            </span>
                                        </div>
                                        <div className="confirm-step__sub">
                                            {getText(currentLang, 'deliveryStepSub', 'Mes information de livraison')}
                                        </div>
                                    </div>

                                    <div className="confirm-step confirm-step--active">
                                        <div className="confirm-step__title-row">
                                            <span className="confirm-step__index">03</span>
                                            <span className="confirm-step__title">
                                                {getText(currentLang, 'confirmStep', 'Confirmation')}
                                            </span>
                                        </div>
                                        <div className="confirm-step__sub">
                                            {getText(currentLang, 'confirmStepSub', 'Récapitulatif de ma commande')}
                                        </div>
                                    </div>
                                </div>

                                <div className="confirm-addresses">
                                    <h2 className="confirm-section__title">
                                        {getText(currentLang, 'addresses', 'Adresses')}
                                    </h2>

                                    <div className="confirm-addresses__grid">
                                        <div>
                                            <h3 className="confirm-addresses__title">
                                                {getText(currentLang, 'deliveryAddress', 'Adresse de livraison')}
                                            </h3>
                                            {deliveryAddress.map((line, index) => (
                                                <p key={`delivery-${index}`} className="confirm-addresses__line">
                                                    {line}
                                                </p>
                                            ))}
                                        </div>

                                        <div>
                                            <h3 className="confirm-addresses__title">
                                                {getText(currentLang, 'billingAddress', 'Adresse de facturation')}
                                            </h3>
                                            {billingAddress.map((line, index) => (
                                                <p key={`billing-${index}`} className="confirm-addresses__line">
                                                    {line}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="confirm-order">
                                    <h2 className="confirm-section__title">
                                        {getText(currentLang, 'orderTitle', 'Votre commande')}
                                    </h2>

                                    <div className="confirm-table__head">
                                        <div>{getText(currentLang, 'product', 'Intitulé')}</div>
                                        <div>{getText(currentLang, 'price', 'Price')}</div>
                                        <div>{getText(currentLang, 'quantity', 'Qté')}</div>
                                        <div>{getText(currentLang, 'total', 'Total')}</div>
                                    </div>

                                    {cart.map((item) => {
                                        const itemName = getItemName(item, currentLang);
                                        const lineTotal =
                                            Number(item.price || 0) * Number(item.quantity || 0);

                                        return (
                                            <div
                                                className="confirm-table__row"
                                                key={`${item.id}-${item.referenceIndex ?? 0}`}
                                            >
                                                <div className="confirm-product">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={itemName}
                                                            title={itemName}
                                                            className="confirm-product__image"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = "none";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="confirm-product__placeholder" />
                                                    )}

                                                    <div className="confirm-product__content">
                                                        <h3 className="confirm-product__name">{itemName}</h3>

                                                        {item.color ? (
                                                            <p className="confirm-product__meta">
                                                                {getText(currentLang, 'color', 'Couleur')} : {item.color}
                                                            </p>
                                                        ) : null}

                                                        {item.size ? (
                                                            <p className="confirm-product__meta">
                                                                {getText(currentLang, 'size', 'Taille')} : {item.size}
                                                            </p>
                                                        ) : null}

                                                        {item.referenceTitle ? (
                                                            <p className="confirm-product__meta">
                                                                {item.referenceTitle}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="confirm-table__price">
                                                    {formatPrice(item.price)}
                                                </div>

                                                <div className="confirm-table__qty">
                                                    {item.quantity}
                                                </div>

                                                <div className="confirm-table__total">
                                                    {formatPrice(lineTotal)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <aside className="confirm-summary">
                                <div className="confirm-summary__box">
                                    <h2 className="confirm-summary__title">
                                        {getText(currentLang, 'orderSummary', 'Votre commande')}
                                    </h2>

                                    <div className="confirm-summary__row">
                                        <div className="confirm-summary__label">
                                            {getText(currentLang, 'subtotal', 'Sous-total')}
                                        </div>
                                        <div className="confirm-summary__value">
                                            {formatPrice(subtotalPrice)}
                                        </div>
                                    </div>

                                    <div className="confirm-summary__row">
                                        <div className="confirm-summary__label">
                                            {getText(currentLang, 'shipping', 'Préparation & envoi')}
                                            <span className="confirm-summary__sub">
                                                Livraison en : {checkoutForm?.['del-address-country'] || 'France'}
                                            </span>
                                        </div>
                                        <div className="confirm-summary__value">
                                            {formatPrice(shippingPrice)}
                                        </div>
                                    </div>

                                    {paymentMethod === 'paypal' ? (
                                        <div className="confirm-summary__row">
                                            <div className="confirm-summary__label">PayPal</div>
                                            <div className="confirm-summary__value">
                                                {formatPrice(paymentFee)}
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="confirm-summary__total">
                                        <span>{getText(currentLang, 'total', 'Total')}</span>
                                        <span>{formatPrice(finalTotal)}</span>
                                    </div>

                                    <div className="confirm-payment">
                                        <h3 className="confirm-payment__title">
                                            {getText(currentLang, 'paymentMethod', 'Moyen de paiement')}
                                        </h3>

                                        <label className="confirm-payment__option">
                                            <input
                                                type="radio"
                                                name="payment-method"
                                                value="card"
                                                checked={paymentMethod === 'card'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <span>{getText(currentLang, 'card', 'Carte bancaire')}</span>
                                        </label>

                                        <label className="confirm-payment__option">
                                            <input
                                                type="radio"
                                                name="payment-method"
                                                value="paypal"
                                                checked={paymentMethod === 'paypal'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <span>{getText(currentLang, 'paypal', 'Paypal (+3% de frais)')}</span>
                                        </label>
                                    </div>
                                </div>

                                <label className="confirm-cgv">
                                    <input
                                        type="checkbox"
                                        checked={acceptCgv}
                                        onChange={(e) => setAcceptCgv(e.target.checked)}
                                    />
                                    <span>
                                        {getText(
                                            currentLang,
                                            'cgv',
                                            'J’accepte les conditions générales de vente'
                                        )}
                                    </span>
                                </label>

                                {error ? <p className="confirm-error">{error}</p> : null}

                                <button
                                    type="button"
                                    className="confirm-submit"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading
                                        ? 'Préparation...'
                                        : getText(currentLang, 'submit', 'Je finalise ma commande')}
                                </button>
                            </aside>
                        </div>
                    )}
                </div>
            </div>

            <Footer lang={currentLang} />
        </div>
    );
};

export default Confirm;