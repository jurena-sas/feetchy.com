import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/cart",
        "/checkout",
        "/confirm",
        "/success",
        "/account",
        "/*/cart",
        "/*/checkout",
        "/*/confirm",
        "/*/success",
        "/*/account",
      ],
    },
    sitemap: "https://www.feetchy.com/sitemap.xml",
  };
}
