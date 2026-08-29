import { getRequestConfig } from "next-intl/server";
import { routing, type Locale } from "~/utils/navigation";
import { formats } from "~/utils/i18n";
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = routing.locales.includes(requested as Locale) ? (requested as Locale) : routing.defaultLocale;
  return { locale, messages: (await import(`../../messages/${locale}.json`)).default, formats };
});
