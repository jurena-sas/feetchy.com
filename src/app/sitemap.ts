import type { MetadataRoute } from "next";
import { allowedLangs, buildLocalizedPath, defaultLang } from "@/src/config";
import { fetchSitemapXmlEntries } from "@/src/app/route-data";

const SITE_URL = "https://www.feetchy.com";
const STATIC_PATHS = ["", "sitemap"];

const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

const buildLanguages = (urlByLang: Record<string, string>) => {
  const languages: Record<string, string> = {};

  allowedLangs.forEach((lang) => {
    const rawUrl = urlByLang[lang];
    if (rawUrl) {
      languages[lang] = absoluteUrl(buildLocalizedPath(lang, rawUrl));
    }
  });

  return languages;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await fetchSitemapXmlEntries();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => {
    const languages: Record<string, string> = {};
    allowedLangs.forEach((lang) => {
      languages[lang] = absoluteUrl(buildLocalizedPath(lang, path));
    });

    return {
      url: languages[defaultLang],
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.3,
      alternates: { languages },
    };
  });

  const contentEntries: MetadataRoute.Sitemap = entries.map((entry) => {
    const languages = buildLanguages(entry.urlByLang);
    const url = languages[defaultLang] || Object.values(languages)[0];

    return {
      url,
      changeFrequency: "weekly",
      priority: 0.6,
      alternates: { languages },
    };
  });

  return [...staticEntries, ...contentEntries];
}
