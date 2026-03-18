# Feetchy Next Enterprise

Base Next.js pensée comme un projet d'entreprise :
- React + Next.js App Router
- pages SEO server-rendered
- connexion à une API PHP externe
- composants séparés
- catégories / produits / homepage
- robots, sitemap, metadata, JSON-LD

## Installation

```bash
npm install
npm run dev
```

## Configuration

Copie `.env.example` en `.env.local` puis adapte :

```bash
cp .env.example .env.local
```

Variables importantes :
- `NEXT_PUBLIC_SITE_URL` : URL publique du front
- `NEXT_PUBLIC_API_BASE_URL` : URL publique de l'API PHP
- `REVALIDATE_SECRET` : secret pour relancer le cache si besoin

## Fichiers à modifier en priorité

- `app/layout.jsx` : structure globale du site
- `app/page.jsx` : homepage
- `app/categorie/[slug]/page.jsx` : page catégorie
- `app/produit/[slug]/page.jsx` : page produit
- `components/layout/Header.jsx`
- `components/layout/Footer.jsx`
- `lib/api.js` : connexion API
- `lib/site.js` : configuration globale du site
- `app/globals.css` : styles globaux

## Fonctionnement API

Le front appelle une API distante, par exemple :
- `/site.php`
- `/categories.php`
- `/category.php?slug=...`
- `/products.php`
- `/product.php?slug=...`

Si l'API ne répond pas encore, le projet affiche des données mock pour démarrer rapidement.

## Déploiement

```bash
npm run build
npm run start
```

Pour un hébergement Node, déploie le projet Next.js séparément du back-office PHP.
