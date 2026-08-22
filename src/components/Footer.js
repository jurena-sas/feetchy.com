import React from 'react';

import FooterNav1 from './FooterNav1';
import FooterNav2 from './FooterNav2';
import { defaultLang, getLocalizedValue } from '../config.js';

const paymentText = {
    title: {
        fr: 'Paiement sécurisé',
        en: 'Secure payment',
        it: 'Pagamento sicuro',
        de: 'Sichere Zahlung',
        es: 'Pago seguro',
    },
    info: {
        fr: 'Vos paiements sont cryptés et 100% sécurisés.',
        en: 'Your payments are encrypted and 100% secure.',
        it: 'I tuoi pagamenti sono crittografati e sicuri al 100%.',
        de: 'Ihre Zahlungen sind verschlüsselt und zu 100% sicher.',
        es: 'Tus pagos están cifrados y 100% seguros.',
    },
};

const Footer = ({ lang = defaultLang }) => {
    return (
        <div className="footer-area footer-area-2 ptb-80">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-5 col-sm-6 col-xs-12 mar_b-30">
                        <div className="footer-wrapper">
                            <div className="footer-logo">
                                <img src="/assets/img/logo-n.png" alt="Feetchy" title="Feetchy" />
                            </div>
                            <p>Feetchy propose des lacets de qualité, pensés pour sublimer vos chaussures au quotidien. Styles, couleurs et finitions soignées pour donner une nouvelle vie à chaque paire.</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 hidden-sm col-xs-12 mar_b-30">
                        <FooterNav1 lang={lang} />
                    </div>
                    <div className="col-lg-3 col-md-3 hidden-sm col-xs-12 mar_b-30">
                        <FooterNav2 lang={lang} />
                    </div>
                    <div className="col-lg-3 col-md-3 hidden-sm col-xs-12 mar_b-30">
                        <div className="footer-wrapper">
                            <div className="footer-title">
                                <h3>{getLocalizedValue(paymentText.title, lang, 'Paiement sécurisé')}</h3>
                            </div>
                            <p>{getLocalizedValue(paymentText.info, lang, 'Vos paiements sont cryptés et 100% sécurisés.')}</p>
                            <div className="footer-payment-badge">
                                <img
                                    src="/assets/img/payment_c.png"
                                    alt={getLocalizedValue(paymentText.title, lang, 'Paiement sécurisé')}
                                    title={getLocalizedValue(paymentText.title, lang, 'Paiement sécurisé')}
                                    className="footer-payment-icons"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;