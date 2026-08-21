"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { defaultLang, getLocalizedValue } from '../config';

const PromoPopup = ({ discount, lang = defaultLang }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        if (discount?.ID) {
            sessionStorage.setItem(`promo_seen_${discount.ID}`, '1');
        }
        setIsOpen(false);
    };

    useEffect(() => {
        if (!discount?.ID) return;

        const storageKey = `promo_seen_${discount.ID}`;
        const alreadySeen = sessionStorage.getItem(storageKey);

        if (!alreadySeen) {
            setIsOpen(true);
        }
    }, [discount]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, discount]);

    const title = useMemo(
        () => getLocalizedValue(discount?.discount_title, lang, ''),
        [discount, lang]
    );

    const subtitle = useMemo(
        () => getLocalizedValue(discount?.discount_subtitle, lang, ''),
        [discount, lang]
    );

    const infos = useMemo(
        () => getLocalizedValue(discount?.discount_infos, lang, ''),
        [discount, lang]
    );

    const object = useMemo(
        () => getLocalizedValue(discount?.discount_object, lang, ''),
        [discount, lang]
    );

    const html = useMemo(
        () => getLocalizedValue(discount?.discount_html, lang, ''),
        [discount, lang]
    );

    const endDateLabel = useMemo(() => {
        const endTimestamp = Number(discount?.discount_end || 0);
        if (!endTimestamp) return '';

        try {
            return new Date(endTimestamp * 1000).toLocaleDateString(lang || 'fr', {
                day: 'numeric',
                month: 'long',
            });
        } catch (error) {
            return '';
        }
    }, [discount, lang]);

    const imageUrl = discount?.discount_image
        ? `/uploads/${discount.discount_image}`
        : '';

    if (!discount || !isOpen) return null;

    return (
        <div
            className="promo-popup-overlay"
            onClick={handleClose}
        >
            <div
                className="promo-popup-box"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    className="promo-popup-close"
                    onClick={handleClose}
                    aria-label="Fermer"
                >
                    ×
                </button>

                <div className="promo-popup-content">
                    {imageUrl ? (
                        <div className="promo-popup-image">
                            <img
                                src={imageUrl}
                                alt={title || 'Promotion'}
                                title={title || 'Promotion'}
                                onError={(e) => {
                                    e.currentTarget.parentElement.style.display = 'none';
                                }}
                            />
                        </div>
                    ) : null}

                    <div className="promo-popup-text">
                        {title ? <h2>{title}</h2> : null}

                        {subtitle ? (
                            <div
                                className="promo-popup-subtitle"
                                dangerouslySetInnerHTML={{ __html: subtitle }}
                            />
                        ) : null}

                        {object ? <p>{object}</p> : null}

                        {!object && endDateLabel ? (
                            <p>Offre valable jusqu’au {endDateLabel}</p>
                        ) : null}

                        {infos ? <p>{infos}</p> : null}

                        {html ? (
                            <div
                                className="promo-popup-html"
                                dangerouslySetInnerHTML={{ __html: html }}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromoPopup;