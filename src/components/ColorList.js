"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { defaultLang, buildLocalizedPath, getLocalizedValue } from '../config.js';

const colorTitleByLang = {
    fr: 'Couleur',
    en: 'Color',
    it: 'Colore',
    de: 'Farbe',
    es: 'Color',
};

const ColorList = ({ lang = defaultLang }) => {
    const [colors, setColors] = useState([]);

    useEffect(() => {
        axios
            .get(`/laceter-api/list.color.json?t=${Date.now()}`)
            .then((res) => {
                setColors(Array.isArray(res.data?.items) ? res.data.items : []);
            })
            .catch((err) => {
                console.error('Erreur couleurs:', err);
            });
    }, []);

    return (
        <div className="sideber-color mt-40">
            <h3 className="bedroom-side-title">{getLocalizedValue(colorTitleByLang, lang, 'Color')}</h3>
            <ul>
                {colors.map((color) => {
                    const metas = color.metas;

                    const langIndex =
                        lang === 'fr' ? 0 :
                            lang === 'en' ? 1 :
                                lang === 'it' ? 2 :
                                    lang === 'de' ? 3 :
                                        0;

                    const label = metas[`content_title_lang_${langIndex}`];
                    const hex = metas?.content_hex;

                    const rawUrl =
                        metas?.content_url_feetchy?.[lang] ||
                        metas?.content_url_feetchy?.fr;

                    if (!hex || !rawUrl) return null;

                    return (
                        <li key={color.id}>
                            <Link
                                href={buildLocalizedPath(lang, rawUrl)}
                                title={label}
                                style={{
                                    display: 'block',
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: hex,
                                    borderRadius: '50%',
                                }}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ColorList;