import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
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
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/${locale}`}>{admin("back")}</Link>
      </Button>
      <h1 className="mt-6 text-4xl font-bold">{title}</h1>
      {excerpt ? <p className="mt-3 text-muted-foreground">{excerpt}</p> : null}
      {technologies.length ? (
        <p className="mt-4">
          {technologies.map((name) => (
            <Badge key={name} className="me-1">
              {name}
            </Badge>
          ))}
        </p>
      ) : null}
      <article className="prose mt-8" dangerouslySetInnerHTML={{ __html: content }} />
    </main>
  );
}
