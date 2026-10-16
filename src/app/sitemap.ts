import type { MetadataRoute } from "next";
import { prisma } from "~/server/db";
import { locales } from "~/utils/navigation";
import { languageAlternates, localizedUrl } from "~/utils/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await prisma.project.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
    orderBy: { slug: "asc" },
  });
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
