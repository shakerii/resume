import { notFound } from "next/navigation";
import { prisma } from "~/server/db";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("admin");
  const p = await prisma.project.findUnique({
    where: { slug, isActive: true },
  });
  if (!p) notFound();
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/fa" className="text-sm text-indigo-600">← {t("back")}</Link>
      <h1 className="mt-8 text-4xl font-bold">{p.title}</h1>
      {p.technologies && (
        <p className="mt-3 text-sm text-indigo-600">{p.technologies}</p>
      )}
      <article
        className="prose prose-slate mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: p.content }}
      />
    </main>
  );
}
