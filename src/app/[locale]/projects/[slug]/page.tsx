import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ProjectStudio } from "~/components/editor/project-studio";
import { ProjectArticle } from "~/components/resume/project-article";
import { loadProject } from "~/server/resume";
import { asLocalized, localize } from "~/utils/localized";
import { locales, type Locale } from "~/utils/navigation";

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
  const t = await getTranslations("global");
  const loaded = await loadProject(slug);
  if (!loaded) return { title: t("title") };
  return { title: localize(loaded.project.title, asLocale(locale)) };
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
          technologies: project.technologies.map((item) => asLocalized(item.name)),
        }}
      />
    );
  }
  return (
    <ProjectArticle
      locale={current}
      title={localize(project.title, current)}
      excerpt={localize(project.excerpt, current)}
      content={localize(project.content, current)}
      technologies={project.technologies.map((item) => localize(item.name, current))}
    />
  );
}
