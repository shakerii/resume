"use client";

import { useTranslations } from "next-intl";
import { Button } from "~/components/ui/button";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("errors");
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("body")}</p>
      <Button type="button" className="mt-4" onClick={reset}>
        {t("retry")}
      </Button>
    </main>
  );
}
