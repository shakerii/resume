import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SkillChart } from "~/components/charts/skill-chart";
import { ExportPdfButton } from "~/components/resume/resume-pdf";
import type { ResumeData } from "~/components/resume/types";
import { SwitchLocales } from "~/components/resume/switch-locales";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import type { Locale } from "~/utils/navigation";

function githubLabel(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export async function ResumeView({ locale, data }: { locale: Locale; data: ResumeData }) {
  const t = await getTranslations("resume");
  const nav = await getTranslations("nav");
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
        <SwitchLocales />
        <ExportPdfButton data={data} />
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${locale}/admin`}>{nav("admin")}</Link>
        </Button>
      </div>
      <header>
        <h1 className="text-4xl font-bold">{data.name}</h1>
        {data.title ? <p className="mt-1 text-lg font-semibold">{data.title}</p> : null}
        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          {data.email ? (
            <p>
              {t("email")}: <a className="text-primary underline" href={`mailto:${data.email}`}>{data.email}</a>
            </p>
          ) : null}
          {data.phone ? (
            <p>
              {t("phone")}: <a className="text-primary underline" href={`tel:${data.phone.replace(/\s/g, "")}`}>{data.phone}</a>
            </p>
          ) : null}
          {data.github ? (
            <p>
              {t("github")}:{" "}
              <a className="text-primary underline" href={data.github}>
                {githubLabel(data.github)}
              </a>
            </p>
          ) : null}
          {data.location ? (
            <p>
              {t("location")}: {data.location}
            </p>
          ) : null}
        </div>
        {data.summary ? <p className="mt-4 italic text-muted-foreground">{data.summary}</p> : null}
      </header>

      <section className="mt-8">
        <h2 className="border-b pb-1 text-xl font-semibold">{t("experience")}</h2>
        <div className="mt-4 space-y-4">
          {data.experiences.map((item) => (
            <article key={item.id}>
              <h3 className="font-semibold">
                {item.company} — {item.role}
              </h3>
              {item.period ? <p className="text-xs text-muted-foreground">{item.period}</p> : null}
              {item.description ? (
                <div className="prose mt-1" dangerouslySetInnerHTML={{ __html: item.description }} />
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="border-b pb-1 text-xl font-semibold">{t("projects")}</h2>
        <div className="mt-4 space-y-4">
          {data.projects.map((project) => (
            <article key={project.id}>
              <h3 className="font-semibold">
                <Link className="text-primary underline" href={`/${locale}/projects/${project.slug}`}>
                  {project.title}
                </Link>
              </h3>
              {project.excerpt ? <p className="mt-1 text-sm">{project.excerpt}</p> : null}
              {project.technologies.length ? (
                <p className="mt-2 text-sm">
                  <span className="font-semibold">{t("tech")}: </span>
                  {project.technologies.map((name) => (
                    <Badge key={name} className="me-1 mt-1">
                      {name}
                    </Badge>
                  ))}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="border-b pb-1 text-xl font-semibold">{t("skills")}</h2>
        <ul className="mt-4 columns-1 gap-8 sm:columns-2">
          {data.skillGroups.map((group) => (
            <li key={group.id} className="mb-2 break-inside-avoid text-sm">
              <span className="font-semibold">{group.name}: </span>
              {group.skills.join(", ")}
            </li>
          ))}
        </ul>
        <SkillChart
          title={t("skillChart")}
          groups={data.skillGroups.map((group) => ({ name: group.name, count: group.skills.length }))}
        />
      </section>

      <Separator className="my-8" />

      <section>
        <h2 className="border-b pb-1 text-xl font-semibold">{t("education")}</h2>
        <div className="mt-4 space-y-2">
          {data.education.map((item) => (
            <p key={item.id}>
              <strong>{item.degree}</strong>
              {item.institution ? `, ${item.institution}` : ""}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="border-b pb-1 text-xl font-semibold">{t("languages")}</h2>
        <p className="mt-4 text-sm">
          {data.languages
            .map((item) => (item.level ? `${item.name} (${item.level})` : item.name))
            .join(locale === "fa" ? "، " : ", ")}
        </p>
      </section>
    </main>
  );
}
