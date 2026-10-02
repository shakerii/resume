"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LocalizedFields } from "~/components/forms/localized-fields";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api, browserQuery } from "~/trpc/react";
import { asLocalized, emptyText, localize, type LocalizedText } from "~/utils/localized";
import type { Locale } from "~/utils/navigation";

type GroupDraft = {
  id: string | null;
  name: LocalizedText;
};

type SkillDraft = {
  id: string | null;
  originalGroupId: string | null;
  groupId: string;
  name: LocalizedText;
  rating: number;
};

type SkillItem = {
  id: string;
  name: unknown;
  rating: number;
  sortOrder: number;
  active: boolean;
};

type GroupItem = {
  id: string;
  name: unknown;
  sortOrder: number;
  skills: SkillItem[];
};

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
  const reorderGroup = api.skillGroup.reorder.useMutation({
    onSuccess: refresh,
  });
  const createSkill = api.skill.create.useMutation({ onSuccess: refresh });
  const updateSkill = api.skill.update.useMutation({ onSuccess: refresh });
  const deleteSkill = api.skill.delete.useMutation({ onSuccess: refresh });
  const toggleSkill = api.skill.toggle.useMutation({ onSuccess: refresh });
  const reorderSkill = api.skill.reorder.useMutation({ onSuccess: refresh });
  const [groupOpen, setGroupOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [groupDraft, setGroupDraft] = useState<GroupDraft>({
    id: null,
    name: emptyText(),
  });
  const [skillDraft, setSkillDraft] = useState<SkillDraft>({
    id: null,
    originalGroupId: null,
    groupId: "",
    name: emptyText(),
    rating: 5,
  });
  const [error, setError] = useState<string | null>(null);

  const items = (groups.data ?? []) as unknown as GroupItem[];
  const pending = createGroup.isPending || updateGroup.isPending || createSkill.isPending || updateSkill.isPending;

  function startCreateGroup() {
    setGroupDraft({ id: null, name: emptyText() });
    setError(null);
    setGroupOpen(true);
  }

  function startEditGroup(group: GroupItem) {
    setGroupDraft({ id: group.id, name: asLocalized(group.name) });
    setError(null);
    setGroupOpen(true);
  }

  function startCreateSkill(groupId = "") {
    setSkillDraft({
      id: null,
      originalGroupId: null,
      groupId,
      name: emptyText(),
      rating: 5,
    });
    setError(null);
    setSkillOpen(true);
  }

  function startEditSkill(groupId: string, skill: SkillItem) {
    setSkillDraft({
      id: skill.id,
      originalGroupId: groupId,
      groupId,
      name: asLocalized(skill.name),
      rating: skill.rating,
    });
    setError(null);
    setSkillOpen(true);
  }

  async function saveGroup() {
    setError(null);
    try {
      if (groupDraft.id) {
        await updateGroup.mutateAsync({
          id: groupDraft.id,
          name: groupDraft.name,
        });
      } else {
        await createGroup.mutateAsync({
          name: groupDraft.name,
          sortOrder: items.length,
        });
      }
      setGroupOpen(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("saveFailed"));
    }
  }

  async function saveSkill() {
    if (!skillDraft.groupId) return;
    setError(null);
    try {
      if (skillDraft.id) {
        const targetGroup = items.find((group) => group.id === skillDraft.groupId);
        await updateSkill.mutateAsync({
          id: skillDraft.id,
          name: skillDraft.name,
          groupId: skillDraft.groupId,
          rating: skillDraft.rating,
          ...(skillDraft.groupId !== skillDraft.originalGroupId ? { sortOrder: targetGroup?.skills.length ?? 0 } : {}),
        });
      } else {
        const targetGroup = items.find((group) => group.id === skillDraft.groupId);
        await createSkill.mutateAsync({
          name: skillDraft.name,
          groupId: skillDraft.groupId,
          rating: skillDraft.rating,
          sortOrder: targetGroup?.skills.length ?? 0,
        });
      }
      setSkillOpen(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("saveFailed"));
    }
  }

  async function moveGroup(index: number, direction: -1 | 1) {
    const current = items[index];
    const next = items[index + direction];
    if (!current || !next) return;
    await reorderGroup.mutateAsync({
      id: current.id,
      sortOrder: next.sortOrder,
    });
    await reorderGroup.mutateAsync({
      id: next.id,
      sortOrder: current.sortOrder,
    });
  }

  async function moveSkill(group: GroupItem, index: number, direction: -1 | 1) {
    const current = group.skills[index];
    const next = group.skills[index + direction];
    if (!current || !next) return;
    await reorderSkill.mutateAsync({
      id: current.id,
      sortOrder: next.sortOrder,
    });
    await reorderSkill.mutateAsync({
      id: next.id,
      sortOrder: current.sortOrder,
    });
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{t("skills")}</h1>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={startCreateGroup}>
            {t("newGroup")}
          </Button>
          <Button type="button" onClick={() => startCreateSkill()} disabled={items.length === 0}>
            {t("newSkill")}
          </Button>
        </div>
      </div>

      {items.length === 0 ? <p className="text-sm text-muted-foreground">{t("empty")}</p> : null}
      <div className="space-y-3">
        {items.map((group, groupIndex) => (
          <Card key={group.id}>
            <CardHeader className="flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-base">{localize(group.name, locale)}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => startCreateSkill(group.id)}>
                  {t("newSkill")}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => startEditGroup(group)}>
                  {t("rename")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={groupIndex === 0}
                  onClick={() => moveGroup(groupIndex, -1)}
                >
                  {t("up")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={groupIndex === items.length - 1}
                  onClick={() => moveGroup(groupIndex, 1)}
                >
                  {t("down")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteGroup.mutate({ id: group.id })}
                >
                  {t("deleteGroup")}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {group.skills.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("empty")}</p>
              ) : (
                <ul className="space-y-2">
                  {group.skills.map((skill, skillIndex) => (
                    <li
                      key={skill.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3 text-sm"
                    >
                      <span>
                        {localize(skill.name, locale)} · {skill.rating}/10
                        {skill.active ? "" : ` (${t("inactive")})`}
                      </span>
                      <span className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => toggleSkill.mutate({ id: skill.id })}
                        >
                          {skill.active ? t("deactivate") : t("activate")}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => startEditSkill(group.id, skill)}
                        >
                          {t("edit")}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={skillIndex === 0}
                          onClick={() => moveSkill(group, skillIndex, -1)}
                        >
                          {t("up")}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={skillIndex === group.skills.length - 1}
                          onClick={() => moveSkill(group, skillIndex, 1)}
                        >
                          {t("down")}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteSkill.mutate({ id: skill.id })}
                        >
                          {t("delete")}
                        </Button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={groupOpen} onOpenChange={setGroupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{groupDraft.id ? t("rename") : t("newGroup")}</DialogTitle>
            <DialogDescription>{t("skills")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <LocalizedFields
              label={t("group")}
              value={groupDraft.name}
              onChange={(name) => setGroupDraft((current) => ({ ...current, name }))}
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="button" onClick={saveGroup} disabled={pending}>
              {pending ? t("saving") : t("save")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={skillOpen} onOpenChange={setSkillOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{skillDraft.id ? t("edit") : t("newSkill")}</DialogTitle>
            <DialogDescription>{t("skills")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="skill-group">{t("group")}</Label>
              <select
                id="skill-group"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={skillDraft.groupId}
                onChange={(event) =>
                  setSkillDraft((current) => ({
                    ...current,
                    groupId: event.target.value,
                  }))
                }
              >
                <option value="">{t("chooseGroup")}</option>
                {items.map((group) => (
                  <option key={group.id} value={group.id}>
                    {localize(group.name, locale)}
                  </option>
                ))}
              </select>
            </div>
            <LocalizedFields
              label={t("name")}
              value={skillDraft.name}
              onChange={(name) => setSkillDraft((current) => ({ ...current, name }))}
            />
            <div className="space-y-1">
              <Label htmlFor="skill-rating">{t("rating")}</Label>
              <Input
                id="skill-rating"
                type="number"
                min={0}
                max={10}
                value={skillDraft.rating}
                onChange={(event) =>
                  setSkillDraft((current) => ({
                    ...current,
                    rating: Math.min(10, Math.max(0, Number(event.target.value))),
                  }))
                }
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="button" onClick={saveSkill} disabled={pending || !skillDraft.groupId}>
              {pending ? t("saving") : t("save")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
