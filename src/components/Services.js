import React from 'react';
import { defaultLang, getLocalizedValue } from '../config.js';

const services = [
    {
        icon: 'fa-truck',
        title: {
            fr: 'Livraison offerte',
            en: 'Free shipping',
            it: 'Spedizione gratuita',
            de: 'Kostenloser Versand',
            es: 'Envío gratis',
        },
        subtitle: {
            fr: 'Dès 4 paires achetées',
            en: 'From 4 pairs purchased',
            it: 'A partire da 4 paia acquistate',
            de: 'Ab 4 gekauften Paaren',
            es: 'A partir de 4 pares comprados',
        },
    },
    {
        icon: 'fa-certificate',
        title: {
            fr: 'Qualité premium',
            en: 'Premium quality',
            it: 'Qualità premium',
            de: 'Premium-Qualität',
            es: 'Calidad premium',
        },
        subtitle: {
            fr: 'Matériaux durables et soignés',
            en: 'Durable, carefully selected materials',
            it: 'Materiali durevoli e curati',
            de: 'Langlebige, sorgfältig ausgewählte Materialien',
            es: 'Materiales duraderos y cuidados',
        },
    },
    {
        icon: 'fa-lock',
        title: {
            fr: 'Paiement 100% sécurisé',
            en: '100% secure payment',
            it: 'Pagamento 100% sicuro',
            de: '100% sichere Zahlung',
            es: 'Pago 100% seguro',
        },
        subtitle: {
            fr: 'Carte bancaire ou PayPal',
            en: 'Credit card or PayPal',
            it: 'Carta di credito o PayPal',
            de: 'Kreditkarte oder PayPal',
            es: 'Tarjeta bancaria o PayPal',
        },
    },
    {
        icon: 'fa-headphones',
        title: {
            fr: 'Service client',
            en: 'Customer service',
            it: 'Servizio clienti',
            de: 'Kundenservice',
            es: 'Atención al cliente',
        },
        subtitle: {
            fr: 'Réponse sous 24h',
            en: 'Reply within 24h',
            it: 'Risposta entro 24 ore',
            de: 'Antwort innerhalb von 24 Std.',
            es: 'Respuesta en 24h',
        },
    },
];

const Services = ({ lang = defaultLang }) => {
    return (
        <div className="service-area home-page-2 ptb-25">
            <div className="container">
                <div className="row">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="col-lg-3 col-md-3 col-sm-3 col-xs-12 mar_b-30"
                        >
                            <div className="service-wrapper">
                                <div className="service-icon">
                                    <i className={`fa ${service.icon}`}></i>
                                </div>
                                <div className="service-content">
                                    <h4>{getLocalizedValue(service.title, lang)}</h4>
                                    <span>{getLocalizedValue(service.subtitle, lang)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;
