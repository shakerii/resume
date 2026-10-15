"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { RichTextEditor } from "~/components/editor/rich-text-editor";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { LocalizedText } from "~/utils/localized";
import type { Locale } from "~/utils/navigation";

export function LocalizedRichText({
  label,
  value,
  onChange,
  compact = false,
}: {
  label: string;
  value: LocalizedText;
  onChange: (value: LocalizedText) => void;
  compact?: boolean;
}) {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const [draft, setDraft] = useState<Locale>(locale);

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{label}</legend>
      <Tabs value={draft} onValueChange={(next) => setDraft(next as Locale)}>
        <TabsList>
          <TabsTrigger value="en">{t("english")}</TabsTrigger>
          <TabsTrigger value="fa">{t("persian")}</TabsTrigger>
        </TabsList>
      </Tabs>
      <RichTextEditor
        key={draft}
        dir={draft === "fa" ? "rtl" : "ltr"}
        compact={compact}
        value={value[draft]}
        onChange={(html) => onChange({ ...value, [draft]: html })}
      />
    </fieldset>
  );
}
