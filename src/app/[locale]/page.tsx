import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ResumeShell } from "~/components/resume/resume-shell";
import { ResumeView } from "~/components/resume/resume-view";
import { loadResume } from "~/server/resume";
import { locales, type Locale } from "~/utils/navigation";
import { StructuredData } from "~/components/resume/structured-data";
import { plainText } from "~/utils/html";
import { localizedUrl, pageMetadata, siteUrl } from "~/utils/seo";

function asLocale(value: string): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : "fa";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const current = asLocale(locale);
  const t = await getTranslations({
    locale: current,
    namespace: "global",
  });
  const data = await loadResume(current);
  const title =
    data.name && data.title ? `${data.name} - ${data.title}` : t("title");
  return pageMetadata({
    locale: asLocale(locale),
    title,
    description: plainText(data.summary) || t("description"),
  });
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const current = asLocale(locale);
  const data = await loadResume(current);
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": `${localizedUrl(current)}#profile`,
          url: localizedUrl(current),
          inLanguage: current,
          name: data.name,
          mainEntity: {
            "@type": "Person",
            "@id": new URL("/#person", siteUrl).href,
            name: data.name,
            jobTitle: data.title,
            description: plainText(data.summary),
            url: localizedUrl(current),
            image: new URL("/avatar.jpg", siteUrl).href,
            ...(data.github && /^https?:\/\//i.test(data.github)
              ? { sameAs: [data.github] }
              : {}),
            knowsAbout: data.skillGroups.flatMap((group) =>
              group.skills.map((skill) => skill.name),
            ),
          },
        }}
      />
      <ResumeShell
        locale={current}
        data={data}
        classic={<ResumeView locale={current} data={data} />}
      />
    </>
  );
}
