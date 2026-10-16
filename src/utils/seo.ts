import type { Metadata } from "next";
import { plainText } from "~/utils/html";
import { defaultLocale, locales, type Locale } from "~/utils/navigation";

export const siteUrl = new URL("https://ramtinshakeri.com");

export function localizedUrl(locale: Locale, path = "") {
  return new URL(`/${locale}${path}`, siteUrl).href;
}

export function languageAlternates(path = "") {
  return {
    ...Object.fromEntries(
      locales.map((locale) => [locale, localizedUrl(locale, path)]),
    ),
    "x-default": localizedUrl(defaultLocale, path),
  };
}

export function seoDescription(value: string) {
  const description = plainText(value);
  if (description.length <= 160) return description;
  return `${description.slice(0, 157).replace(/\s+\S*$/, "")}…`;
}

export function pageMetadata({
  locale,
  path = "",
  title,
  description,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
}): Metadata {
  const summary = seoDescription(description);
  const url = localizedUrl(locale, path);
  const image = {
    url: new URL("/avatar.jpg", siteUrl).href,
    width: 640,
    height: 640,
    alt: locale === "fa" ? "رامتین شاکری" : "Ramtin Shakeri",
  };
  return {
    title,
    description: summary,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      title,
      description: summary,
      url,
      siteName: locale === "fa" ? "رامتین شاکری" : "Ramtin Shakeri",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: locale === "fa" ? ["en_US"] : ["fa_IR"],
      images: [image],
    },
    twitter: {
      card: "summary",
      title,
      description: summary,
      images: [image.url],
    },
  };
}
