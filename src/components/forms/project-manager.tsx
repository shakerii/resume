"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { LocalizedFields } from "~/components/forms/localized-fields";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api, browserQuery } from "~/trpc/react";
import { emptyText, localize, type LocalizedText } from "~/utils/localized";
import type { Locale } from "~/utils/navigation";

export function ProjectManager() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const utils = api.useUtils();
  const list = api.project.all.useQuery(undefined, browserQuery);
  const refresh = () => utils.project.all.invalidate();
  const create = api.project.create.useMutation({ onSuccess: refresh });
  const remove = api.project.delete.useMutation({ onSuccess: refresh });
  const toggle = api.project.toggle.useMutation({ onSuccess: refresh });
  const reorder = api.project.reorder.useMutation({ onSuccess: refresh });
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState<LocalizedText>(emptyText());
  const [excerpt, setExcerpt] = useState<LocalizedText>(emptyText());
  const [error, setError] = useState<string | null>(null);
  const items = (list.data ?? []) as unknown as Array<{
    id: string;
    slug: string;
    active: boolean;
    sortOrder: number;
    title: unknown;
    excerpt: unknown;
  }>;

  async function move(index: number, direction: -1 | 1) {
    const next = items[index + direction];
    const current = items[index];
    if (!next || !current) return;
    await reorder.mutateAsync({ id: current.id, sortOrder: next.sortOrder });
    await reorder.mutateAsync({ id: next.id, sortOrder: current.sortOrder });
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("projects")}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("newProject")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="slug">{t("slug")}</Label>
            <Input id="slug" value={slug} onChange={(event) => setSlug(event.target.value)} />
          </div>
          <LocalizedFields label={t("titleField")} value={title} onChange={setTitle} />
          <LocalizedFields label={t("excerpt")} value={excerpt} onChange={setExcerpt} multiline />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button
            type="button"
            onClick={() => {
              setError(null);
              create.mutate(
                {
                  slug,
                  title,
                  excerpt,
                  content: emptyText(),
                  sortOrder: items.length,
                },
                {
                  onSuccess: () => {
                    setSlug("");
                    setTitle(emptyText());
                    setExcerpt(emptyText());
                  },
                  onError: (caught) => setError(caught.message),
                },
              );
            }}
          >
            {t("create")}
          </Button>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {items.map((project, index) => (
          <Card key={project.id}>
            <CardHeader className="p-4">
              <CardTitle className="text-base">{localize(project.title, locale)}</CardTitle>
              <p className="text-sm text-muted-foreground">{localize(project.excerpt, locale)}</p>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 p-4 pt-0">
              <Button type="button" size="sm" asChild>
                <Link href={`/${locale}/projects/${project.slug}`}>{t("editPage")}</Link>
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => toggle.mutate({ id: project.id })}>
                {project.active ? t("deactivate") : t("activate")}
              </Button>
              <Button type="button" size="sm" variant="outline" disabled={index === 0} onClick={() => move(index, -1)}>
                {t("up")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={index === items.length - 1}
                onClick={() => move(index, 1)}
              >
                {t("down")}
              </Button>
              <Button type="button" size="sm" variant="destructive" onClick={() => remove.mutate({ id: project.id })}>
                {t("delete")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
