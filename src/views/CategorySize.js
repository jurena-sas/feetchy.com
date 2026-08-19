"use client";

import React, { useMemo, useState } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import SideBar from '../components/SideBar';
import ProductThumb from '../components/ProductThumb';

const CategorySize = ({
    id,
    size,
    lang = 'fr',
    label = '',
    categorySlug = '',
    initialItems = [],
}) => {
    const [items] = useState(initialItems);

    const visibleItems = useMemo(() => {
        return items.filter((product) => {
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
    }, [items, lang]);

    return (
        <div>
<Header lang={lang} />

            <div className="bedroom-all-product-area ptb-80">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                            <SideBar
                                lang={lang}
                                categoryId={id}
                                categorySlug={categorySlug}
                                items={visibleItems}
                            />
                        </div>

                        <div className="col-lg-9 col-md-9 col-sm-9 col-xs-12">
                            <div className="caregory-products-area">
                                <div className="tab-content">
                                    <div className="tab-pane active" id="viewed">
                                        {visibleItems.length === 0 && (
                                            <p>Aucun produit trouvé.</p>
                                        )}

                                        <div className="row">
                                            {visibleItems.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="col-lg-3 col-md-4 col-sm-6 col-xs-6"
                                                >
                                                    <ProductThumb
                                                        item={product}
                                                        lang={lang}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer lang={lang} />
        </div>
    );
};

export default CategorySize;
