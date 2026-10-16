"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api, browserQuery } from "~/trpc/react";

const statuses = ["pending", "contacted", "ignored", "resolved"] as const;
type ContactStatus = (typeof statuses)[number];
type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  visitorId: string | null;
  sessionId: string | null;
  path: string;
  createdAt: string;
};

function ContactLogs({ id }: { id: string }) {
  const t = useTranslations("contactAdmin");
  const locale = useLocale();
  const logs = api.contact.logs.useQuery({ id }, browserQuery);

  if (logs.isPending) return <p role="status">{t("loading")}</p>;
  if (logs.isError) {
    return (
      <div className="space-y-2">
        <p role="alert" className="text-destructive">
          {t("error")}
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => void logs.refetch()}
        >
          {t("retry")}
        </Button>
      </div>
    );
  }
  if (!logs.data.length) return <p>{t("noLogs")}</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("createdAt")}</TableHead>
          <TableHead>{t("event")}</TableHead>
          <TableHead>{t("path")}</TableHead>
          <TableHead>{t("source")}</TableHead>
          <TableHead>{t("session")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.data.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="whitespace-nowrap">
              {new Date(log.createdAt).toLocaleString(locale)}
            </TableCell>
            <TableCell>
              {log.type}
              {log.target ? ` · ${log.target}` : ""}
            </TableCell>
            <TableCell className="break-all">{log.path}</TableCell>
            <TableCell className="break-all">{log.source}</TableCell>
            <TableCell className="break-all font-mono text-xs">
              {log.sessionId}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ContactRow({ contact }: { contact: Contact }) {
  const t = useTranslations("contactAdmin");
  const locale = useLocale();
  const utils = api.useUtils();
  const [draftStatus, setDraftStatus] = useState<ContactStatus | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const status = draftStatus ?? contact.status;
  const update = api.contact.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.contact.list.invalidate();
      setDraftStatus(null);
    },
  });

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{contact.name}</TableCell>
        <TableCell>
          <a
            className="break-all underline underline-offset-4"
            href={`mailto:${encodeURIComponent(contact.email)}`}
          >
            {contact.email}
          </a>
        </TableCell>
        <TableCell className="min-w-32 break-words">
          {contact.subject}
        </TableCell>
        <TableCell>
          <Select
            value={status}
            disabled={update.isPending}
            onValueChange={(value) => {
              setDraftStatus(value as ContactStatus);
              update.reset();
            }}
          >
            <SelectTrigger
              className="min-w-32"
              aria-label={`${t("status")}: ${contact.name}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((option) => (
                <SelectItem key={option} value={option}>
                  {t(`statuses.${option}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell className="whitespace-nowrap">
          {new Date(contact.createdAt).toLocaleString(locale)}
        </TableCell>
        <TableCell>
          <Button
            type="button"
            size="sm"
            disabled={update.isPending || status === contact.status}
            onClick={() => update.mutate({ id: contact.id, status })}
          >
            {update.isPending ? t("saving") : t("save")}
          </Button>
          {update.isError ? (
            <p role="alert" className="mt-1 text-xs text-destructive">
              {t("updateError")}
            </p>
          ) : null}
          {update.isSuccess ? (
            <p role="status" className="mt-1 text-xs text-muted-foreground">
              {t("updated")}
            </p>
          ) : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} className="space-y-3 bg-muted/20">
          <div>
            <p className="font-medium">{t("message")}</p>
            <p className="mt-1 whitespace-pre-wrap [overflow-wrap:anywhere]">
              {contact.message}
            </p>
          </div>
          <p className="break-all text-xs text-muted-foreground">
            {t("path")}: {contact.path}
          </p>
          {contact.visitorId ? (
            <div className="space-y-3">
              <p className="break-all font-mono text-xs text-muted-foreground">
                {t("visitor")}: {contact.visitorId}
                {contact.sessionId
                  ? ` · ${t("session")}: ${contact.sessionId}`
                  : ""}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-expanded={showLogs}
                aria-controls={`contact-logs-${contact.id}`}
                onClick={() => setShowLogs(!showLogs)}
              >
                {showLogs ? t("hideLogs") : t("viewLogs")}
              </Button>
              {showLogs ? (
                <div id={`contact-logs-${contact.id}`} className="space-y-2">
                  <h2 className="font-medium">{t("logs")}</h2>
                  <ContactLogs id={contact.id} />
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">{t("unlinked")}</p>
          )}
        </TableCell>
      </TableRow>
    </>
  );
}

export function ContactManager() {
  const t = useTranslations("contactAdmin");
  const [status, setStatus] = useState<ContactStatus | "all">("all");
  const [page, setPage] = useState(1);
  const contacts = api.contact.list.useQuery(
    { page, ...(status === "all" ? {} : { status }) },
    browserQuery,
  );

  useEffect(() => {
    if (contacts.data && page > contacts.data.pages) {
      setPage(Math.max(1, contacts.data.pages));
    }
  }, [contacts.data, page]);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <Label htmlFor="contact-status-filter">{t("status")}</Label>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as ContactStatus | "all");
              setPage(1);
            }}
          >
            <SelectTrigger id="contact-status-filter" className="min-w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              {statuses.map((option) => (
                <SelectItem key={option} value={option}>
                  {t(`statuses.${option}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {contacts.data ? (
          <p className="text-sm text-muted-foreground">
            {t("total", { count: contacts.data.total })}
          </p>
        ) : null}
      </div>
      {contacts.isPending ? (
        <p role="status" className="text-sm text-muted-foreground">
          {t("loading")}
        </p>
      ) : null}
      {contacts.isError ? (
        <div className="space-y-2">
          <p role="alert" className="text-sm text-destructive">
            {t("error")}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => void contacts.refetch()}
          >
            {t("retry")}
          </Button>
        </div>
      ) : null}
      {contacts.data ? (
        <>
          {contacts.data.items.length ? (
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("email")}</TableHead>
                    <TableHead>{t("subject")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("createdAt")}</TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.data.items.map((contact) => (
                    <ContactRow key={contact.id} contact={contact} />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1 || contacts.isFetching}
              onClick={() => setPage(page - 1)}
            >
              {t("previous")}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t("page", { page, pages: contacts.data.pages })}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= contacts.data.pages || contacts.isFetching}
              onClick={() => setPage(page + 1)}
            >
              {t("next")}
            </Button>
          </div>
        </>
      ) : null}
    </section>
  );
}
