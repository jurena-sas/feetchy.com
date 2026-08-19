"use client";

import React from 'react';
import Link from 'next/link';

const UPLOADS_BASE = 'https://www.laceter.com/uploads';

const Banners = ({ lang = 'fr', initialItems = [] }) => {
    const items = initialItems;

    if (items.length < 4) return null;

    return (
        <div className="banner-area fix pt-80 pb-80">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-md-8">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="single-banner banner_img_3 home-banner-square">
                                    <Link href={items[0].url}>
                                        <img
                                            src={`${UPLOADS_BASE}/${items[0].image}`}
                                            alt={items[0].label}
                                        />
                                        {items[0].label && (
                                            <span className="banner-label">
                                                {items[0].label}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div className="single-banner home-banner-square">
                                    <Link href={items[1].url}>
                                        <img
                                            src={`${UPLOADS_BASE}/${items[1].image}`}
                                            alt={items[1].label}
                                        />
                                        {items[1].label && (
                                            <span className="banner-label">
                                                {items[1].label}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="single-banner mar_b-30 home-banner-wide">
                                    <Link href={items[2].url}>
                                        <img
                                            src={`${UPLOADS_BASE}/${items[2].image}`}
                                            alt={items[2].label}
                                        />
                                        {items[2].label && (
                                            <span className="banner-label">
                                                {items[2].label}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-4 col-sm-6 hidden-sm col-xs-12">
                        <div className="single-banner fix home-banner-tall">
                            <Link href={items[3].url}>
                                <img
                                    src={`${UPLOADS_BASE}/${items[3].image}`}
                                    alt={items[3].label}
                                />
                                {items[3].label && (
                                    <span className="banner-label">
                                        {items[3].label}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banners;