"use client";

import { useLocale, useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useChangeLocale } from "~/hooks/change-locale";
import { cn } from "~/utils/cn";
import { locales, type Locale } from "~/utils/navigation";

export function SwitchLocales({ variant = "classic" }: { variant?: "classic" | "future" }) {
  const t = useTranslations("nav");
  const names = useTranslations("locales");
  const current = useLocale();
  const change = useChangeLocale();
  const future = variant === "future";
  return (
    <Select value={current} onValueChange={(value) => change(value as Locale)}>
      <SelectTrigger
        aria-label={t("language")}
        data-analytics="language-selector"
        className={cn(
          "h-8 w-auto min-w-24 px-2",
          future
            ? "border-cyan-400/40 bg-cyan-950/40 font-mono text-xs uppercase tracking-widest text-cyan-300 hover:border-cyan-300 hover:shadow-[0_0_14px_rgba(34,211,238,0.4)]"
            : "border-input-border bg-background",
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        className={
          future
            ? "border-cyan-400/40 bg-[#041018] font-mono text-xs uppercase tracking-widest text-cyan-200"
            : undefined
        }
      >
        {locales.map((locale) => (
          <SelectItem
            key={locale}
            value={locale}
            data-analytics={`language-${locale}`}
            className={future ? "focus:bg-cyan-400/15 focus:text-cyan-100" : undefined}
          >
            {names(locale)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
