import { readFileSync } from "node:fs";
import { PrismaClient, type Prisma } from "@prisma/client";
import type { LocalizedText } from "../src/utils/localized";

const prisma = new PrismaClient();

type BasicInfoSeed = {
  key: string;
  value: LocalizedText;
};

type ExperienceSeed = {
  company: LocalizedText;
  role: LocalizedText;
  period: LocalizedText;
  description: LocalizedText;
};

type EducationSeed = {
  degree: LocalizedText;
  institution: LocalizedText;
};

type LanguageSeed = {
  name: LocalizedText;
  level: LocalizedText;
};

type ProjectSeed = {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  technologies: Array<{
    name: LocalizedText;
    sortOrder: number;
  }>;
};

type SkillGroupSeed = {
  name: LocalizedText;
  skills: Array<{
    name: LocalizedText;
    rating: number;
  }>;
};

function loadSeed<T>(fileName: string): T {
  const file = new URL(`./seeds/${fileName}`, import.meta.url);
  return JSON.parse(readFileSync(file, "utf8")) as T;
}

const basicInfo = loadSeed<BasicInfoSeed[]>("basic-info.json");
const experiences = loadSeed<ExperienceSeed[]>("experiences.json");
const education = loadSeed<EducationSeed[]>("education.json");
const languages = loadSeed<LanguageSeed[]>("languages.json");
const projects = loadSeed<ProjectSeed[]>("projects.json");
const skillGroups = loadSeed<SkillGroupSeed[]>("skills.json");

async function main() {
  await prisma.projectTechnology.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillGroup.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.language.deleteMany();
  await prisma.basicInfo.deleteMany();

  await prisma.basicInfo.createMany({
    data: basicInfo.map((item, sortOrder) => ({
      key: item.key,
      value: item.value as Prisma.InputJsonValue,
      sortOrder,
    })),
  });

  await prisma.experience.createMany({
    data: experiences.map((item, sortOrder) => ({
      company: item.company as Prisma.InputJsonValue,
      role: item.role as Prisma.InputJsonValue,
      period: item.period as Prisma.InputJsonValue,
      description: item.description as Prisma.InputJsonValue,
      sortOrder,
    })),
  });

  await prisma.education.createMany({
    data: education.map((item, sortOrder) => ({
      degree: item.degree as Prisma.InputJsonValue,
      institution: item.institution as Prisma.InputJsonValue,
      sortOrder,
    })),
  });

  await prisma.language.createMany({
    data: languages.map((item, sortOrder) => ({
      name: item.name as Prisma.InputJsonValue,
      level: item.level as Prisma.InputJsonValue,
      sortOrder,
    })),
  });

  for (const [sortOrder, project] of projects.entries()) {
    await prisma.project.create({
      data: {
        slug: project.slug,
        title: project.title as Prisma.InputJsonValue,
        excerpt: project.excerpt as Prisma.InputJsonValue,
        content: project.content as Prisma.InputJsonValue,
        sortOrder,
        technologies: {
          create: project.technologies.map((item) => ({
            name: item.name as Prisma.InputJsonValue,
            sortOrder: item.sortOrder,
          })),
        },
      },
    });
  }

  for (const [sortOrder, group] of skillGroups.entries()) {
    await prisma.skillGroup.create({
      data: {
        name: group.name as Prisma.InputJsonValue,
        sortOrder,
        skills: {
          create: group.skills.map((skill, skillSortOrder) => ({
            name: skill.name as Prisma.InputJsonValue,
            rating: skill.rating,
            sortOrder: skillSortOrder,
          })),
        },
      },
    });
  }
}

main().finally(() => prisma.$disconnect());
