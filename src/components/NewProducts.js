"use client";

import React from 'react';
import { defaultLang, getLocalizedValue } from '../config.js';
import ProductThumb from './ProductThumb';

const titleByLang = {
    fr: 'Nouveautés',
    en: 'New Products',
    it: 'Novità',
    de: 'Neue Produkte',
    es: 'Novedades',
};

const NewProducts = ({ lang = defaultLang, initialItems = [] }) => {
    if (initialItems.length === 0) return null;

    return (
        <div className="new-product-area dotted-style4 home-page-2 pt-80 pb-50">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h2>{getLocalizedValue(titleByLang, lang, 'New Products')}</h2>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {initialItems.map((item) => (
                        <div key={item.id} className="col-lg-2 col-md-4 col-sm-6 col-xs-6">
                            <ProductThumb item={item} lang={lang} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewProducts;
