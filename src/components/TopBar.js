"use client";

import React, { useMemo } from 'react';
import {
    defaultLang,
    getLocalizedValue,
    uiTranslations,
} from '../config';
import { useCart } from '../context/CartContext';
import { useDiscount } from '../context/DiscountContext';

const TopBar = ({ lang = defaultLang }) => {
    const { freeShippingFromQty } = useCart();
    const { activeDiscount } = useDiscount();

    const freeShippingText = getLocalizedValue(
        uiTranslations.freeShippingFromQty,
        lang
    ).replace('{qty}', freeShippingFromQty);

    const promoText = useMemo(() => {
        if (!activeDiscount) return '';

        const title = getLocalizedValue(
            activeDiscount.discount_title,
            lang,
            ''
        );

        const percent = activeDiscount.discount_percent;
        const code = activeDiscount.discount_code;

        if (percent && code) {
            return `-${percent}% avec le code ${code}`;
        }

        if (percent) {
            return `-${percent}%`;
        }

        if (title) {
            return title;
        }

        return '';
    }, [activeDiscount, lang]);

    return (
        <div className="header-top-area ptb-10 home-page-2">
            <div className="container">
                <div className="row header-top-row">
                    <div className="header-top-infos">
                        {freeShippingText}
                        {promoText && (
                            <>
                                {' '} / <span className="header-top-promo">{promoText}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;