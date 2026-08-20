"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { defaultLang, buildLocalizedPath, getLocalizedValue } from "../config.js";

const sitemapLabels = {
  fr: "Plan du site",
  en: "Sitemap",
  it: "Mappa del sito",
  de: "Seitenplan",
  es: "Mapa del sitio",
};

const FooterNav2 = ({ lang = defaultLang }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get(`/laceter-api/navigations_feetchy.json?t=${Date.now()}`)
      .then((res) => {
        const nav = res.data.items.find((n) => Number(n.id) === 6);
        setItems(Array.isArray(nav?.navigation_value) ? nav.navigation_value : []);
      })
      .catch((err) => {
        console.error("Erreur FooterNav2:", err);
      });
  }, []);

  return (
    <div className="footer-wrapper">
      <div className="footer-title">
        <h3>Feetchy</h3>
      </div>

      <div className="footer-wrapper">
        <ul className="usefull-link">
          {items.map((item) => {
            const rawUrl = item?.url?.[lang] || item?.url?.fr;
            const label = item?.title?.[lang] || item?.title?.fr;

            if (!rawUrl || !label) return null;

            return (
              <li key={item.id}>
                <Link href={buildLocalizedPath(lang, rawUrl)} title={label}>
                  {label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href={buildLocalizedPath(lang, "sitemap")}
              title={getLocalizedValue(sitemapLabels, lang, "Plan du site")}
            >
              {getLocalizedValue(sitemapLabels, lang, "Plan du site")}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FooterNav2;