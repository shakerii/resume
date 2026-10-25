import * as rootParams from "next/root-params";
import { getRequestConfig } from "next-intl/server";
import { routing, type Locale } from "~/utils/navigation";
import { formats } from "~/utils/i18n";

type RootParams = {
  locale: () => Promise<string | undefined>;
};

function asLocale(value: string | undefined): Locale {
  return routing.locales.includes(value as Locale)
    ? (value as Locale)
    : routing.defaultLocale;
}

export default getRequestConfig(async ({ locale }) => {
  const requested = locale ?? (await (rootParams as RootParams).locale());
  const resolved = asLocale(requested);
  return {
    locale: resolved,
    messages: (await import(`../../messages/${resolved}.json`)).default,
    formats,
  };
});
