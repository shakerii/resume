import type {Locale} from "@fb/utils/navigation";
import {locales} from "@fb/utils/navigation";
import { useLocale, useTranslations } from "next-intl";

import { useChangeLocale } from "~/hooks/change-locale";

/** Switch between locales component */
export const SwitchLocales = () => {
  const t = useTranslations("pages.dashboard.customize.locale");
  const currentLocale = useLocale();
  const change = useChangeLocale();

  return (
    <select aria-label={t("label")} value={currentLocale} onChange={(e) => change(e.target.value as Locale)}>
      {locales.map((locale) => <option key={locale} value={locale}>{t(locale)}</option>)}
    </select>
  );
};
