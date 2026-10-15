"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { RichTextEditor } from "~/components/editor/rich-text-editor";
import { LocalizedFields } from "~/components/forms/localized-fields";
import { LocalizedRichText } from "~/components/forms/localized-rich-text";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/react";
import { emptyText, localize, type LocalizedText } from "~/utils/localized";
import type { Locale } from "~/utils/navigation";

export function ProjectStudio({
  project,
}: {
  project: {
    id: string;
    slug: string;
    active: boolean;
    title: LocalizedText;
    excerpt: LocalizedText;
    content: LocalizedText;
    technologies: LocalizedText[];
  };
}) {
  const t = useTranslations("admin");
  const editorText = useTranslations("editor");
  const resume = useTranslations("resume");
  const locale = useLocale() as Locale;
  const [draftLocale, setDraftLocale] = useState<Locale>(locale);
  const [slug, setSlug] = useState(project.slug);
  const [title, setTitle] = useState(project.title);
  const [excerpt, setExcerpt] = useState(project.excerpt);
  const [content, setContent] = useState(project.content);
  const [active, setActive] = useState(project.active);
  const [technologies, setTechnologies] = useState(project.technologies);
  const [saved, setSaved] = useState(false);
  const update = api.project.update.useMutation({
    onSuccess: () => setSaved(true),
  });

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-6 py-10">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/admin/projects`}>{t("backToAdmin")}</Link>
        </Button>
        <p className="text-sm text-muted-foreground">{editorText("editing")}</p>
      </div>
      <div className="space-y-1">
        <Label htmlFor="project-slug">{t("slug")}</Label>
        <Input id="project-slug" value={slug} onChange={(event) => setSlug(event.target.value)} />
      </div>
      <LocalizedFields label={t("titleField")} value={title} onChange={setTitle} />
      <LocalizedRichText label={t("excerpt")} value={excerpt} onChange={setExcerpt} compact />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">{t("technologies")}</h2>
          <Button type="button" size="sm" variant="outline" onClick={() => setTechnologies((current) => [...current, emptyText()])}>
            {t("addTechnology")}
          </Button>
        </div>
        {technologies.map((technology, index) => (
          <div key={index} className="space-y-2 rounded-md border p-3">
            <LocalizedFields
              label={`${t("name")} ${index + 1}`}
              value={technology}
              onChange={(next) =>
                setTechnologies((current) => current.map((item, itemIndex) => (itemIndex === index ? next : item)))
              }
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setTechnologies((current) => current.filter((_, itemIndex) => itemIndex !== index))}
            >
              {t("delete")}
            </Button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={active} onCheckedChange={setActive} id="project-active" />
        <Label htmlFor="project-active">{t("active")}</Label>
      </div>
      <Tabs value={draftLocale} onValueChange={(value) => setDraftLocale(value as Locale)}>
        <TabsList>
          <TabsTrigger value="en">{t("english")}</TabsTrigger>
          <TabsTrigger value="fa">{t("persian")}</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="space-y-2">
        <h2 className="text-sm font-medium">{t("description")}</h2>
        <RichTextEditor
          dir={draftLocale === "fa" ? "rtl" : "ltr"}
          value={content[draftLocale]}
          onChange={(html) => setContent((current) => ({ ...current, [draftLocale]: html }))}
        />
      </div>
      <article className="prose rounded-md border bg-background p-4">
        <h1>{localize(title, draftLocale)}</h1>
        <div dangerouslySetInnerHTML={{ __html: localize(excerpt, draftLocale) }} />
        <p>
          <strong>{resume("tech")}: </strong>
          {technologies.map((item, index) => (
            <Badge key={index} className="me-1">
              {localize(item, draftLocale)}
            </Badge>
          ))}
        </p>
        <div dangerouslySetInnerHTML={{ __html: content[draftLocale] || "" }} />
      </article>
      {update.error ? <p className="text-sm text-destructive">{update.error.message}</p> : null}
      {saved ? <p className="text-sm text-muted-foreground">{t("saved")}</p> : null}
      <Button
        type="button"
        disabled={update.isPending}
        onClick={() => {
          setSaved(false);
          update.mutate({
            id: project.id,
            slug,
            title,
            excerpt,
            content,
            active,
            technologies: technologies.map((name, sortOrder) => ({ name, sortOrder })),
          });
        }}
      >
        {update.isPending ? t("saving") : t("save")}
      </Button>
    </main>
  );
}
