"use client";

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { defaultLang } from '../config.js';

const IMG_URL = '/uploads/';

const escapeAttr = (str = '') =>
    String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

const insertAfterFirstParagraph = (htmlContent, imgHtml) => {
    if (!imgHtml) return htmlContent;
    if (!htmlContent) return imgHtml;

    const match = htmlContent.match(/<\/p\s*>/i);
    if (!match) return `${imgHtml}${htmlContent}`;

    const index = htmlContent.indexOf(match[0]) + match[0].length;
    return `${htmlContent.slice(0, index)}${imgHtml}${htmlContent.slice(index)}`;
};

const PostFeetchy = ({ id, lang = defaultLang, initialContentData = null }) => {
    const item = initialContentData;

    if (!item) return <div>No data</div>;

    const metas = item?.metas || {};

    const title =
        metas?.content_title_feetchy?.[lang] ||
        metas?.content_label_feetchy?.[lang] ||
        metas?.content_label?.[lang] ||
        metas?.content_title_lang_0 ||
        '';

    const rawHtml =
        metas?.content_html_feetchy?.[lang] ||
        metas?.content_html_feetchy?.[defaultLang] ||
        '';

    const imageName =
        metas?.content_image_feetchy ||
        metas?.content_image ||
        item?.content?.content_poster ||
        '';

    const imageUrl = imageName
        ? /^https?:\/\//i.test(imageName)
            ? imageName
            : `${IMG_URL}${String(imageName).replace(/^\/+/, '')}`
        : '';

    const imageAlt = title || 'Article image';

    const imgHtml = imageUrl
        ? `<img src="${escapeAttr(imageUrl)}" alt="${escapeAttr(imageAlt)}" title="${escapeAttr(imageAlt)}" class="img-fluid mb-4" loading="lazy" decoding="async" onerror="this.style.display='none'" />`
        : '';

    const html = insertAfterFirstParagraph(rawHtml, imgHtml);

    return (
        <>
            <Header lang={lang} />

            <div className="page-title-wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            {title && <h1 className="mb-4">{title}</h1>}

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

export default PostFeetchy;
