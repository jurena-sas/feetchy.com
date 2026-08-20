"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { buildLocalizedPath, defaultLang, getLocalizedValue } from '../config.js';
import LangSelect from './LangSelect.js';

const accountLabels = {
    fr: 'Mon compte',
    en: 'My account',
    it: 'Il mio account',
    de: 'Mein Konto',
    es: 'Mi cuenta',
};

const NavigationMobile = ({ lang = defaultLang, mobileOpen, setMobileOpen }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios
            .get('/laceter-api/navigations_feetchy.json')
            .then((res) => {
                const nav = res.data.items.find((n) => n.id === 5);
                setItems(nav?.navigation_value || []);
            })
            .catch((err) => {
                console.error('Erreur navigation mobile:', err);
            });
    }, []);

    return (
        <div className={`mobile-menu-area hidden-lg ${mobileOpen ? 'active' : ''}`}>
            <div className="container">
                <div
                    className="close-nav"
                    onClick={() => setMobileOpen(false)}
                >
                    ✕
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <Link href={buildLocalizedPath(lang)} title="Feetchy">
                            <div className="logo logo2">
                                <img src="/assets/img/logo.png" alt="Feetchy" title="Feetchy" />
                            </div>
                        </Link>

                        <div className="mobile-menu">
                            <nav id="mobile-menu">
                                <ul>
                                    {items.map((item) => {
                                        const rawUrl = item?.url?.[lang] || item?.url?.fr;
                                        const label = item?.title?.[lang] || item?.title?.fr;

                                        if (!rawUrl || !label) return null;

                                        return (
                                            <li key={item.id}>
                                                <Link
                                                    href={buildLocalizedPath(lang, rawUrl)}
                                                    title={label}
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    {label}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                    <li>
                                        <Link
                                            href={buildLocalizedPath(lang, 'account')}
                                            title={getLocalizedValue(accountLabels, lang, 'Mon compte')}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {getLocalizedValue(accountLabels, lang, 'Mon compte')}
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        <LangSelect lang={lang} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigationMobile;