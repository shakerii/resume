import { cache } from "react";
import { TRPCError } from "@trpc/server";
import { createCaller } from "~/server/api/caller";
import { localize } from "~/utils/localized";
import type { Locale } from "~/utils/navigation";
import type { ResumeData } from "~/components/resume/types";

function text(value: unknown, locale: Locale) {
  return localize(value, locale);
}

export const loadResume = cache(async (locale: Locale): Promise<ResumeData> => {
  const caller = await createCaller();
  const [info, experiences, projects, groups, education, languages] = await Promise.all([
    caller.basicInfo.all(),
    caller.experience.all(),
    caller.project.all(),
    caller.skillGroup.all(),
    caller.education.all(),
    caller.language.all(),
  ]);
  const basics = Object.fromEntries(info.map((row) => [row.key, text(row.value, locale)]));
  return {
    name: basics.name ?? "",
    title: basics.title ?? "",
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
      technologies: item.technologies.map((technology) => text(technology.name, locale)),
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
    })),
    languages: languages.map((item) => ({
      id: item.id,
      name: text(item.name, locale),
      level: text(item.level, locale),
    })),
  };
});

export async function loadProject(slug: string) {
  const caller = await createCaller();
  try {
    const [project, session] = await Promise.all([caller.project.bySlug({ slug }), caller.admin.me()]);
    return { project, isAdmin: session.isAdmin };
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") return null;
    throw error;
  }
}
