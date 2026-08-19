"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { allowedLangs, defaultLang } from '../config.js';

import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogLatest from '../components/BlogLatest';

const Home = ({ lang: langProp, initialBlogRawItems = [] } = {}) => {
    const params = useParams();
  const lang = langProp || params?.lang || params?.segments?.[0];

    const currentLang = allowedLangs.includes(lang) ? lang : 'fr';

    return (
        <div>
<Header lang={currentLang} />
            <BlogLatest lang={currentLang} initialRawItems={initialBlogRawItems} />



            <Footer lang={currentLang} />
        </div>
    );
};

export default Home;