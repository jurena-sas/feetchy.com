"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const DiscountContext = createContext({
    discounts: [],
    activeDiscount: null,
    loadingDiscounts: true,
});

const DISCOUNTS_API_URL = '/laceter-api/discounts_feetchy.json';

export const DiscountProvider = ({ children }) => {
    const [discounts, setDiscounts] = useState([]);
    const [activeDiscount, setActiveDiscount] = useState(null);
    const [loadingDiscounts, setLoadingDiscounts] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchDiscounts = async () => {
            try {
                const response = await fetch(`${DISCOUNTS_API_URL}?t=${Date.now()}`);
                const data = await response.json();

                const items = Array.isArray(data?.items) ? data.items : [];
                const nowTimestamp = Math.floor(Date.now() / 1000);

                const active =
                    items.find((item) => {
                        const isShown = String(item?.discount_show) === '1';
                        const endTimestamp = Number(item?.discount_end || 0);
                        return isShown && endTimestamp > nowTimestamp;
                    }) || null;

                if (isMounted) {
                    setDiscounts(items);
                    setActiveDiscount(active);
                }
            } catch (error) {
                console.error('Erreur chargement promotions:', error);

                if (isMounted) {
                    setDiscounts([]);
                    setActiveDiscount(null);
                }
            } finally {
                if (isMounted) {
                    setLoadingDiscounts(false);
                }
            }
        };

        fetchDiscounts();

        return () => {
            isMounted = false;
        };
    }, []);

    const value = useMemo(
        () => ({
            discounts,
            activeDiscount,
            loadingDiscounts,
        }),
        [discounts, activeDiscount, loadingDiscounts]
    );

    return (
        <DiscountContext.Provider value={value}>
            {children}
        </DiscountContext.Provider>
    );
};

export const useDiscount = () => useContext(DiscountContext);