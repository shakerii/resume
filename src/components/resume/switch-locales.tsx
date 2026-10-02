"use client";

import { useLocale, useTranslations } from "next-intl";
import { useChangeLocale } from "~/hooks/change-locale";
import { cn } from "~/utils/cn";
import { locales, type Locale } from "~/utils/navigation";

export function SwitchLocales({ variant = "classic" }: { variant?: "classic" | "future" }) {
  const t = useTranslations("nav");
  const names = useTranslations("locales");
  const current = useLocale();
  const change = useChangeLocale();
  return (
    <select
      aria-label={t("language")}
      value={current}
      onChange={(event) => change(event.target.value as Locale)}
      className={cn(
        "h-8 rounded-md border px-2 text-sm",
        variant === "future"
          ? "border-cyan-400/40 bg-cyan-950/40 font-mono text-xs uppercase tracking-widest text-cyan-300 transition hover:border-cyan-300 hover:shadow-[0_0_14px_rgba(34,211,238,0.4)]"
          : "border-input bg-background",
      )}
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {names(locale)}
        </option>
      ))}
    </select>
  );
}
