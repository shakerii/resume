import { ExportPdfButton } from "./resume-pdf";
import { SwitchLocales } from "~/app/[locale]/_components/switch-locales";
import { prisma } from "~/server/db";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function ResumePage() {
  const t = await getTranslations("resume");
  const [items, projects] = await Promise.all([
    prisma.resumeItem.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.project.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } }),
  ]);
  const basic = items.filter((i) => i.type === "basic");
  const name = basic.find((i) => i.title.toLowerCase() === "name")?.description ?? "Resume";
  const role = basic.find((i) => i.title.toLowerCase() === "role")?.description ?? t("eyebrow");
  const summary = basic.find((i) => i.title.toLowerCase() === "summary")?.description ?? t("summary");
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between gap-4"><div><h1 className="text-4xl font-bold">{name}</h1><p className="text-lg text-indigo-600">{role}</p></div><div className="flex gap-2"><SwitchLocales /><ExportPdfButton /></div></div>
      <p className="mb-8 text-slate-600">{summary}</p>
      {["experience", "education", "skills", "languages"].map((type) => { const section = items.filter((i) => i.type === type); if (!section.length) return null; return <section key={type} className="mb-8"><h2 className="mb-3 border-b pb-2 text-xl font-semibold">{t(type as never)}</h2><div className="space-y-2">{section.map((item) => <div key={item.id}><p className="font-medium">{item.title}{item.subtitle ? ` — ${item.subtitle}` : ""}</p>{item.period && <p className="text-sm text-slate-500">{item.period}</p>}{item.description && <p className="text-slate-600">{item.description}</p>}</div>)}</div></section>; })}
      <section className="mb-8"><h2 className="mb-3 border-b pb-2 text-xl font-semibold">{t("projects")}</h2><div className="space-y-2">{projects.map((p) => <p key={p.id}><Link className="font-semibold text-indigo-600" href={`/fa/projects/${p.slug}`}>{p.title}</Link>{p.excerpt ? `: ${p.excerpt}` : ""}</p>)}</div></section>
    </main>
  );
}
