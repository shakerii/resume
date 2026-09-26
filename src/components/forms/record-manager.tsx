"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LocalizedFields } from "~/components/forms/localized-fields";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { asLocalized, emptyText, type LocalizedText } from "~/utils/localized";

export type FieldConfig = {
  name: string;
  label: string;
  kind: "localized" | "text" | "number";
  multiline?: boolean;
};

export type ManagedRecord = {
  id: string;
  sortOrder: number;
  active: boolean;
} & Record<string, unknown>;

type Values = Record<string, LocalizedText | string | number>;

function blank(fields: FieldConfig[]): Values {
  const values: Values = {};
  for (const field of fields) {
    values[field.name] =
      field.kind === "localized" ? emptyText() : field.kind === "number" ? 0 : "";
  }
  return values;
}

function fromRecord(fields: FieldConfig[], record: ManagedRecord): Values {
  const values: Values = {};
  for (const field of fields) {
    const current = record[field.name];
    if (field.kind === "localized") values[field.name] = asLocalized(current);
    else if (field.kind === "number") values[field.name] = typeof current === "number" ? current : 0;
    else values[field.name] = typeof current === "string" ? current : "";
  }
  return values;
}

export function RecordManager({
  title,
  description,
  items,
  fields,
  labelOf,
  detailOf,
  onCreate,
  onUpdate,
  onDelete,
  onToggle,
  onReorder,
}: {
  title: string;
  description?: string;
  items: ManagedRecord[];
  fields: FieldConfig[];
  labelOf: (item: ManagedRecord) => string;
  detailOf?: (item: ManagedRecord) => string;
  onCreate: (values: Record<string, unknown>) => Promise<unknown>;
  onUpdate: (id: string, values: Record<string, unknown>) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
  onToggle: (id: string) => Promise<unknown>;
  onReorder: (id: string, sortOrder: number) => Promise<unknown>;
}) {
  const t = useTranslations("admin");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ManagedRecord | null>(null);
  const [values, setValues] = useState<Values>({});
  const [active, setActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function startCreate() {
    setEditing(null);
    setValues(blank(fields));
    setActive(true);
    setError(null);
    setOpen(true);
  }

  function startEdit(item: ManagedRecord) {
    setEditing(item);
    setValues(fromRecord(fields, item));
    setActive(item.active);
    setError(null);
    setOpen(true);
  }

  async function save() {
    setPending(true);
    setError(null);
    try {
      const payload = { ...values, active };
      if (editing) await onUpdate(editing.id, payload);
      else await onCreate({ ...payload, sortOrder: items.length });
      setOpen(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("saveFailed"));
    } finally {
      setPending(false);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const next = items[index + direction];
    const current = items[index];
    if (!next || !current) return;
    await Promise.all([
      onReorder(current.id, next.sortOrder),
      onReorder(next.id, current.sortOrder),
    ]);
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <Button type="button" onClick={startCreate}>
          {t("create")}
        </Button>
      </div>
      {items.length === 0 ? <p className="text-sm text-muted-foreground">{t("empty")}</p> : null}
      <div className="space-y-3">
        {items.map((item, index) => (
          <Card key={item.id}>
            <CardHeader className="flex-row items-start justify-between space-y-0 p-4">
              <div>
                <CardTitle className="text-base">{labelOf(item) || t("untitled")}</CardTitle>
                {detailOf ? <p className="mt-1 text-sm text-muted-foreground">{detailOf(item)}</p> : null}
              </div>
              <span className="text-xs text-muted-foreground">{item.active ? t("active") : t("inactive")}</span>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 p-4 pt-0">
              <Button type="button" size="sm" variant="outline" onClick={() => startEdit(item)}>
                {t("edit")}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => onToggle(item.id)}>
                {item.active ? t("deactivate") : t("activate")}
              </Button>
              <Button type="button" size="sm" variant="outline" disabled={index === 0} onClick={() => move(index, -1)}>
                {t("up")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={index === items.length - 1}
                onClick={() => move(index, 1)}
              >
                {t("down")}
              </Button>
              <Button type="button" size="sm" variant="destructive" onClick={() => onDelete(item.id)}>
                {t("delete")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t("edit") : t("create")}</DialogTitle>
            <DialogDescription>{title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {fields.map((field) => {
              const current = values[field.name];
              if (field.kind === "localized") {
                return (
                  <LocalizedFields
                    key={field.name}
                    label={field.label}
                    multiline={field.multiline}
                    value={(current as LocalizedText) ?? emptyText()}
                    onChange={(next) => setValues((prev) => ({ ...prev, [field.name]: next }))}
                  />
                );
              }
              return (
                <div key={field.name} className="space-y-1">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    type={field.kind === "number" ? "number" : "text"}
                    value={String(current ?? "")}
                    onChange={(event) =>
                      setValues((prev) => ({
                        ...prev,
                        [field.name]: field.kind === "number" ? Number(event.target.value) : event.target.value,
                      }))
                    }
                  />
                </div>
              );
            })}
            <div className="flex items-center gap-3">
              <Switch checked={active} onCheckedChange={setActive} id="record-active" />
              <Label htmlFor="record-active">{t("active")}</Label>
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="button" onClick={save} disabled={pending}>
              {pending ? t("saving") : t("save")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
