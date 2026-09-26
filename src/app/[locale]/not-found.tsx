"use client";

import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const t = useTranslations("notFound");
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("body")}</p>
    </main>
  );
}
