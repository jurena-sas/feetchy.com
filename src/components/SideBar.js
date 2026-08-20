"use client";

import React, { useState } from 'react';
import SizeList from './SizeList';
import ColorList from './ColorList';
import { defaultLang } from '../config.js';

const cleanUrl = (url = '') => {
    return url
        .replace(/\.html$/, '')
        .replace(/\/$/, '')
        .replace(/^\/+/, '');
};

const SideBar = ({
    lang = defaultLang,
    categoryId = null,
    categorySlug = '',
    categoryTitle = '',
    items = [],
    sidebarImage = '',
    sidebarHtml = '',
    showSizeList = true,
}) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [imageBroken, setImageBroken] = useState(false);

    const imageUrl = sidebarImage ? `/uploads/${sidebarImage}` : '';

    const linkUrl = categorySlug ? `/${cleanUrl(categorySlug)}` : '#';

    return (
        <div className="side-bar">
            <div
                className="side-bar-btn hidden-lg"
                onClick={() => setMobileOpen((prev) => !prev)}
            >
                <span className="lnr lnr-list"></span> Afficher les options
            </div>
            <div className={`side-bar-content${mobileOpen ? ' mobile-open' : ''}`}>
                {showSizeList && (
                    <SizeList
                        lang={lang}
                        categoryId={categoryId}
                        categorySlug={categorySlug}
                        items={items}
                    />
                )}

                <ColorList lang={lang} />

                {imageUrl && !imageBroken && (
                    <div className="sideber-ads mt-40 mb-30">
                        <div className="sideber-ads-img">
                            <a href={linkUrl} title={categoryTitle || 'Feetchy'}>
                                <img
                                    src={imageUrl}
                                    alt={categoryTitle || 'Feetchy'}
                                    title={categoryTitle || 'Feetchy'}
                                    onError={() => setImageBroken(true)}
                                />
                            </a>
                        </div>
                    </div>
                )}

                {sidebarHtml && (
                    <div
                        className="sideber-infos mb-30"
                        dangerouslySetInnerHTML={{ __html: sidebarHtml }}
                    />
                )}
            </div>
        </div>
    );
};

export default SideBar;