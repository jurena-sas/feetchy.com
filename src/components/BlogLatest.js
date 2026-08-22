"use client";

import React, { useMemo } from 'react';

const IMG_URL = '/uploads/';
const FALLBACK_LANG = 'fr';

const uiText = {
    fr: {
        title: 'Dernières news',
        readMore: 'Lire la suite',
        loading: 'Chargement des articles...',
        empty: 'Aucun article disponible pour le moment.',
    },
    en: {
        title: 'Latest news',
        readMore: 'Read more',
        loading: 'Loading articles...',
        empty: 'No articles available at the moment.',
    },
    it: {
        title: 'Ultime notizie',
        readMore: 'Leggi di più',
        loading: 'Caricamento articoli...',
        empty: 'Nessun articolo disponibile al momento.',
    },
    de: {
        title: 'Neueste Nachrichten',
        readMore: 'Mehr lesen',
        loading: 'Artikel werden geladen...',
        empty: 'Derzeit sind keine Artikel verfügbar.',
    },
    es: {
        title: 'Últimas noticias',
        readMore: 'Leer más',
        loading: 'Cargando artículos...',
        empty: 'No hay artículos disponibles por el momento.',
    },
};

const getLocalizedValue = (obj, lang, fallback = FALLBACK_LANG) => {
    if (!obj || typeof obj !== 'object') return '';
    return obj[lang] || obj[fallback] || Object.values(obj).find(Boolean) || '';
};

const decodeHtmlEntities = (text = '') => {
    if (!text || typeof document === 'undefined') return text || '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
};

const stripHtml = (html = '') => {
    const decoded = decodeHtmlEntities(html);
    return decoded.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

const createExcerpt = (html = '', maxLength = 160) => {
    const text = stripHtml(html);
    if (!text) return '';
    return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
};

/**
 * 🔥 CLEAN URL (clé du fix)
 */
const cleanUrl = (url = '') => {
    return String(url)
        .replace(/^https?:\/\/[^/]+/i, '') // enlève domaine
        .replace(/\.html$/i, '')           // enlève .html
        .replace(/\/+$/, '')               // enlève / final
        .replace(/^\/+/, '')               // enlève / début
        .trim();
};

const buildArticleUrl = (item, lang) => {
    const urlMap =
        item?.metas?.content_permalink_feetchy ||
        item?.metas?.content_url_feetchy ||
        item?.metas?.content_url ||
        {};

    const localizedUrl =
        urlMap?.[lang] ||
        urlMap?.[FALLBACK_LANG] ||
        Object.values(urlMap || {}).find(Boolean);

    if (!localizedUrl) return '#';

    const cleaned = cleanUrl(localizedUrl);

    if (lang === FALLBACK_LANG) {
        return `/${cleaned}`;
    }

    if (cleaned.startsWith(`${lang}/`)) {
        return `/${cleaned}`;
    }

    return `/${lang}/${cleaned}`;
};

const buildImageUrl = (item) => {
    const imageName =
        item?.metas?.content_image_feetchy ||
        item?.metas?.content_image ||
        item?.content?.content_poster ||
        '';

    if (!imageName) return '';
    if (/^https?:\/\//i.test(imageName)) return imageName;

    const clean = String(imageName).replace(/^\/+/, '');
    return `${IMG_URL}${clean}`;
};

const BlogLatest = ({ lang = 'fr', initialRawItems = [], limit = 3 }) => {
    const text = useMemo(() => uiText[lang] || uiText.fr, [lang]);

    const posts = useMemo(() => {
        const published = initialRawItems.filter(
            (item) => item?.content?.content_statut === 'publish'
        );

        const sorted = published.sort((a, b) =>
            Number(b?.content?.content_order || 0) -
            Number(a?.content?.content_order || 0)
        );

        return (limit ? sorted.slice(0, limit) : sorted)
            .map((item) => {
                const title =
                    getLocalizedValue(item?.metas?.content_title_feetchy, lang) ||
                    getLocalizedValue(item?.content?.content_title, lang) ||
                    'Article';

                const html =
                    getLocalizedValue(item?.metas?.content_html_feetchy, lang) ||
                    getLocalizedValue(item?.content?.content_html, lang) ||
                    '';

                return {
                    id: item?.id ?? title,
                    title,
                    excerpt: createExcerpt(html, 170),
                    url: buildArticleUrl(item, lang),
                    image: buildImageUrl(item),
                };
            });
    }, [initialRawItems, lang, limit]);

    return (
        <div className="blog-area home-page-2 ptb-80">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h2>{text.title}</h2>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {posts.length === 0 ? (
                        <p className="text-center">{text.empty}</p>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                <div className="single-blog">
                                    {post.image ? (
                                        <div className="blog-img">
                                            <a href={post.url} title={post.title}>
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    title={post.title}
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            </a>
                                        </div>
                                    ) : null}

                                    <div className="blog-info">
                                        <a href={post.url} title={post.title}>
                                            <h2>{post.title}</h2>
                                        </a>

                                        <p>{post.excerpt}</p>

                                        <a href={post.url} title={post.title}>
                                            {text.readMore} <span className="lnr lnr-arrow-right"></span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogLatest;