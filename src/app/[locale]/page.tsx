import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ResumeView } from "~/components/resume/resume-view";
import { loadResume } from "~/server/resume";
import { locales, type Locale } from "~/utils/navigation";

export const dynamic = "force-dynamic";

function asLocale(value: string): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : "fa";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("global");
  const data = await loadResume(asLocale(locale));
  const title = data.name && data.title ? `${data.name} — ${data.title}` : t("title");
  return { title, description: data.summary || t("description") };
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const current = asLocale(locale);
  const data = await loadResume(current);
  return <ResumeView locale={current} data={data} />;
}
