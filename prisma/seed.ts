import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const basicInfo = [
  ["name", "Ramtin Shakeri"],
  ["title", "Software Engineer"],
  ["email", "r.shakeri1375@gmail.com"],
  ["phone", "+98 919 084 8501"],
  ["github", "https://github.com/shakerii"],
  ["location", "Tehran, Iran"],
  [
    "summary",
    "Full-stack Software Engineer with 7+ years of experience building AI-driven applications, scalable platforms, and user-focused web solutions.",
  ],
] as const;
const experiences = [
  [
    "Farbonyan",
    "Frontend & AI Developer",
    "Feb 2024 - Present",
    "Developing AI-powered data analysis and reporting tools using LangChain and Next.js.",
  ],
  [
    "Interactive 10 (Remote)",
    "CTO & Software Engineer",
    "Jun 2022 - Feb 2024",
    "Led a distributed development team delivering SaaS platforms and scalable backend services.",
  ],
  [
    "Matap",
    "CTO & Full-Stack Developer",
    "Mar 2022 - Jun 2022",
    "Designed architecture for B2B web platforms and implemented core backend services.",
  ],
  [
    "Freelance",
    "Full-Stack Developer",
    "2020 - 2022",
    "Delivered custom web applications with React, Node.js and Laravel.",
  ],
] as const;
const projects = [
  [
    "sabi",
    "SABI",
    "AI-powered reporting assistant for business insights.",
    "<h2>SABI</h2><p>Developed an AI-powered reporting assistant that generates business insights from company data.</p>",
    ["LangChain", "LangGraph", "Next.js", "tRPC", "Redis", "Docker"],
  ],
  [
    "fis",
    "FIS (Farbonyan Intelligent Sales)",
    "React-based B2B e-commerce platform for car parts.",
    "<h2>FIS</h2><p>Engineered a B2B e-commerce platform for car parts sales, inventory, and shipment management.</p>",
    ["React", "React Table", "React Query", "REST APIs", "Docker"],
  ],
  [
    "smart-catalog",
    "Smart Catalog",
    "Interactive product catalog builder with dynamic filters.",
    "<h2>Smart Catalog</h2><p>Built an admin dashboard for designing interactive product catalogs with drag-and-drop components.</p>",
    ["Next.js", "tRPC", "DND-kit", "TailwindCSS", "MySQL", "Docker"],
  ],
  [
    "baas-platform",
    "BAAS Platform",
    "Backend services for database management and APIs.",
    "<h2>BAAS Platform</h2><p>Designed backend services including authentication, role-based access and scalable microservices.</p>",
    ["React", "Laravel", "MySQL", "Docker"],
  ],
] as const;
const skillGroups = {
  Languages: ["TypeScript", "JavaScript", "Python", "PHP", "Go"],
  Frameworks: ["Next.js", "React", "FastAPI", "Laravel", "NestJS"],
  Libraries: [
    "Turborepo",
    "React Table",
    "React Query",
    "DND-kit",
    "tRPC",
    "LangChain",
    "LangGraph",
  ],
  Databases: ["MySQL", "PostgreSQL", "MongoDB", "Prisma", "Redis"],
  Tools: ["Docker", "RabbitMQ", "MQTT"],
  OS: ["Linux (Ubuntu)", "Windows"],
} as const;

async function main() {
  await prisma.projectTechnology.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillGroup.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.basicInfo.deleteMany();
  await prisma.education.deleteMany();
  await prisma.language.deleteMany();
  await prisma.basicInfo.createMany({
    data: basicInfo.map(([key, value], sortOrder) => ({
      key,
      value,
      sortOrder,
    })),
  });
  await prisma.experience.createMany({
    data: experiences.map(
      ([company, role, period, description], sortOrder) => ({
        company,
        role,
        period,
        description,
        sortOrder,
      }),
    ),
  });
  await prisma.education.createMany({
    data: [
      {
        degree: "B.Sc. Computer Engineering (Software)",
        institution: "Amirkabir University of Technology",
        sortOrder: 0,
      },
      {
        degree: "Math-Physics Diploma",
        institution: "Allame Helli 1 (Sampad)",
        sortOrder: 1,
      },
    ],
  });
  await prisma.language.createMany({
    data: [
      { name: "Persian", level: "Native", sortOrder: 0 },
      { name: "English", level: "Fluent", sortOrder: 1 },
    ],
  });
  for (const [
    sortOrder,
    [slug, title, excerpt, content, technologies],
  ] of projects.entries())
    await prisma.project.create({
      data: {
        slug,
        title,
        excerpt,
        content,
        sortOrder,
        technologies: {
          create: technologies.map((name, i) => ({ name, sortOrder: i })),
        },
      },
    });
  for (const [sortOrder, [name, skills]] of Object.entries(
    skillGroups,
  ).entries()) {
    const group = await prisma.skillGroup.create({ data: { name, sortOrder } });
    await prisma.skill.createMany({
      data: skills.map((name, i) => ({
        name,
        groupId: group.id,
        sortOrder: i,
      })),
    });
  }
}
main().finally(() => prisma.$disconnect());
