"use client";

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import Header from '../components/Header';
import Footer from '../components/Footer';
import SideBar from '../components/SideBar';
import ProductThumb from '../components/ProductThumb';

const Size = ({ id, lang = 'fr', label = '' }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) {
            setItems([]);
            return;
        }

        let isMounted = true;

        const fetchCategory = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await axios.get(
                    `/laceter-api/list.product.color.${id}.json?t=${Date.now()}`
                );

                const apiItems = Array.isArray(response?.data?.items)
                    ? response.data.items
                    : [];

                if (isMounted) {
                    setItems(apiItems);
                }
            } catch (err) {
                console.error('Erreur chargement catégorie:', err);

                if (isMounted) {
                    setItems([]);
                    setError('Impossible de charger les produits.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCategory();

        return () => {
            isMounted = false;
        };
    }, [id]);

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
                                        {loading && (
                                            <p>Chargement des produits...</p>
                                        )}

                                        {error && (
                                            <p style={{ color: 'red' }}>{error}</p>
                                        )}

                                        {!loading && !error && visibleItems.length === 0 && (
                                            <p>Aucun produit trouvé.</p>
                                        )}

                                        <div className="row">
                                            {!loading &&
                                                !error &&
                                                visibleItems.map((item) => (
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

export default Size;