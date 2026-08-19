import React from 'react';
import { defaultLang, getLocalizedValue } from '../config.js';

const textByLang = {
    label: {
        fr: 'Afficher par :',
        en: 'Sort by:',
        it: 'Ordina per:',
        de: 'Sortieren nach:',
        es: 'Ordenar por:',
    },
    type: {
        fr: 'Type',
        en: 'Type',
        it: 'Tipo',
        de: 'Typ',
        es: 'Tipo',
    },
    color: {
        fr: 'Couleur',
        en: 'Color',
        it: 'Colore',
        de: 'Farbe',
        es: 'Color',
    },
};

const CategoryOptions = ({ sortBy, setSortBy, lang = defaultLang }) => {
    return (
        <>
            <div className="col-lg-2 col-md-3 col-sm-3 col-xs-12"></div>
            <div className="col-lg-10 col-md-9 col-sm-9 col-xs-12">
                <div className="product-option">
                    <div className="product-option-right floatright">
                        <div className="sort-by">
                            <label>{getLocalizedValue(textByLang.label, lang, 'Afficher par :')}</label>
                            <select
                                className="cust-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="range">{getLocalizedValue(textByLang.type, lang, 'Type')}</option>
                                <option value="color">{getLocalizedValue(textByLang.color, lang, 'Color')}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoryOptions;