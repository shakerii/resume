import { z } from "zod";
import type { Locale } from "~/utils/navigation";

export type LocalizedText = Record<Locale, string>;

export const fallbackLocale: Locale = "en";

export const localizedTextSchema = z.object({
  fa: z.string(),
  en: z.string(),
});

export const emptyText = (): LocalizedText => ({ fa: "", en: "" });

export function asLocalized(value: unknown): LocalizedText {
  if (typeof value === "string") {
    try {
      return asLocalized(JSON.parse(value));
    } catch {
      return { fa: value, en: value };
    }
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Partial<LocalizedText>;
    return {
      fa: typeof record.fa === "string" ? record.fa : "",
      en: typeof record.en === "string" ? record.en : "",
    };
  }
  return emptyText();
}

export function localize(value: unknown, locale: Locale): string {
  const text = asLocalized(value);
  const preferred = text[locale].trim();
  if (preferred) return preferred;
  const fallback = text[fallbackLocale].trim();
  if (fallback) return fallback;
  return text.en.trim() || text.fa.trim();
}
