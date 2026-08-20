"use client";

import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { buildLocalizedPath, defaultLang, getLocalizedValue } from '../config.js';

const textByLang = {
  title: {
    fr: 'Plan du site',
    en: 'Sitemap',
    it: 'Mappa del sito',
    de: 'Seitenplan',
  },
  pages: {
    fr: 'Nos pages',
    en: 'Our pages',
    it: 'Le nostre pagine',
    de: 'Unsere Seiten',
  },
  categories: {
    fr: 'Catégories',
    en: 'Categories',
    it: 'Categorie',
    de: 'Kategorien',
  },
  colors: {
    fr: 'Couleurs',
    en: 'Colors',
    it: 'Colori',
    de: 'Farben',
  },
  products: {
    fr: 'Produits',
    en: 'Products',
    it: 'Prodotti',
    de: 'Produkte',
  },
  posts: {
    fr: 'Articles de blog',
    en: 'Blog posts',
    it: 'Articoli del blog',
    de: 'Blogartikel',
  },
};

const SitemapSection = ({ title, items = [], lang }) => {
  if (!items.length) return null;

  return (
    <div className="sitemap-section">
      <h2>{title}</h2>
      <ul className="sitemap-list">
        {items.map((item) => (
          <li key={item.id}>
            <Link href={buildLocalizedPath(lang, item.url)} title={item.title}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Sitemap = ({
  lang: langProp,
  pages = [],
  categories = [],
  colors = [],
  productGroups = [],
  posts = [],
}) => {
  const lang = langProp || defaultLang;

  return (
    <div>
      <Header lang={lang} />

      <div className="page-title-wrapper sitemap-page">
        <div className="container">
          <h1 className="mb-4">{getLocalizedValue(textByLang.title, lang, 'Plan du site')}</h1>

          <SitemapSection
            title={getLocalizedValue(textByLang.pages, lang, 'Nos pages')}
            items={pages}
            lang={lang}
          />

          <SitemapSection
            title={getLocalizedValue(textByLang.categories, lang, 'Catégories')}
            items={categories}
            lang={lang}
          />

          <SitemapSection
            title={getLocalizedValue(textByLang.colors, lang, 'Couleurs')}
            items={colors}
            lang={lang}
          />

          {productGroups.length > 0 && (
            <div className="sitemap-section">
              <h2>{getLocalizedValue(textByLang.products, lang, 'Produits')}</h2>
              {productGroups.map((group) => (
                <div className="sitemap-subgroup" key={group.label}>
                  <h3>{group.label}</h3>
                  <ul className="sitemap-list">
                    {group.items.map((item) => (
                      <li key={item.id}>
                        <Link href={buildLocalizedPath(lang, item.url)} title={item.title}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <SitemapSection
            title={getLocalizedValue(textByLang.posts, lang, 'Articles de blog')}
            items={posts}
            lang={lang}
          />
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
};

export default Sitemap;
