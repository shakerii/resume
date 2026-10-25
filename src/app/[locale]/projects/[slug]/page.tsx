import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ProjectStudio } from "~/components/editor/project-studio";
import { ProjectArticle } from "~/components/resume/project-article";
import { ProjectShell } from "~/components/resume/resume-shell";
import { loadProject, loadResume } from "~/server/resume";
import { asLocalized, localize } from "~/utils/localized";
import { locales, type Locale } from "~/utils/navigation";
import { StructuredData } from "~/components/resume/structured-data";
import { plainText } from "~/utils/html";
import { localizedUrl, pageMetadata, siteUrl } from "~/utils/seo";

export const dynamic = "force-dynamic";

function asLocale(value: string): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : "fa";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loaded = await loadProject(slug);
  if (!loaded) notFound();
  const current = asLocale(locale);
  const t = await getTranslations({ locale: current, namespace: "global" });
  const data = await loadResume(current);
  const title = localize(loaded.project.title, current);
  return {
    ...pageMetadata({
      locale: current,
      path: `/projects/${encodeURIComponent(loaded.project.slug)}`,
      title: data.name ? `${title} - ${data.name}` : title,
      description:
        plainText(localize(loaded.project.excerpt, current)) ||
        plainText(localize(loaded.project.content, current)) ||
        t("description"),
    }),
    ...(loaded.isAdmin ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const current = asLocale(locale);
  const loaded = await loadProject(slug);
  if (!loaded) notFound();
  const { project, isAdmin } = loaded;
  if (isAdmin) {
    return (
      <ProjectStudio
        project={{
          id: project.id,
          slug: project.slug,
          active: project.active,
          title: asLocalized(project.title),
          excerpt: asLocalized(project.excerpt),
          content: asLocalized(project.content),
          technologies: project.technologies.map((item) =>
            asLocalized(item.name),
          ),
        }}
      />
    );
  }
  const article = {
    title: localize(project.title, current),
    excerpt: localize(project.excerpt, current),
    content: localize(project.content, current),
    technologies: project.technologies.map((item) =>
      localize(item.name, current),
    ),
  };
  const data = await loadResume(current);
  const nav = await getTranslations("nav");
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CreativeWork",
              name: article.title,
              description:
                plainText(article.excerpt) || plainText(article.content),
              url: localizedUrl(
                current,
                `/projects/${encodeURIComponent(project.slug)}`,
              ),
              inLanguage: current,
              dateCreated: project.createdAt.toISOString(),
              dateModified: project.updatedAt.toISOString(),
              keywords: article.technologies,
              author: {
                "@type": "Person",
                "@id": new URL("/#person", siteUrl).href,
                name: data.name,
                url: localizedUrl(current),
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: nav("resume"),
                  item: localizedUrl(current),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: article.title,
                  item: localizedUrl(
                    current,
                    `/projects/${encodeURIComponent(project.slug)}`,
                  ),
                },
              ],
            },
          ],
        }}
      />
      <ProjectShell
        locale={current}
        project={article}
        classic={<ProjectArticle locale={current} {...article} />}
      />
    </>
  );
}
