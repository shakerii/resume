export const locales = ["fa", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fa";
export const localePrefix = "always" as const;
export const routing = { locales, defaultLocale, localePrefix };
