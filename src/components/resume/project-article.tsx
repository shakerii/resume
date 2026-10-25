import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ResumeControls } from "~/components/resume/resume-shell";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { plainText } from "~/utils/html";
import type { Locale } from "~/utils/navigation";

export async function ProjectArticle({
  locale,
  title,
  excerpt,
  content,
  technologies,
}: {
  locale: Locale;
  title: string;
  excerpt: string;
  content: string;
  technologies: string[];
}) {
  const admin = await getTranslations("admin");
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}`}>{admin("back")}</Link>
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <ResumeControls locale={locale} showAdmin={false} />
        </div>
      </div>
      <h1 className="mt-6 text-4xl font-bold">{title}</h1>
      {plainText(excerpt) ? (
        <div
          className="prose mt-3 text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
      ) : null}
      {technologies.length ? (
        <p className="mt-4">
          {technologies.map((name) => (
            <Badge key={name} className="me-1">
              {name}
            </Badge>
          ))}
        </p>
      ) : null}
      <article
        className="prose mt-8"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </main>
  );
}
