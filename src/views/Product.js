"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { defaultLang, getLocalizedValue } from "../config";

const textByLang = {
    stockIn: { fr: "En stock", en: "In stock", it: "Disponibile", de: "Auf Lager", es: "En stock" },
    stockOut: { fr: "Rupture de stock", en: "Out of stock", it: "Esaurito", de: "Nicht auf Lager", es: "Agotado" },
    reviewSingular: { fr: "avis", en: "review", it: "recensione", de: "Bewertung", es: "reseña" },
    reviewPlural: { fr: "avis", en: "reviews", it: "recensioni", de: "Bewertungen", es: "reseñas" },
    addReview: { fr: "Ajouter votre avis", en: "Add your review", it: "Aggiungi la tua recensione", de: "Bewertung hinzufügen", es: "Añadir tu reseña" },
    reference: { fr: "Taille / Référence", en: "Size / Reference", it: "Taglia / Riferimento", de: "Größe / Referenz", es: "Talla / Referencia" },
    addToCart: { fr: "Ajouter au panier", en: "Add to cart", it: "Aggiungi al carrello", de: "In den Warenkorb", es: "Añadir al carrito" },
    added: { fr: "Ajouté", en: "Added", it: "Aggiunto", de: "Hinzugefügt", es: "Añadido" },
    notFound: { fr: "Produit introuvable", en: "Product not found", it: "Prodotto non trovato", de: "Produkt nicht gefunden", es: "Producto no encontrado" },
    loading: { fr: "Chargement...", en: "Loading...", it: "Caricamento...", de: "Wird geladen...", es: "Cargando..." },
    sku: { fr: "SKU", en: "SKU", it: "SKU", de: "SKU", es: "SKU" },
    referenceFallback: { fr: "Référence", en: "Reference", it: "Riferimento", de: "Referenz", es: "Referencia" },
};

const Product = ({
    item: routeItem,
    lang = defaultLang,
    initialProduct = null,
    initialRangeProducts = [],
}) => {
    const { addToCart } = useCart();

    const routeProduct = routeItem ?? null;

    const [product] = useState(initialProduct || routeProduct);
    const [rangeProducts] = useState(initialRangeProducts);
    const loadingProduct = false;

    const [selectedRefIndex, setSelectedRefIndex] = useState(0);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [justAdded, setJustAdded] = useState(false);

    const cleanUrl = (url) => {
        if (!url) return "";

        return url
            .replace(/\.html$/, "")
            .replace(/\/$/, "")
            .replace(/^\/+/, "");
    };

    const references = product?.metas?.content_references || [];

    useEffect(() => {
        if (!references.length) return;

        const currentRef = references[selectedRefIndex];
        const currentStock = Number(currentRef?.stock ?? 0);

        if (currentStock > 0) return;

        const firstAvailableIndex = references.findIndex(
            (ref) => Number(ref?.stock ?? 0) > 0
        );

        if (firstAvailableIndex !== -1) {
            setSelectedRefIndex(firstAvailableIndex);
            setQuantity(1);
        }
    }, [references, selectedRefIndex]);

    const gallery =
        product?.metas?.content_gallery_feetchy ||
        product?.metas?.content_gallery ||
        [];

    const images = gallery
        .filter((img) => img?.file)
        .map((img) => `/uploads/${img.file}`);

    const uniqueImages = [...new Set(images)];
    const mainImage = uniqueImages[0] || "/img/product/1.jpg";
    const selectedImage = uniqueImages[selectedImageIndex] || mainImage;

    useEffect(() => {
        setSelectedImageIndex(0);
    }, [product?.id]);

    const reviews =
        product?.metas?.content_review_feetchy ||
        product?.metas?.content_review ||
        [];

    const validRates = Array.isArray(reviews)
        ? reviews
            .map((review) => Number(review?.rate))
            .filter((rate) => !Number.isNaN(rate) && rate > 0)
        : [];

    const reviewCount = validRates.length;

    const averageRate = reviewCount
        ? validRates.reduce((sum, rate) => sum + rate, 0) / reviewCount
        : 0;

    const roundedRate = Math.round(averageRate);

    const reviewLabel =
        reviewCount > 1
            ? getLocalizedValue(textByLang.reviewPlural, lang, "avis")
            : getLocalizedValue(textByLang.reviewSingular, lang, "avis");

    const selectedReference = useMemo(() => {
        return references[selectedRefIndex] || references[0] || null;
    }, [references, selectedRefIndex]);

    if (!routeProduct && !product) {
        return (
            <div>
                <Header lang={lang} />
                <div className="container" style={{ padding: "40px 0" }}>
                    {getLocalizedValue(textByLang.notFound, lang, "Produit introuvable")}
                </div>
                <Footer lang={lang} />
            </div>
        );
    }

    const title =
        product?.metas?.content_title_feetchy?.[lang] ||
        product?.metas?.content_title_feetchy?.fr ||
        product?.metas?.[`content_title_lang_${lang}`] ||
        product?.metas?.content_title_lang_0 ||
        product?.content_title?.[lang] ||
        product?.content_title?.fr ||
        routeProduct?.label?.[lang] ||
        routeProduct?.label?.fr ||
        "Produit";

    const description =
        product?.metas?.content_description_feetchy?.[lang] ||
        product?.metas?.content_description_feetchy?.fr ||
        product?.metas?.content_description?.[lang] ||
        product?.metas?.content_description?.fr ||
        product?.content_html?.[lang] ||
        product?.content_html?.fr ||
        "";

    const price = Number(
        selectedReference?.price?.eur ??
            selectedReference?.price?.EUR ??
            product?.metas?.content_pricefrom_eur ??
            0
    );

    const sku = selectedReference?.ref || "";

    const referenceTitle =
        selectedReference?.title?.[lang] ||
        selectedReference?.title?.fr ||
        selectedReference?.title?.us ||
        getLocalizedValue(textByLang.referenceFallback, lang, "Référence");

    const currentStock = Number(selectedReference?.stock ?? 0);
    const inStock = currentStock > 0;

    const handleQuantityChange = (e) => {
        const value = Number(e.target.value);

        if (Number.isNaN(value) || value < 1) {
            setQuantity(1);
            return;
        }

        if (currentStock > 0 && value > currentStock) {
            setQuantity(currentStock);
            return;
        }

        setQuantity(value);
    };

    const handleAddToCart = () => {
        if (!selectedReference || !inStock) return;

        const productToAdd = {
            id: Number(product?.id ?? routeProduct?.id),
            name: title,
            nameTranslations: product?.metas?.content_title_feetchy || null,
            price,
            image: mainImage,
            sku,
            referenceIndex: selectedRefIndex,
            referenceTitle,
            range: product?.metas?.content_range || product?.range || null,
        };

        addToCart(productToAdd, quantity);

        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1500);
    };

    return (
        <div>
            <Header lang={lang} />

            <div className="all-hyperion-page">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12">
                            <div className="product-simple-area ptb-80">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="product-main-image">
                                            <a
                                                className="image-link"
                                                href={selectedImage}
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                <img
                                                    src={selectedImage}
                                                    className="first_img"
                                                    alt={title}
                                                />
                                            </a>
                                        </div>

                                        <ul className="sinple-tab-menu" role="tablist">
                                            {uniqueImages.map((img, index) => (
                                                <li
                                                    key={img}
                                                    className={index === selectedImageIndex ? "active" : ""}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedImageIndex(index)}
                                                        className="product-thumb-btn"
                                                    >
                                                        <img src={img} alt={title} />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="product-simple-content">
                                            <div className="sinple-c-title">
                                                <h3>
                                                    {loadingProduct
                                                        ? getLocalizedValue(textByLang.loading, lang, "Chargement...")
                                                        : title}
                                                </h3>
                                            </div>

                                            <div className="checkbox">
                                                <span>
                                                    <i className="fa fa-check-square" aria-hidden="true"></i>
                                                    {inStock
                                                        ? getLocalizedValue(textByLang.stockIn, lang, "En stock")
                                                        : getLocalizedValue(textByLang.stockOut, lang, "Rupture de stock")}
                                                </span>
                                            </div>

                                            <span>
                                                {getLocalizedValue(textByLang.sku, lang, "SKU")}: {sku}
                                            </span>

                                            <div className="product-price-star star-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <i
                                                        key={star}
                                                        className={`fa ${star <= roundedRate ? "fa-star" : "fa-star-o"}`}
                                                    ></i>
                                                ))}

                                                <span>
                                                    ({reviewCount} {reviewLabel})
                                                </span>
                                            </div>

                                            <h4>{price.toFixed(2)} €</h4>

                                            <ul
                                                className="product-colors"
                                                style={{
                                                    display: "flex",
                                                    gap: 8,
                                                    padding: 0,
                                                    margin: "20px 0",
                                                    listStyle: "none",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                {rangeProducts.map((colorProduct) => {
                                                    const metas = colorProduct.metas || {};
                                                    const colorHex = metas.content_hex || "#ddd";

                                                    const colorName =
                                                        metas.content_label_feetchy?.[lang] ||
                                                        metas.content_label_feetchy?.fr ||
                                                        metas.content_label?.[lang] ||
                                                        metas.content_label?.fr ||
                                                        colorProduct.content?.content_title?.[lang] ||
                                                        colorProduct.content?.content_title?.fr ||
                                                        "Couleur";

                                                    const rawUrl =
                                                        metas.content_url_feetchy?.[lang] ||
                                                        metas.content_url_feetchy?.fr ||
                                                        metas.content_url?.[lang] ||
                                                        metas.content_url?.fr ||
                                                        `product-${colorProduct.id}`;

                                                    const url = cleanUrl(rawUrl);
                                                    const isActive = Number(colorProduct.id) === Number(product?.id);

                                                    return (
                                                        <li key={colorProduct.id}>
                                                            <Link href={`/${url}`} title={colorName}>
                                                                <div
                                                                    style={{
                                                                        width: 26,
                                                                        height: 26,
                                                                        borderRadius: "50%",
                                                                        backgroundColor: colorHex,
                                                                        border: isActive ? "3px solid #c2a773" : "1px solid #ccc",
                                                                        boxShadow: "0 0 0 2px #fff",
                                                                    }}
                                                                />
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>

                                            {references.length > 0 && (
                                                <label
                                                    htmlFor="product-reference"
                                                    style={{ display: "block", marginTop: 20, marginBottom: 8 }}
                                                >
                                                    {getLocalizedValue(textByLang.reference, lang, "Taille / Référence")}
                                                </label>
                                            )}

                                            <div style={{ display: "flex", gap: 12, margin: "0 0 20px", flexWrap: "wrap" }}>
                                                {references.length > 0 && (
                                                    <select
                                                        id="product-reference"
                                                        className="selector-input"
                                                        value={selectedRefIndex}
                                                        onChange={(e) => {
                                                            const nextIndex = Number(e.target.value);
                                                            const nextStock = Number(references[nextIndex]?.stock ?? 0);

                                                            if (nextStock <= 0) return;

                                                            setSelectedRefIndex(nextIndex);
                                                            setQuantity(1);
                                                        }}
                                                        style={{
                                                            flex: "1 1 auto",
                                                            minWidth: "180px",
                                                            height: "42px",
                                                            padding: "8px 40px 8px 8px",
                                                            appearance: "none",
                                                            WebkitAppearance: "none",
                                                            MozAppearance: "none",
                                                            backgroundImage:
                                                                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23333' stroke-width='1.5' fill='none' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                                                            backgroundRepeat: "no-repeat",
                                                            backgroundPosition: "right 20px center",
                                                        }}
                                                    >
                                                        {references.map((ref, index) => {
                                                            const refLabel =
                                                                ref?.title?.[lang] ||
                                                                ref?.title?.fr ||
                                                                ref?.title?.us ||
                                                                ref?.ref ||
                                                                `${getLocalizedValue(textByLang.referenceFallback, lang, "Référence")} ${index + 1}`;

                                                            const refPrice = Number(ref?.price?.eur ?? ref?.price?.EUR ?? 0).toFixed(2);
                                                            const refStock = Number(ref?.stock ?? 0);
                                                            const disabled = refStock <= 0;

                                                            return (
                                                                <option
                                                                    key={`${ref.ref || index}`}
                                                                    value={index}
                                                                    disabled={disabled}
                                                                >
                                                                    {refLabel} - {refPrice} € {disabled ? "(rupture)" : ""}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                )}

                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={currentStock > 0 ? currentStock : undefined}
                                                    value={quantity}
                                                    onChange={handleQuantityChange}
                                                    disabled={!inStock}
                                                    className="selector-input"
                                                    style={{
                                                        width: "90px",
                                                        height: "42px",
                                                        padding: "8px",
                                                        textAlign: "center",
                                                    }}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={handleAddToCart}
                                                    disabled={!inStock}
                                                    style={{
                                                        height: "42px",
                                                        padding: "0 20px",
                                                        border: "none",
                                                        background: justAdded ? "#3c9a5f" : inStock ? "#222" : "#999",
                                                        color: "#fff",
                                                        cursor: inStock ? "pointer" : "not-allowed",
                                                        transition: "background 0.25s ease, transform 0.2s ease",
                                                        transform: justAdded ? "scale(1.04)" : "scale(1)",
                                                    }}
                                                >
                                                    {justAdded
                                                        ? `✓ ${getLocalizedValue(textByLang.added, lang, "Ajouté")}`
                                                        : getLocalizedValue(textByLang.addToCart, lang, "Ajouter au panier")}
                                                </button>
                                            </div>

                                            <p>{description}</p>

                                            {reviews.length > 0 && (
                                                <div className="product-reviews" style={{ marginTop: 40 }}>
                                                    <h3>
                                                        {reviewCount} {reviewLabel}
                                                    </h3>

                                                    {reviews.map((review, index) => {
                                                        const rate = Number(review?.rate || 0);

                                                        return (
                                                            <div
                                                                key={`${review?.name || "review"}-${index}`}
                                                                className="product-review-item"
                                                                style={{
                                                                    borderTop: "1px solid #eee",
                                                                    padding: "20px 0",
                                                                }}
                                                            >
                                                                <div className="product-price-star">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <i
                                                                            key={star}
                                                                            className={`fa ${star <= rate ? "fa-star" : "fa-star-o"}`}
                                                                        ></i>
                                                                    ))}
                                                                </div>

                                                                <h4 style={{ marginTop: 8 }}>
                                                                    {review?.name || "Client"}
                                                                </h4>

                                                                <p>{review?.message}</p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer lang={lang} />
        </div>
    );
};

export default Product;