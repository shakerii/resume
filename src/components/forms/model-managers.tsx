"use client";

import { useLocale, useTranslations } from "next-intl";
import { RecordManager, type ManagedRecord } from "~/components/forms/record-manager";
import { api, browserQuery } from "~/trpc/react";
import { BASIC_INFO_KEYS, type BasicInfoKey } from "~/utils/basic-info";
import { localize } from "~/utils/localized";
import type { Locale } from "~/utils/navigation";

function useRefresh(invalidate: () => Promise<void>) {
  return { onSuccess: () => invalidate() };
}

export function BasicInfoManager() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const utils = api.useUtils();
  const list = api.basicInfo.all.useQuery(undefined, browserQuery);
  const refresh = useRefresh(() => utils.basicInfo.all.invalidate());
  const create = api.basicInfo.create.useMutation(refresh);
  const update = api.basicInfo.update.useMutation(refresh);
  const remove = api.basicInfo.delete.useMutation(refresh);
  const toggle = api.basicInfo.toggle.useMutation(refresh);
  const reorder = api.basicInfo.reorder.useMutation(refresh);
  return (
    <RecordManager
      title={t("basicInfo")}
      description={t("basicInfoHelp")}
      items={(list.data ?? []) as unknown as ManagedRecord[]}
      fields={[
        {
          name: "key",
          label: t("key"),
          kind: "select",
          unique: true,
          options: BASIC_INFO_KEYS.map((key) => ({ value: key, label: t(`keys.${key}`) })),
        },
        { name: "value", label: t("value"), kind: "localized", multiline: true },
      ]}
      labelOf={(item) => {
        const key = String(item.key ?? "");
        return (BASIC_INFO_KEYS as readonly string[]).includes(key)
          ? t(`keys.${key as BasicInfoKey}`)
          : key;
      }}
      detailOf={(item) => localize(item.value, locale)}
      onCreate={(values) => create.mutateAsync(values as never)}
      onUpdate={(id, values) => update.mutateAsync({ id, ...values } as never)}
      onDelete={(id) => remove.mutateAsync({ id })}
      onToggle={(id) => toggle.mutateAsync({ id })}
      onReorder={(id, sortOrder) => reorder.mutateAsync({ id, sortOrder })}
    />
  );
}

export function ExperienceManager() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const utils = api.useUtils();
  const list = api.experience.all.useQuery(undefined, browserQuery);
  const refresh = useRefresh(() => utils.experience.all.invalidate());
  const create = api.experience.create.useMutation(refresh);
  const update = api.experience.update.useMutation(refresh);
  const remove = api.experience.delete.useMutation(refresh);
  const toggle = api.experience.toggle.useMutation(refresh);
  const reorder = api.experience.reorder.useMutation(refresh);
  return (
    <RecordManager
      title={t("experiences")}
      items={(list.data ?? []) as unknown as ManagedRecord[]}
      fields={[
        { name: "company", label: t("company"), kind: "localized" },
        { name: "role", label: t("role"), kind: "localized" },
        { name: "period", label: t("period"), kind: "localized" },
        { name: "description", label: t("description"), kind: "localized", rich: true },
      ]}
      labelOf={(item) => `${localize(item.company, locale)} - ${localize(item.role, locale)}`}
      detailOf={(item) => localize(item.period, locale)}
      onCreate={(values) => create.mutateAsync(values as never)}
      onUpdate={(id, values) => update.mutateAsync({ id, ...values } as never)}
      onDelete={(id) => remove.mutateAsync({ id })}
      onToggle={(id) => toggle.mutateAsync({ id })}
      onReorder={(id, sortOrder) => reorder.mutateAsync({ id, sortOrder })}
    />
  );
}

export function EducationManager() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const utils = api.useUtils();
  const list = api.education.all.useQuery(undefined, browserQuery);
  const refresh = useRefresh(() => utils.education.all.invalidate());
  const create = api.education.create.useMutation(refresh);
  const update = api.education.update.useMutation(refresh);
  const remove = api.education.delete.useMutation(refresh);
  const toggle = api.education.toggle.useMutation(refresh);
  const reorder = api.education.reorder.useMutation(refresh);
  return (
    <RecordManager
      title={t("education")}
      items={(list.data ?? []) as unknown as ManagedRecord[]}
      fields={[
        { name: "degree", label: t("degree"), kind: "localized" },
        { name: "institution", label: t("institution"), kind: "localized" },
        { name: "period", label: t("period"), kind: "localized" },
        { name: "description", label: t("description"), kind: "localized", rich: true },
      ]}
      labelOf={(item) => localize(item.degree, locale)}
      detailOf={(item) => localize(item.institution, locale)}
      onCreate={(values) => create.mutateAsync(values as never)}
      onUpdate={(id, values) => update.mutateAsync({ id, ...values } as never)}
      onDelete={(id) => remove.mutateAsync({ id })}
      onToggle={(id) => toggle.mutateAsync({ id })}
      onReorder={(id, sortOrder) => reorder.mutateAsync({ id, sortOrder })}
    />
  );
}

export function LanguageManager() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const utils = api.useUtils();
  const list = api.language.all.useQuery(undefined, browserQuery);
  const refresh = useRefresh(() => utils.language.all.invalidate());
  const create = api.language.create.useMutation(refresh);
  const update = api.language.update.useMutation(refresh);
  const remove = api.language.delete.useMutation(refresh);
  const toggle = api.language.toggle.useMutation(refresh);
  const reorder = api.language.reorder.useMutation(refresh);
  return (
    <RecordManager
      title={t("languages")}
      items={(list.data ?? []) as unknown as ManagedRecord[]}
      fields={[
        { name: "name", label: t("name"), kind: "localized" },
        { name: "level", label: t("level"), kind: "localized" },
      ]}
      labelOf={(item) => localize(item.name, locale)}
      detailOf={(item) => localize(item.level, locale)}
      onCreate={(values) => create.mutateAsync(values as never)}
      onUpdate={(id, values) => update.mutateAsync({ id, ...values } as never)}
      onDelete={(id) => remove.mutateAsync({ id })}
      onToggle={(id) => toggle.mutateAsync({ id })}
      onReorder={(id, sortOrder) => reorder.mutateAsync({ id, sortOrder })}
    />
  );
}
