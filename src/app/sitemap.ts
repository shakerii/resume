import type { MetadataRoute } from "next";
import { loadSitemapProjects } from "~/server/resume";
import { locales } from "~/utils/navigation";
import { languageAlternates, localizedUrl } from "~/utils/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await loadSitemapProjects();
  return locales.flatMap((locale) => [
    {
      url: localizedUrl(locale),
      alternates: { languages: languageAlternates() },
    },
    ...projects.map((project) => {
      const path = `/projects/${encodeURIComponent(project.slug)}`;
      return {
        url: localizedUrl(locale, path),
        lastModified: project.updatedAt,
        alternates: { languages: languageAlternates(path) },
      };
    }),
  ]);
}
