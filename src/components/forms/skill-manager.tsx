"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LocalizedFields } from "~/components/forms/localized-fields";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { api, browserQuery } from "~/trpc/react";
import { asLocalized, emptyText, localize, type LocalizedText } from "~/utils/localized";
import type { Locale } from "~/utils/navigation";

export function SkillManager() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const utils = api.useUtils();
  const groups = api.skillGroup.all.useQuery(undefined, browserQuery);
  const refresh = async () => {
    await utils.skillGroup.all.invalidate();
    await utils.skill.all.invalidate();
  };
  const createGroup = api.skillGroup.create.useMutation({ onSuccess: refresh });
  const updateGroup = api.skillGroup.update.useMutation({ onSuccess: refresh });
  const deleteGroup = api.skillGroup.delete.useMutation({ onSuccess: refresh });
  const createSkill = api.skill.create.useMutation({ onSuccess: refresh });
  const updateSkill = api.skill.update.useMutation({ onSuccess: refresh });
  const deleteSkill = api.skill.delete.useMutation({ onSuccess: refresh });
  const toggleSkill = api.skill.toggle.useMutation({ onSuccess: refresh });
  const [groupName, setGroupName] = useState<LocalizedText>(emptyText());
  const [skillName, setSkillName] = useState<LocalizedText>(emptyText());
  const [groupId, setGroupId] = useState("");
  const [editingGroup, setEditingGroup] = useState<{ id: string; name: LocalizedText } | null>(null);
  const [editingSkill, setEditingSkill] = useState<{ id: string; name: LocalizedText } | null>(null);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">{t("skills")}</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("newGroup")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LocalizedFields label={t("group")} value={groupName} onChange={setGroupName} />
            <Button
              type="button"
              onClick={() =>
                createGroup.mutate(
                  { name: groupName, sortOrder: groups.data?.length ?? 0 },
                  { onSuccess: () => setGroupName(emptyText()) },
                )
              }
            >
              {t("create")}
            </Button>
          </CardContent>
        </Card>
        <div className="space-y-3">
          {(groups.data ?? []).map((group) => (
            <Card key={group.id}>
              <CardHeader className="p-4">
                <CardTitle className="text-base">{localize(group.name, locale)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0">
                {editingGroup?.id === group.id ? (
                  <div className="space-y-3">
                    <LocalizedFields label={t("group")} value={editingGroup.name} onChange={(name) => setEditingGroup({ id: group.id, name })} />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        updateGroup.mutate(
                          { id: group.id, name: editingGroup.name },
                          { onSuccess: () => setEditingGroup(null) },
                        )
                      }
                    >
                      {t("save")}
                    </Button>
                  </div>
                ) : null}
                <ul className="space-y-3">
                  {group.skills.map((skill) => (
                    <li key={skill.id} className="space-y-2 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span>
                          {localize(skill.name, locale)}
                          {skill.active ? "" : ` (${t("inactive")})`}
                        </span>
                        <span className="flex gap-2">
                          <Button type="button" size="sm" variant="outline" onClick={() => toggleSkill.mutate({ id: skill.id })}>
                            {skill.active ? t("deactivate") : t("activate")}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingSkill({ id: skill.id, name: asLocalized(skill.name) })}
                          >
                            {t("edit")}
                          </Button>
                          <Button type="button" size="sm" variant="destructive" onClick={() => deleteSkill.mutate({ id: skill.id })}>
                            {t("delete")}
                          </Button>
                        </span>
                      </div>
                      {editingSkill?.id === skill.id ? (
                        <div className="space-y-2">
                          <LocalizedFields
                            label={t("name")}
                            value={editingSkill.name}
                            onChange={(name) => setEditingSkill({ id: skill.id, name })}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() =>
                              updateSkill.mutate(
                                { id: skill.id, name: editingSkill.name },
                                { onSuccess: () => setEditingSkill(null) },
                              )
                            }
                          >
                            {t("save")}
                          </Button>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <Button type="button" size="sm" variant="outline" onClick={() => setEditingGroup({ id: group.id, name: asLocalized(group.name) })}>
                  {t("rename")}
                </Button>
                <Button type="button" size="sm" variant="destructive" onClick={() => deleteGroup.mutate({ id: group.id })}>
                  {t("deleteGroup")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("newSkill")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="skill-group">{t("group")}</Label>
            <select
              id="skill-group"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={groupId}
              onChange={(event) => setGroupId(event.target.value)}
            >
              <option value="">{t("chooseGroup")}</option>
              {(groups.data ?? []).map((group) => (
                <option key={group.id} value={group.id}>
                  {localize(group.name, locale)}
                </option>
              ))}
            </select>
          </div>
          <LocalizedFields label={t("name")} value={skillName} onChange={setSkillName} />
          <Button
            type="button"
            disabled={!groupId}
            onClick={() =>
              createSkill.mutate(
                {
                  name: skillName,
                  groupId,
                  sortOrder: (groups.data ?? []).find((group) => group.id === groupId)?.skills.length ?? 0,
                },
                { onSuccess: () => setSkillName(emptyText()) },
              )
            }
          >
            {t("create")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
