"use client";

import { useTranslations } from "next-intl";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import type { LocalizedText } from "~/utils/localized";

export function LocalizedFields({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: LocalizedText;
  onChange: (value: LocalizedText) => void;
  multiline?: boolean;
}) {
  const t = useTranslations("admin");
  const Control = multiline ? Textarea : Input;
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{label}</legend>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">{t("english")}</Label>
          <Control value={value.en} onChange={(event) => onChange({ ...value, en: event.target.value })} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">{t("persian")}</Label>
          <Control
            dir="rtl"
            value={value.fa}
            onChange={(event) => onChange({ ...value, fa: event.target.value })}
          />
        </div>
      </div>
    </fieldset>
  );
}
