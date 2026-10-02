"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import type { ResumeData } from "~/components/resume/types";

export function ExportPdfButton({
  data,
  variant = "classic",
}: {
  data: ResumeData;
  variant?: "classic" | "future";
}) {
  const t = useTranslations("resume");
  const [busy, setBusy] = useState(false);
  async function handleExport() {
    setBusy(true);
    try {
      const [{ pdf }, { ResumeDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("~/components/resume/resume-document"),
      ]);
      const blob = await pdf(
        <ResumeDocument
          data={data}
          labels={{
            experience: t("experience"),
            projects: t("projects"),
            skills: t("skills"),
            education: t("education"),
            languages: t("languages"),
            tech: t("tech"),
          }}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${data.name || "resume"}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }
  if (variant === "future") {
    return (
      <button
        type="button"
        onClick={handleExport}
        disabled={busy}
        className="flex h-8 items-center rounded-md border border-lime-400/40 bg-lime-950/40 px-3 font-mono text-xs uppercase tracking-widest text-lime-300 transition hover:border-lime-300 hover:shadow-[0_0_14px_rgba(163,230,53,0.4)] disabled:pointer-events-none disabled:opacity-50"
      >
        {busy ? t("pdfPreparing") : t("pdf")}
      </button>
    );
  }
  return (
    <Button type="button" variant="outline" size="sm" onClick={handleExport} disabled={busy}>
      {busy ? t("pdfPreparing") : t("pdf")}
    </Button>
  );
}
