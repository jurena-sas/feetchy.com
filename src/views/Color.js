"use client";

import React, { useMemo, useState } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import SideBar from '../components/SideBar';
import ProductThumb from '../components/ProductThumb';

const Color = ({ id, lang = 'fr', label = '', initialItems = [] }) => {
    const [items] = useState(initialItems);

    const visibleItems = useMemo(() => {
        return items.filter((item) => {
            const url =
                item?.metas?.content_url_feetchy?.[lang] ||
                item?.metas?.content_url_feetchy?.fr ||
                item?.metas?.content_url?.[lang] ||
                item?.metas?.content_url?.fr;

            const hasImage = Boolean(
                (item?.metas?.content_gallery_feetchy || item?.metas?.content_gallery || [])[0]?.file
            );

            return Boolean(url) && hasImage;
        });
    }, [items, lang]);

    return (
        <div>
<Header lang={lang} />

            <div className="bedroom-all-product-area ptb-80">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                            <SideBar lang={lang} />
                        </div>

                        <div className="col-lg-9 col-md-9 col-sm-9 col-xs-12">
                            <div className="caregory-products-area">
                                <div className="tab-content">
                                    <div className="tab-pane active" id="viewed">
                                        {visibleItems.length === 0 && (
                                            <p>Aucun produit trouvé.</p>
                                        )}

                                        <div className="row">
                                            {visibleItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="col-lg-3 col-md-4 col-sm-6 col-xs-6"
                                                >
                                                    <ProductThumb
                                                        item={item}
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

export default Color;
