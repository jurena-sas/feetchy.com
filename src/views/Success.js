"use client";

import React, { useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { allowedLangs, defaultLang } from '../config';

const textByLang = {
    title: {
        fr: 'Commande confirmée',
        en: 'Order confirmed',
        it: 'Ordine confermato',
        de: 'Bestellung bestätigt',
        es: 'Pedido confirmado',
    },
    message: {
        fr: 'Merci pour votre commande. Elle a bien été enregistrée et un e-mail de confirmation vient de vous être envoyé.',
        en: 'Thank you for your order. It has been successfully registered and a confirmation email has been sent to you.',
        it: 'Grazie per il tuo ordine. È stato registrato correttamente e ti è stata inviata un’e-mail di conferma.',
        de: 'Vielen Dank für Ihre Bestellung. Sie wurde erfolgreich erfasst und eine Bestätigungs-E-Mail wurde an Sie gesendet.',
        es: 'Gracias por tu pedido. Se ha registrado correctamente y se te ha enviado un correo de confirmación.',
    },
    reference: {
        fr: 'Votre référence de commande est :',
        en: 'Your order reference is:',
        it: 'Il riferimento del tuo ordine è:',
        de: 'Ihre Bestellreferenz lautet:',
        es: 'La referencia de tu pedido es:',
    },
};

const getText = (lang, key) => {
    return textByLang[key]?.[lang] || textByLang[key]?.[defaultLang] || '';
};

const Success = ({ lang: langProp } = {}) => {
    const params = useParams();
  const lang = langProp || params?.lang || params?.segments?.[0];
    const currentLang = allowedLangs.includes(lang) ? lang : defaultLang;

    const { clearCartAndCreateNewRef } = useCart();
    const hasRun = useRef(false);

    // 🔥 récupération de la vraie ref depuis l'URL
    const searchParams = useSearchParams();
    const orderReference = searchParams.get('ref');

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        clearCartAndCreateNewRef();
    }, [clearCartAndCreateNewRef]);

    return (
        <div>
            <Header lang={currentLang} />

            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <h1>{getText(currentLang, 'title')}</h1>
                <p>{getText(currentLang, 'message')}</p>

                {orderReference && (
                    <p>
                        {getText(currentLang, 'reference')}{' '}
                        <strong>{orderReference}</strong>
                    </p>
                )}
            </div>

            <Footer lang={currentLang} />
        </div>
    );
};

export default Success;