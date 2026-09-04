"use client";
import { useLocale, useTranslations } from "next-intl";
import { locales, type Locale } from "~/utils/navigation";
import { useChangeLocale } from "~/hooks/change-locale";

export function SwitchLocales() {
  const t = useTranslations("nav");
  const current = useLocale();
  const change = useChangeLocale();
  return (
    <select
      aria-label={t("language")}
      value={current}
      onChange={(e) => change(e.target.value as Locale)}
      className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {l === "fa" ? "فارسی" : "English"}
        </option>
      ))}
    </select>
  );
}
