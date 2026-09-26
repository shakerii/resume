"use client";

import { useLocale, useTranslations } from "next-intl";
import { useChangeLocale } from "~/hooks/change-locale";
import { locales, type Locale } from "~/utils/navigation";

export function SwitchLocales() {
  const t = useTranslations("nav");
  const names = useTranslations("locales");
  const current = useLocale();
  const change = useChangeLocale();
  return (
    <select
      aria-label={t("language")}
      value={current}
      onChange={(event) => change(event.target.value as Locale)}
      className="h-8 rounded-md border border-input bg-background px-2 text-sm"
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {names(locale)}
        </option>
      ))}
    </select>
  );
}
