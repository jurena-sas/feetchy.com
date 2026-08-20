"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { defaultLang, getLocalizedValue } from '../config.js';

const cleanPath = (value = '') =>
    String(value).replace(/^\/|\/$/g, '').replace(/\.html$/, '');

const sizeTitleByLang = {
    fr: 'Taille',
    en: 'Size',
    it: 'Taglia',
    de: 'Größe',
    es: 'Talla',
};

const SizeList = ({
    lang = defaultLang,
    categoryId,
    categorySlug = '',
    items = [],
}) => {
    const sizes = useMemo(() => {
        const map = new Map();

        items.forEach((item) => {
            const references = Array.isArray(item?.metas?.content_references)
                ? item.metas.content_references
                : [];

            references.forEach((ref) => {
                const rawLabel = ref?.title?.fr;
                if (!rawLabel) return;

                const normalizedLabel = String(rawLabel).trim();
                const numericValue = parseInt(
                    normalizedLabel.replace(/[^0-9]/g, ''),
                    10
                );

                if (!Number.isNaN(numericValue) && !map.has(normalizedLabel)) {
                    map.set(normalizedLabel, {
                        label: normalizedLabel,
                        value: numericValue,
                    });
                }
            });
        });

        return Array.from(map.values()).sort((a, b) => a.value - b.value);
    }, [items]);

    const baseSlug = cleanPath(categorySlug);

    if (!categoryId || !baseSlug || sizes.length === 0) {
        return null;
    }

    return (
        <div className="category-area-start">
            <div className="caregory">
                <h3 className="bedroom-side-title">{getLocalizedValue(sizeTitleByLang, lang, 'Size')}</h3>
                <ul>
                    {sizes.map((size) => {
                        const target =
                            lang === 'fr'
                                ? `/${baseSlug}-${size.value}`
                                : `/${lang}/${baseSlug}-${size.value}`;

                        return (
                            <li key={size.label}>
                                <Link href={target} title={size.label}>
                                    {size.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default SizeList;