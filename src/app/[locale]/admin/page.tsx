"use client";

import { useTranslations } from "next-intl";
import { ContentChart } from "~/components/charts/content-chart";
import { api, browserQuery } from "~/trpc/react";

export default function AdminHomePage() {
  const t = useTranslations("admin");
  const info = api.basicInfo.all.useQuery(undefined, browserQuery);
  const experiences = api.experience.all.useQuery(undefined, browserQuery);
  const projects = api.project.all.useQuery(undefined, browserQuery);
  const skills = api.skill.all.useQuery(undefined, browserQuery);
  const education = api.education.all.useQuery(undefined, browserQuery);
  const languages = api.language.all.useQuery(undefined, browserQuery);
  const contacts = api.contact.count.useQuery(undefined, browserQuery);
  return (
    <ContentChart
      title={t("overview")}
      items={[
        { label: t("basicInfo"), value: info.data?.length ?? 0 },
        { label: t("experiences"), value: experiences.data?.length ?? 0 },
        { label: t("projects"), value: projects.data?.length ?? 0 },
        { label: t("skills"), value: skills.data?.length ?? 0 },
        { label: t("education"), value: education.data?.length ?? 0 },
        { label: t("languages"), value: languages.data?.length ?? 0 },
        { label: t("contacts"), value: contacts.data ?? 0 },
      ]}
    />
  );
}
