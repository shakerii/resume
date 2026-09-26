"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import type { ResumeData } from "~/components/resume/types";

export function ExportPdfButton({ data }: { data: ResumeData }) {
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
  return (
    <Button type="button" variant="outline" size="sm" onClick={handleExport} disabled={busy}>
      {busy ? t("pdfPreparing") : t("pdf")}
    </Button>
  );
}
