"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAccount } from '../context/AccountContext';
import { allowedLangs, defaultLang } from '../config';

const textByLang = {
    pageTitle: {
        fr: 'Mon compte',
        en: 'My account',
        it: 'Il mio account',
        de: 'Mein Konto',
    },
    email: {
        fr: 'Email',
        en: 'Email',
        it: 'Email',
        de: 'E-Mail',
    },
    password: {
        fr: 'Mot de passe',
        en: 'Password',
        it: 'Password',
        de: 'Passwort',
    },
    login: {
        fr: 'Se connecter',
        en: 'Log in',
        it: 'Accedi',
        de: 'Anmelden',
    },
    noPassword: {
        fr: "Je n'ai pas de mot de passe",
        en: "I don't have a password",
        it: 'Non ho una password',
        de: 'Ich habe kein Passwort',
    },
    backToLogin: {
        fr: 'Retour à la connexion',
        en: 'Back to login',
        it: 'Torna al login',
        de: 'Zurück zur Anmeldung',
    },
    requestPasswordTitle: {
        fr: 'Première connexion / mot de passe oublié',
        en: 'First login / forgot password',
        it: 'Primo accesso / password dimenticata',
        de: 'Erste Anmeldung / Passwort vergessen',
    },
    requestPasswordHint: {
        fr: 'Indiquez l’email utilisé lors de votre commande, nous vous enverrons un lien pour choisir votre mot de passe.',
        en: 'Enter the email used for your order, we will send you a link to set your password.',
        it: "Inserisci l'email usata per il tuo ordine, ti invieremo un link per scegliere la tua password.",
        de: 'Geben Sie die E-Mail-Adresse Ihrer Bestellung ein, wir senden Ihnen einen Link zur Passwortvergabe.',
    },
    sendPassword: {
        fr: 'Recevoir le lien',
        en: 'Send me the link',
        it: 'Invia il link',
        de: 'Link senden',
    },
    passwordSent: {
        fr: 'Un email contenant un lien pour choisir votre mot de passe vient de vous être envoyé.',
        en: 'An email with a link to set your password has just been sent to you.',
        it: "Un'email con un link per scegliere la tua password ti è appena stata inviata.",
        de: 'Eine E-Mail mit einem Link zur Passwortvergabe wurde soeben an Sie gesendet.',
    },
    setPasswordTitle: {
        fr: 'Choisissez votre mot de passe',
        en: 'Choose your password',
        it: 'Scegli la tua password',
        de: 'Wählen Sie Ihr Passwort',
    },
    newPassword: {
        fr: 'Nouveau mot de passe',
        en: 'New password',
        it: 'Nuova password',
        de: 'Neues Passwort',
    },
    setPasswordSubmit: {
        fr: 'Valider et me connecter',
        en: 'Confirm and log in',
        it: 'Conferma e accedi',
        de: 'Bestätigen und anmelden',
    },
    invalidCode: {
        fr: 'Ce lien est invalide ou a expiré.',
        en: 'This link is invalid or has expired.',
        it: 'Questo link non è valido o è scaduto.',
        de: 'Dieser Link ist ungültig oder abgelaufen.',
    },
    logout: {
        fr: 'Déconnexion',
        en: 'Log out',
        it: 'Disconnetti',
        de: 'Abmelden',
    },
    myOrders: {
        fr: 'Mes commandes',
        en: 'My orders',
        it: 'I miei ordini',
        de: 'Meine Bestellungen',
    },
    orderRef: {
        fr: 'Commande',
        en: 'Order',
        it: 'Ordine',
        de: 'Bestellung',
    },
    noOrders: {
        fr: 'Aucune commande trouvée.',
        en: 'No orders found.',
        it: 'Nessun ordine trovato.',
        de: 'Keine Bestellungen gefunden.',
    },
    shippingActivity: {
        fr: 'Suivi de livraison',
        en: 'Shipping activity',
        it: 'Attività di spedizione',
        de: 'Sendungsverfolgung',
    },
    invoice: {
        fr: 'Voir la facture',
        en: 'View invoice',
        it: 'Vedi fattura',
        de: 'Rechnung ansehen',
    },
    trackingNumber: {
        fr: 'Numéro de suivi',
        en: 'Tracking number',
        it: 'Numero di tracciamento',
        de: 'Sendungsnummer',
    },
    noTracking: {
        fr: 'Pas encore de suivi disponible.',
        en: 'No tracking available yet.',
        it: 'Tracciamento non ancora disponibile.',
        de: 'Noch keine Sendungsverfolgung verfügbar.',
    },
    statusLabels: {
        waiting: {
            fr: 'En attente de paiement',
            en: 'Waiting for payment',
            it: 'In attesa di pagamento',
            de: 'Zahlung ausstehend',
        },
        paid: {
            fr: 'Payée',
            en: 'Paid',
            it: 'Pagato',
            de: 'Bezahlt',
        },
        refused: {
            fr: 'Refusée',
            en: 'Refused',
            it: 'Rifiutato',
            de: 'Abgelehnt',
        },
        prepared: {
            fr: 'Préparée',
            en: 'Prepared',
            it: 'Preparato',
            de: 'Vorbereitet',
        },
        shipped: {
            fr: 'Expédiée',
            en: 'Shipped',
            it: 'Spedito',
            de: 'Versandt',
        },
    },
};

const getText = (lang, key, fallback = '') => {
    const entry = textByLang[key];
    return entry?.[lang] || entry?.[defaultLang] || fallback;
};

const getStatusLabel = (lang, status) => {
    const entry = textByLang.statusLabels[status];
    return entry?.[lang] || entry?.[defaultLang] || status;
};

const formatDate = (timestamp, lang) => {
    if (!timestamp) return '';
    try {
        return new Intl.DateTimeFormat(lang, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date(timestamp * 1000));
    } catch {
        return '';
    }
};

const AccountInner = ({ lang: langProp } = {}) => {
    const params = useParams();
    const searchParams = useSearchParams();
    const resetCode = searchParams?.get('code') || '';
    const lang = langProp || params?.lang || params?.segments?.[0];
    const currentLang = allowedLangs.includes(lang) ? lang : defaultLang;

    const {
        isLoggedIn,
        customer,
        ready,
        login,
        requestPassword,
        setPassword: submitNewPassword,
        fetchOrders,
        getInvoiceUrl,
        logout,
    } = useAccount();

    const [mode, setMode] = useState(resetCode ? 'reset' : 'login'); // 'login' | 'request' | 'reset'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordSent, setPasswordSent] = useState(false);

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState('');

    useEffect(() => {
        if (!isLoggedIn) return;

        let isMounted = true;
        setOrdersLoading(true);
        setOrdersError('');

        fetchOrders()
            .then((data) => {
                if (isMounted) setOrders(data);
            })
            .catch((err) => {
                if (isMounted) setOrdersError(err.message || 'Erreur');
            })
            .finally(() => {
                if (isMounted) setOrdersLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [isLoggedIn]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
        } catch (err) {
            setError(err.message || 'Erreur de connexion.');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestPassword = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await requestPassword(email, currentLang);
            setPasswordSent(true);
        } catch (err) {
            setError(err.message || 'Erreur.');
        } finally {
            setLoading(false);
        }
    };

    const handleSetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await submitNewPassword(resetCode, newPassword);
        } catch (err) {
            setError(err.message || getText(currentLang, 'invalidCode'));
        } finally {
            setLoading(false);
        }
    };

    if (!ready) {
        return (
            <div>
                <Header lang={currentLang} />
                <div className="container" style={{ padding: '80px 0' }} />
                <Footer lang={currentLang} />
            </div>
        );
    }

    return (
        <div>
            <Header lang={currentLang} />

            <div className="page-title-wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="page-title">
                                <h3>{getText(currentLang, 'pageTitle', 'Mon compte')}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ padding: '60px 0', maxWidth: 600 }}>
                {!isLoggedIn ? (
                    <>
                        {mode === 'reset' ? (
                            <form onSubmit={handleSetPassword}>
                                <h4>{getText(currentLang, 'setPasswordTitle')}</h4>

                                <div className="form-group contuct_f">
                                    <label htmlFor="account-new-password">
                                        {getText(currentLang, 'newPassword')}
                                    </label>
                                    <input
                                        type="password"
                                        id="account-new-password"
                                        className="form-control"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        minLength={4}
                                        required
                                    />
                                </div>

                                {error && <p style={{ color: 'red' }}>{error}</p>}

                                <button
                                    type="submit"
                                    className="btn btn-default contact-btn"
                                    disabled={loading}
                                >
                                    {getText(currentLang, 'setPasswordSubmit')}
                                </button>
                            </form>
                        ) : mode === 'login' ? (
                            <form onSubmit={handleLogin}>
                                <div className="form-group contuct_f">
                                    <label htmlFor="account-email">
                                        {getText(currentLang, 'email', 'Email')}
                                    </label>
                                    <input
                                        type="email"
                                        id="account-email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group contuct_f">
                                    <label htmlFor="account-password">
                                        {getText(currentLang, 'password', 'Mot de passe')}
                                    </label>
                                    <input
                                        type="password"
                                        id="account-password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {error && <p style={{ color: 'red' }}>{error}</p>}

                                <button
                                    type="submit"
                                    className="btn btn-default contact-btn"
                                    disabled={loading}
                                >
                                    {getText(currentLang, 'login', 'Se connecter')}
                                </button>

                                <p style={{ marginTop: 20 }}>
                                    <a
                                        href="#"
                                        title={getText(currentLang, 'noPassword', "Je n'ai pas de mot de passe")}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setError('');
                                            setMode('request');
                                        }}
                                    >
                                        {getText(currentLang, 'noPassword', "Je n'ai pas de mot de passe")}
                                    </a>
                                </p>
                            </form>
                        ) : (
                            <div>
                                <h4>{getText(currentLang, 'requestPasswordTitle', 'Recevoir mon mot de passe')}</h4>

                                {passwordSent ? (
                                    <p>{getText(currentLang, 'passwordSent')}</p>
                                ) : (
                                    <form onSubmit={handleRequestPassword}>
                                        <p>{getText(currentLang, 'requestPasswordHint')}</p>

                                        <div className="form-group contuct_f">
                                            <label htmlFor="account-request-email">
                                                {getText(currentLang, 'email', 'Email')}
                                            </label>
                                            <input
                                                type="email"
                                                id="account-request-email"
                                                className="form-control"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {error && <p style={{ color: 'red' }}>{error}</p>}

                                        <button
                                            type="submit"
                                            className="btn btn-default contact-btn"
                                            disabled={loading}
                                        >
                                            {getText(currentLang, 'sendPassword')}
                                        </button>
                                    </form>
                                )}

                                <p style={{ marginTop: 20 }}>
                                    <a
                                        href="#"
                                        title={getText(currentLang, 'backToLogin', 'Retour à la connexion')}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setError('');
                                            setPasswordSent(false);
                                            setMode('login');
                                        }}
                                    >
                                        {getText(currentLang, 'backToLogin', 'Retour à la connexion')}
                                    </a>
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 30,
                            }}
                        >
                            <h4 style={{ margin: 0 }}>
                                {getText(currentLang, 'myOrders', 'Mes commandes')}
                                {customer?.firstname ? ` — ${customer.firstname}` : ''}
                            </h4>

                            <a
                                href="#"
                                title={getText(currentLang, 'logout', 'Déconnexion')}
                                onClick={(e) => {
                                    e.preventDefault();
                                    logout();
                                }}
                            >
                                {getText(currentLang, 'logout', 'Déconnexion')}
                            </a>
                        </div>

                        {ordersLoading && <p>...</p>}
                        {ordersError && <p style={{ color: 'red' }}>{ordersError}</p>}

                        {!ordersLoading && !ordersError && orders.length === 0 && (
                            <p>{getText(currentLang, 'noOrders')}</p>
                        )}

                        {orders.map((order) => (
                            <div
                                key={order.reference}
                                style={{
                                    border: '1px solid #eee',
                                    padding: 20,
                                    marginBottom: 20,
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                        marginBottom: 12,
                                    }}
                                >
                                    <strong>
                                        {getText(currentLang, 'orderRef', 'Commande')} {order.reference}
                                    </strong>
                                    <span>{formatDate(order.date, currentLang)}</span>
                                    <span>{getStatusLabel(currentLang, order.status)}</span>
                                    <span>
                                        {Number(order.total || 0).toFixed(2)} {order.currency}
                                    </span>
                                    {order.hasInvoice && (
                                        <a
                                            href={getInvoiceUrl(order)}
                                            target="_blank"
                                            rel="noreferrer"
                                            title={getText(currentLang, 'invoice')}
                                        >
                                            {getText(currentLang, 'invoice')}
                                        </a>
                                    )}
                                </div>

                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px' }}>
                                    {order.products.map((product, index) => (
                                        <li key={index}>
                                            {product.quantity} x {product.name}
                                            {product.size ? ` (${product.size})` : ''}
                                        </li>
                                    ))}
                                </ul>

                                <div style={{ borderTop: '1px solid #eee', paddingTop: 12 }}>
                                    <strong>{getText(currentLang, 'shippingActivity')}</strong>

                                    {order.shipping?.trackingNumber ? (
                                        <div>
                                            <p>
                                                {getText(currentLang, 'trackingNumber')}:{' '}
                                                {order.shipping.trackingNumber}
                                            </p>

                                            {order.shipping.events?.length > 0 && (
                                                <ul>
                                                    {order.shipping.events.map((event, index) => (
                                                        <li key={index}>
                                                            {event.label || event.code} — {event.date}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ) : (
                                        <p>{getText(currentLang, 'noTracking')}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer lang={currentLang} />
        </div>
    );
};

const Account = (props) => (
    <Suspense fallback={null}>
        <AccountInner {...props} />
    </Suspense>
);

export default Account;
