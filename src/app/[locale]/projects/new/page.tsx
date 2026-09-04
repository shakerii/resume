import { prisma } from "~/server/db";
import { redirect } from "next/navigation";
import { ProjectEditor } from "~/components/project-editor";
import { getTranslations } from "next-intl/server";

export default async function NewProject({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const t = await getTranslations("admin");
  async function create(formData: FormData) { "use server"; const title = String(formData.get("title") || ""); const slug = String(formData.get("slug") || ""); const content = String(formData.get("content") || ""); const technologies = String(formData.get("technologies") || ""); await prisma.project.create({ data: { title, slug, content, technologies, excerpt: content.replace(/<[^>]+>/g, "").slice(0, 160) } }); redirect(`/${locale}/projects/${slug}`); }
  return <main className="mx-auto max-w-3xl px-6 py-12"><h1 className="text-3xl font-bold">{t("newProject")}</h1><form action={create} className="mt-8 space-y-4"><input name="title" required placeholder={t("title")} className="w-full rounded-lg border p-3" /><input name="slug" required placeholder={t("slug")} className="w-full rounded-lg border p-3" /><input name="technologies" placeholder={t("tech")} className="w-full rounded-lg border p-3" /><ProjectEditor /><button className="rounded-lg bg-indigo-600 px-5 py-3 text-white">{t("save")}</button></form></main>;
}
