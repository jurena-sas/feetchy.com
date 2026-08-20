"use client";

import React, { useMemo, useState } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import SideBar from '../components/SideBar';
import ProductThumb from '../components/ProductThumb';

const getLocalizedValue = (value, lang = 'fr', fallback = '') => {
    if (!value) return fallback;

    if (typeof value === 'string') {
        return value;
    }

    return value?.[lang] || value?.fr || fallback;
};

const Category = ({
    id,
    lang = 'fr',
    label = '',
    item,
    initialItems = [],
    initialContentData = null,
}) => {
    const [items] = useState(initialItems);
    const [categoryData] = useState(initialContentData);

    const categorySlug =
        item?.content_url_feetchy?.[lang] ||
        item?.content_url_feetchy?.fr ||
        item?.urls?.[lang] ||
        item?.urls?.fr ||
        '';

    const visibleItems = useMemo(() => {
        return items.filter((product) => {
            const isPublished = product?.content?.content_statut === 'publish';

            const url =
                product?.metas?.content_url_feetchy?.[lang] ||
                product?.metas?.content_url_feetchy?.fr;

            const hasImage = Boolean(
                (product?.metas?.content_gallery_feetchy || product?.metas?.content_gallery || [])[0]?.file
            );

            return isPublished && Boolean(url) && hasImage;
        });
    }, [items, lang]);

    const metas = categoryData?.metas || categoryData || {};

    const categoryTitle =
        getLocalizedValue(metas.content_title_feetchy, lang) ||
        label ||
        'Catégorie';

    const categoryDescription =
        getLocalizedValue(metas.content_description_feetchy, lang) ||
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

                            {visibleItems.length === 0 && <p>Aucun produit trouvé.</p>}

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

export default Category;
