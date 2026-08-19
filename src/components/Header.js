"use client";

import React, { useState } from 'react';
import Link from 'next/link';

import Navigation from './Navigation';
import NavigationMobile from './NavigationMobile';

import { useCart } from '../context/CartContext';

import TopBar from './TopBar';
import { buildHomePath, defaultLang } from '../config.js';
import LangSelect from './LangSelect.js';
import HeaderCart from './HeaderCart.js';

const Header = ({ lang = defaultLang }) => {

    const [mobileOpen, setMobileOpen] = useState(false);

    const { cart, totalItems, totalPrice, removeFromCart } = useCart();

    return (
        <div>

            <header>

                <TopBar lang={lang} />

                <div className="header-bottom-area home-page-2 ptb-50">
                    <div className="container">

                        <div className="row">

                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">

                                <div
                                    className="header-mobile-nav-btn hidden-lg"
                                    onClick={() => setMobileOpen(true)}
                                >
                                    
                                </div>

                                <div className="header-lang hidden-md hidden-sm hidden-xs">
                                    <LangSelect lang={lang} />
                                </div>

                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">

                                <Link href={buildHomePath(lang)}>
                                    <div className="logo logo2">
                                        <img
                                            src="/assets/img/logo.png"
                                            alt="Logo"
                                        />
                                    </div>
                                </Link>

                            </div>

                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12 header-cart-col">
                                <HeaderCart lang={lang} />
                            </div>

                        </div>

                    </div>
                </div>

            </header>

            <Navigation lang={lang} />

            <NavigationMobile
                lang={lang}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

        </div>
    );
};

export default Header;