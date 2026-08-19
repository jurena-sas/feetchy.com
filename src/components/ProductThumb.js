import React from 'react';
import Link from 'next/link';
import { buildLocalizedPath, defaultLang } from '../config.js';

const ProductThumb = ({ item, lang = defaultLang }) => {
    if (!item) return null;

    const url =
        item?.metas?.content_url_feetchy?.[lang] ||
        item?.metas?.content_url_feetchy?.fr ||
        '';

    const title =
        item?.metas?.content_title_feetchy?.[lang] ||
        item?.metas?.content_title_feetchy?.fr ||
        item?.metas?.[`content_title_lang_${lang}`] ||
        item?.metas?.content_title_lang_0 ||
        item?.label?.[lang] ||
        item?.label?.fr ||
        'Produit';

    const price = item?.metas?.content_pricefrom_eur || '';

    const gallery =
        item?.metas?.content_gallery_feetchy ||
        item?.metas?.content_gallery ||
        [];

    const firstImage = gallery?.[0]?.file
        ? `/uploads/${gallery[0].file}`
        : '';

    const productLink = url ? buildLocalizedPath(lang, url) : '#';

    const reviews =
        item?.metas?.content_review_feetchy ||
        item?.metas?.content_review ||
        [];

    const validRates = Array.isArray(reviews)
        ? reviews
              .map((review) => Number(review?.rate))
              .filter((rate) => !Number.isNaN(rate) && rate > 0)
        : [];

    const averageRate = validRates.length
        ? validRates.reduce((sum, rate) => sum + rate, 0) / validRates.length
        : 0;

    const roundedRate = Math.round(averageRate);

    return (
        <div className="single-new-product mt-40 category-new-product">
            <div className="product-img">
                <Link href={productLink}>
                    {firstImage ? (
                        <img src={firstImage} className="first_img" alt={title} />
                    ) : null}
                </Link>
            </div>

            <div className="product-content text-center">
                <Link href={productLink}>
                    <h3>{title}</h3>
                </Link>

                <div className="product-price-star">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <i
                            key={star}
                            className={`fa ${star <= roundedRate ? 'fa-star' : 'fa-star-o'}`}
                        ></i>
                    ))}
                </div>

                <div className="price">
                    <h4>{price} €</h4>
                </div>
            </div>
        </div>
    );
};

export default ProductThumb;