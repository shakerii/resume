import type { Locale } from "@fb/utils/navigation";
import { routing } from "@fb/utils/navigation";
import { getRequestConfig } from "next-intl/server";

import { formats } from "~/utils/i18n";

/** Get list of messages of the app locale */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  // Ensure that the incoming locale is valid
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    messages: (await import(`../../messages/${locale}.json`)).default,
    formats: formats,
  };
});
