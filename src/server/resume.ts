import { unstable_cache } from "next/cache";
import { cache } from "react";
import { TRPCError } from "@trpc/server";
import type { ResumeData } from "~/components/resume/types";
import { appRouter } from "~/server/api/root";
import { createCaller } from "~/server/api/caller";
import { resumeCacheSeconds, resumeCacheTag } from "~/server/resume-cache";
import { prisma } from "~/server/db";
import { localize } from "~/utils/localized";
import type { Locale } from "~/utils/navigation";

function text(value: unknown, locale: Locale) {
  return localize(value, locale);
}

function publicCaller() {
  return appRouter.createCaller({ prisma, isAdmin: false });
}

const cacheOptions = { tags: [resumeCacheTag], revalidate: resumeCacheSeconds };

async function readResume(locale: Locale): Promise<ResumeData> {
  const caller = publicCaller();
  const [info, experiences, projects, groups, education, languages] =
    await Promise.all([
      caller.basicInfo.all(),
      caller.experience.all(),
      caller.project.all(),
      caller.skillGroup.all(),
      caller.education.all(),
      caller.language.all(),
    ]);
  const basics = Object.fromEntries(
    info.map((row) => [row.key, text(row.value, locale)]),
  );
  return {
    name: basics.name ?? "",
    title: basics.title ?? "",
    website: basics.website ?? "",
    email: basics.email ?? "",
    phone: basics.phone ?? "",
    github: basics.github ?? "",
    location: basics.location ?? "",
    summary: basics.summary ?? "",
    experiences: experiences.map((item) => ({
      id: item.id,
      company: text(item.company, locale),
      role: text(item.role, locale),
      period: text(item.period, locale),
      description: text(item.description, locale),
    })),
    projects: projects.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: text(item.title, locale),
      excerpt: text(item.excerpt, locale),
      technologies: item.technologies.map((technology) =>
        text(technology.name, locale),
      ),
    })),
    skillGroups: groups.map((group) => ({
      id: group.id,
      name: text(group.name, locale),
      skills: group.skills.map((skill) => ({
        id: skill.id,
        name: text(skill.name, locale),
        rating: skill.rating,
      })),
    })),
    education: education.map((item) => ({
      id: item.id,
      degree: text(item.degree, locale),
      institution: text(item.institution, locale),
      period: text(item.period, locale),
      description: text(item.description, locale),
    })),
    languages: languages.map((item) => ({
      id: item.id,
      name: text(item.name, locale),
      level: text(item.level, locale),
    })),
  };
}

const readCachedResume = unstable_cache(readResume, ["resume"], cacheOptions);

export const loadResume = cache((locale: Locale) => readCachedResume(locale));

export type SitemapProject = { slug: string; updatedAt: string };

async function readSitemapProjects(): Promise<SitemapProject[]> {
  const projects = await prisma.project.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
    orderBy: { slug: "asc" },
  });
  return projects.map((project) => ({
    slug: project.slug,
    updatedAt: project.updatedAt.toISOString(),
  }));
}

export const loadSitemapProjects = unstable_cache(
  readSitemapProjects,
  ["resume-sitemap"],
  cacheOptions,
);

type CachedProject = {
  slug: string;
  title: unknown;
  excerpt: unknown;
  content: unknown;
  technologies: Array<{ name: unknown }>;
  createdAt: string;
  updatedAt: string;
};

export type PublicProject = {
  slug: string;
  title: unknown;
  excerpt: unknown;
  content: unknown;
  technologies: Array<{ name: unknown }>;
  createdAt: Date;
  updatedAt: Date;
};

async function readPublicProject(slug: string): Promise<CachedProject | null> {
  try {
    const project = await publicCaller().project.bySlug({ slug });
    return {
      slug: project.slug,
      title: project.title,
      excerpt: project.excerpt,
      content: project.content,
      technologies: project.technologies.map((item) => ({ name: item.name })),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") return null;
    throw error;
  }
}

const readCachedPublicProject = unstable_cache(
  readPublicProject,
  ["resume-project"],
  cacheOptions,
);

function reviveProject(project: CachedProject): PublicProject {
  return {
    ...project,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  };
}

export const loadProject = cache(async (slug: string) => {
  const caller = await createCaller();
  const session = await caller.admin.me();
  if (session.isAdmin) {
    try {
      const project = await caller.project.bySlug({ slug });
      return { project, isAdmin: true as const };
    } catch (error) {
      if (error instanceof TRPCError && error.code === "NOT_FOUND") return null;
      throw error;
    }
  }
  const project = await readCachedPublicProject(slug);
  if (!project) return null;
  return { project: reviveProject(project), isAdmin: false as const };
});
