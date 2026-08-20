"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { allowedLangs, defaultLang } from '../config.js';


import Header from '../components/Header';
import Footer from '../components/Footer';
import Slider from '../components/Slider';
import Services from '../components/Services';
import NewProducts from '../components/NewProducts';
import Banners from '../components/Banners';
import BlogLatest from '../components/BlogLatest';
import SeoHome from '../components/SeoHome.js';
import PromoPopup from '../components/PromoPopup';
import { useDiscount } from '../context/DiscountContext';


const Home = ({
    lang: langProp,
    initialSlides = [],
    initialNewProductItems = [],
    initialBannerItems = [],
    initialBlogRawItems = [],
    initialSeoHtml = '',
} = {}) => {
    const params = useParams();
  const lang = langProp || params?.lang || params?.segments?.[0];
    const currentLang = allowedLangs.includes(lang) ? lang : defaultLang;
    const { activeDiscount } = useDiscount();

    return (
        <div>
<PromoPopup discount={activeDiscount} lang={currentLang} />

            <Header lang={currentLang} />
            <Slider lang={currentLang} initialSlides={initialSlides} />
            <div className="hidden-xs">
                <Services lang={currentLang} />
            </div>
            <NewProducts lang={currentLang} initialItems={initialNewProductItems} />
            <Banners lang={currentLang} initialItems={initialBannerItems} />
            <BlogLatest lang={currentLang} initialRawItems={initialBlogRawItems} />
            <SeoHome initialHtml={initialSeoHtml} />
            <div className="visible-xs-block">
                <Services lang={currentLang} />
            </div>
            <Footer lang={currentLang} />
        </div>
    );
};

export default Home;
