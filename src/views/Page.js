"use client";

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { defaultLang } from '../config.js';

const IMG_URL = '/uploads/';

const Page = ({ id, lang = defaultLang, initialContentData = null }) => {
    const item = initialContentData;

    if (!item) return <div>No data</div>;

    const metas = item?.metas || {};

    // ✅ TITRE
    const title =
        metas?.content_title_feetchy?.[lang] ||
        metas?.content_label_feetchy?.[lang] ||
        metas?.content_label?.[lang] ||
        metas?.content_title_lang_0 ||
        '';

    // ✅ HTML
    const html =
        metas?.content_html_feetchy?.[lang] ||
        metas?.content_html_feetchy?.[defaultLang] ||
        '';

    // ✅ IMAGE (sans fallback)
    const imageName =
        metas?.content_image_feetchy ||
        metas?.content_image ||
        item?.content?.content_poster ||
        '';

    const imageUrl = imageName
        ? /^https?:\/\//i.test(imageName)
            ? imageName
            : `${IMG_URL}${String(imageName).replace(/^\/+/, '')}`
        : null;

    return (
        <>
            <Header lang={lang} />

            <div className="page-title-wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">

                            {title && <h1 className="mb-4">{title}</h1>}

                            {/* ✅ IMAGE seulement si existe */}
                            {imageUrl && (
                                <div className="mb-4">
                                    <img
                                        src={imageUrl}
                                        alt={title || ''}
                                        title={title || ''}
                                        className="img-fluid"
                                    />
                                </div>
                            )}

                            {/* ✅ CONTENU */}
                            {html && (
                                <div dangerouslySetInnerHTML={{ __html: html }} />
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <Footer lang={lang} />
        </>
    );
};

export default Page;
