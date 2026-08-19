"use client";

import React, { useMemo, useState } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import SideBar from '../components/SideBar';
import ProductThumb from '../components/ProductThumb';
import CategoryOptions from '../components/CategoryOptions';

const getLocalizedValue = (value, lang = 'fr', fallback = '') => {
    if (!value) return fallback;

    if (typeof value === 'string') {
        return value;
    }

    return value?.[lang] || value?.fr || fallback;
};

const List = ({
    id,
    item,
    lang = 'fr',
    label = 'Lacets chaussure',
    initialItems = [],
    initialContentData = null,
}) => {
    const [items] = useState(initialItems);
    const [categoryData] = useState(initialContentData);
    const [sortBy, setSortBy] = useState('range');

    const categorySlug =
        item?.content_url_feetchy?.[lang] ||
        item?.content_url_feetchy?.fr ||
        item?.urls?.[lang] ||
        item?.urls?.fr ||
        '';

    const visibleItems = useMemo(() => {
        let filtered = items.filter((product) => {
            const isPublished = product?.content?.content_statut === 'publish';

            const url =
                product?.metas?.content_url_feetchy?.[lang] ||
                product?.metas?.content_url_feetchy?.fr ||
                product?.metas?.content_url?.[lang] ||
                product?.metas?.content_url?.fr;

            const hasImage = Boolean(
                (product?.metas?.content_gallery_feetchy || product?.metas?.content_gallery || [])[0]?.file
            );

            return isPublished && Boolean(url) && hasImage;
        });

        if (sortBy === 'color') {
            return [...filtered].sort((a, b) => {
                const colorA = String(a?.metas?.content_color || '');
                const colorB = String(b?.metas?.content_color || '');
                return colorA.localeCompare(colorB, 'fr', { numeric: true });
            });
        }

        if (sortBy === 'range') {
            return [...filtered].sort((a, b) => {
                const rangeA = String(a?.metas?.content_range || '');
                const rangeB = String(b?.metas?.content_range || '');
                return rangeA.localeCompare(rangeB, 'fr', { numeric: true });
            });
        }

        return filtered;
    }, [items, lang, sortBy]);

    const metas = categoryData?.metas || categoryData || {};

    const categoryTitle =
        getLocalizedValue(metas.content_title_feetchy, lang) ||
        getLocalizedValue(categoryData?.content?.content_title, lang) ||
        getLocalizedValue(categoryData?.content_title, lang) ||
        label ||
        'Catégorie';

    const categoryDescription =
        getLocalizedValue(metas.content_description_feetchy, lang) ||
        getLocalizedValue(categoryData?.content?.content_html, lang) ||
        getLocalizedValue(categoryData?.content_html, lang) ||
        '';

    const sidebarImage =
        metas.content_image_feetchy ||
        categoryData?.content_image_feetchy ||
        '';

    const sidebarHtml = getLocalizedValue(metas.content_html_feetchy, lang);

    return (
        <div>
            <Header lang={lang} />

            <div className="bedroom-all-product-area ptb-80">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
                            <SideBar
                                lang={lang}
                                categoryId={id}
                                categorySlug={categorySlug}
                                items={visibleItems}
                                sidebarImage={sidebarImage}
                                sidebarHtml={sidebarHtml}
                                showSizeList={false}
                            />
                        </div>

                        <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12">
                            <div className="row">
                                <div className="category-intro col-xs-12">
                                    <h1 className="bedroom-side-title">{categoryTitle}</h1>

                                    {categoryDescription && (
                                        <div
                                            className="category-intro__description"
                                            dangerouslySetInnerHTML={{
                                                __html: categoryDescription,
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="row">
                                <CategoryOptions sortBy={sortBy} setSortBy={setSortBy} lang={lang} />
                            </div>

                            {visibleItems.length === 0 && (
                                <p>Aucun produit trouvé.</p>
                            )}

                            <div className="row">
                                {visibleItems.map((product) => (
                                    <div key={product.id} className="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                                        <ProductThumb item={product} lang={lang} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer lang={lang} />
        </div>
    );
};

export default List;
