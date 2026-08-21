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

    const promoHtml = useMemo(() => {
        if (!activeDiscount) return '';

        const subtitle = getLocalizedValue(
            activeDiscount.discount_subtitle,
            lang,
            ''
        );

        if (subtitle) return subtitle;

        const title = getLocalizedValue(
            activeDiscount.discount_title,
            lang,
            ''
        );

        return title;
    }, [activeDiscount, lang]);

    return (
        <div className="header-top-area ptb-10 home-page-2">
            <div className="container">
                <div className="row header-top-row">
                    <div className="header-top-infos">
                        {freeShippingText}
                        {promoHtml && (
                            <>
                                {' '} /{' '}
                                <span
                                    className="header-top-promo"
                                    dangerouslySetInnerHTML={{ __html: promoHtml }}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;