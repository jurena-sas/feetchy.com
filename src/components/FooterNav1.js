"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { defaultLang, buildLocalizedPath } from "../config.js";

const FooterNav1 = ({ lang = defaultLang }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get(`/laceter-api/navigations_feetchy.json?t=${Date.now()}`)
      .then((res) => {
        const nav = res.data.items.find((n) => Number(n.id) === 49);
        setItems(Array.isArray(nav?.navigation_value) ? nav.navigation_value : []);
      })
      .catch((err) => {
        console.error("Erreur FooterNav1:", err);
      });
  }, []);

  return (
    <div className="footer-wrapper">
      <div className="footer-title">
        <h3>Nos lacets de chaussure</h3>
      </div>

      <div className="footer-wrapper">
        <ul className="usefull-link">
          {items.map((item) => {
            const rawUrl = item?.url?.[lang] || item?.url?.fr;
            const label = item?.title?.[lang] || item?.title?.fr;

            if (!rawUrl || !label) return null;

            return (
              <li key={item.id}>
                <Link href={buildLocalizedPath(lang, rawUrl)}>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default FooterNav1;