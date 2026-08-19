"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { defaultLang, buildLocalizedPath } from "../config";

const Navigation = ({ lang = defaultLang }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchNav = async () => {
            try {
                const res = await axios.get(
                    `/laceter-api/navigations_feetchy.json?t=${Date.now()}`
                );

                const nav = res.data.items.find(
                    (n) => Number(n.id) === 5
                );

                if (nav && Array.isArray(nav.navigation_value)) {
                    setItems(nav.navigation_value);
                }
            } catch (err) {
                console.error("Erreur navigation :", err);
            }
        };

        fetchNav();
    }, []);

    const getLabel = (item) => {
        return (
            item?.title?.[lang] ||
            item?.title?.fr ||
            ""
        );
    };

    const getUrl = (item) => {
        return (
            item?.url?.[lang] ||
            item?.url?.fr ||
            ""
        );
    };

    return (
        <div
            className="mainmenu-area home-page-2 hidden-md hidden-sm hidden-xs"
            id="main_h"
        >
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="mainmenu">
                            <nav>
                                <ul className="mainmenu-ul">
                                    {items.map((item, index) => {
                                        const label = getLabel(item);
                                        const url = getUrl(item);

                                        if (!label) {
                                            return null;
                                        }

                                        return (
                                            <li
                                                key={`${item.id}-${index}`}
                                            >
                                                <Link
                                                    href={buildLocalizedPath(
                                                        lang,
                                                        url
                                                    )}
                                                >
                                                    {label}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navigation;