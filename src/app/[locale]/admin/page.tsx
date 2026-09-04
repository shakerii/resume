import Link from "next/link";
import { prisma } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [items, projects] = await Promise.all([
    prisma.resumeItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.project.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resume Admin</h1>
          <p className="text-slate-500">
            Manage active resume items and project pages.
          </p>
        </div>
        <Link href="/fa" className="rounded-lg border px-4 py-2">
          View resume
        </Link>
      </div>
      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Resume items</h2>
        <div className="space-y-2">
          {items.map((i) => (
            <form
              key={i.id}
              action="/api/admin/toggle"
              method="post"
              className="flex items-center justify-between rounded-xl border bg-white p-4"
            >
              <input type="hidden" name="kind" value="item" />
              <input type="hidden" name="id" value={i.id} />
              <span>{i.title}</span>
              <button
                className={`rounded-full px-3 py-1 text-sm ${i.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
              >
                {i.active ? "Active" : "Inactive"}
              </button>
            </form>
          ))}
        </div>
      </section>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Projects</h2>
          <Link
            href="/fa/projects/new"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
          >
            New project
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <div key={p.id} className="rounded-xl border bg-white p-5">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{p.title}</h3>
                <span className="text-xs text-slate-500">
                  {p.active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-500">{p.excerpt}</p>
              <Link
                className="mt-4 inline-block text-indigo-600"
                href={`/fa/projects/${p.slug}`}
              >
                Open page →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
