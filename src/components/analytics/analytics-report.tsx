"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";
import { Download } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  DataTable,
  getColumnAggregate,
  type DataTableLabels,
} from "~/components/data-table";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api, browserQuery } from "~/trpc/react";

type PageRow = {
  path: string;
  views: number;
  visitors: number;
  engagementMs: number;
};
type SourceRow = {
  source: string;
  visitors: number;
  sessions: number;
  views: number;
};
type EventRow = {
  id: string;
  createdAt: string;
  visitorId: string;
  sessionId: string;
  type: string;
  path: string;
  source: string;
  target: string | null;
  value: number | null;
  durationMs: number;
};

export function AnalyticsReport() {
  const t = useTranslations("analytics");
  const tableTranslations = useTranslations("dataTable");
  const locale = useLocale();
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(false);
  const report = api.analytics.report.useQuery({ days }, browserQuery);
  const labels = useMemo<DataTableLabels>(
    () => ({
      search: tableTranslations("search"),
      searchPlaceholder: tableTranslations("searchPlaceholder"),
      filterColumn: tableTranslations("filterColumn"),
      minimum: tableTranslations("minimum"),
      maximum: tableTranslations("maximum"),
      groupBy: tableTranslations("groupBy"),
      clearGrouping: tableTranslations("clearGrouping"),
      expandAll: tableTranslations("expandAll"),
      collapseAll: tableTranslations("collapseAll"),
      clearFilters: tableTranslations("clearFilters"),
      noResults: tableTranslations("noResults"),
      previous: tableTranslations("previous"),
      next: tableTranslations("next"),
      firstPage: tableTranslations("firstPage"),
      lastPage: tableTranslations("lastPage"),
      rowsPerPage: tableTranslations("rowsPerPage"),
      page: tableTranslations("page"),
      of: tableTranslations("of"),
      rows: tableTranslations("rows"),
      totals: tableTranslations("totals"),
      sortAscending: tableTranslations("sortAscending"),
      sortDescending: tableTranslations("sortDescending"),
      unsorted: tableTranslations("unsorted"),
      expandGroup: tableTranslations("expandGroup"),
      collapseGroup: tableTranslations("collapseGroup"),
      multiSortHint: tableTranslations("multiSortHint"),
      fullscreen: tableTranslations("fullscreen"),
      exitFullscreen: tableTranslations("exitFullscreen"),
    }),
    [tableTranslations],
  );
  const formatDuration = useCallback(
    (durationMs: number) => {
      const totalSeconds = Math.floor(durationMs / 1000);
      return t("duration", {
        minutes: Math.floor(totalSeconds / 60),
        seconds: totalSeconds % 60,
      });
    },
    [t],
  );
  const formatNumber = useCallback(
    (value: unknown) =>
      typeof value === "number" ? value.toLocaleString(locale) : "-",
    [locale],
  );

  async function exportExcel() {
    setExporting(true);
    setExportError(false);
    try {
      const response = await fetch("/api/analytics/export", {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const filename =
        response.headers
          .get("Content-Disposition")
          ?.match(/filename="([^"]+)"/)?.[1] ??
        `analytics-all-time-${new Date().toISOString().slice(0, 10)}.xlsx`;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setExportError(true);
    } finally {
      setExporting(false);
    }
  }
  const pageColumns = useMemo<ColumnDef<PageRow>[]>(
    () => [
      { accessorKey: "path", header: t("path") },
      {
        accessorKey: "views",
        header: t("pageViews"),
        enableGrouping: false,
        aggregationFn: "sum",
        aggregatedCell: ({ getValue }) => formatNumber(getValue()),
        footer: ({ table, column }) =>
          formatNumber(getColumnAggregate(table, column.id)),
      },
      { accessorKey: "visitors", header: t("visitors"), enableGrouping: false },
      {
        accessorKey: "engagementMs",
        header: t("activeTime"),
        enableGrouping: false,
        aggregationFn: "sum",
        cell: ({ getValue }) => formatDuration(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
          formatDuration(getValue<number>() ?? 0),
        footer: ({ table, column }) =>
          formatDuration(Number(getColumnAggregate(table, column.id) ?? 0)),
      },
    ],
    [t, formatDuration, formatNumber],
  );
  const sourceColumns = useMemo<ColumnDef<SourceRow>[]>(
    () => [
      { accessorKey: "source", header: t("source") },
      { accessorKey: "visitors", header: t("visitors"), enableGrouping: false },
      { accessorKey: "sessions", header: t("sessions"), enableGrouping: false },
      {
        accessorKey: "views",
        header: t("pageViews"),
        enableGrouping: false,
        aggregationFn: "sum",
        aggregatedCell: ({ getValue }) => formatNumber(getValue()),
        footer: ({ table, column }) =>
          formatNumber(getColumnAggregate(table, column.id)),
      },
    ],
    [t, formatNumber],
  );
  const eventColumns = useMemo<ColumnDef<EventRow>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: t("time"),
        enableGrouping: false,
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleString(locale),
      },
      { accessorKey: "type", header: t("eventType") },
      { accessorKey: "path", header: t("path") },
      { accessorKey: "source", header: t("source") },
      {
        accessorKey: "target",
        header: t("target"),
        cell: ({ getValue }) => getValue<string | null>() ?? "-",
        enableGrouping: false,
      },
      {
        accessorKey: "value",
        header: t("value"),
        cell: ({ getValue }) => getValue<number | null>() ?? "-",
        enableGrouping: false,
        aggregationFn: "mean",
        aggregatedCell: ({ getValue }) =>
          t("meanValue", { value: formatNumber(getValue()) }),
        footer: ({ table, column }) =>
          t("meanValue", {
            value: formatNumber(getColumnAggregate(table, column.id)),
          }),
      },
      {
        accessorKey: "durationMs",
        header: t("activeTime"),
        enableGrouping: false,
        aggregationFn: "sum",
        cell: ({ getValue }) => formatDuration(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
          formatDuration(getValue<number>() ?? 0),
        footer: ({ table, column }) =>
          formatDuration(Number(getColumnAggregate(table, column.id) ?? 0)),
      },
      {
        accessorKey: "visitorId",
        header: t("visitorId"),
        aggregationFn: "uniqueCount",
        aggregatedCell: ({ getValue }) =>
          t("distinctCount", { value: formatNumber(getValue()) }),
        footer: ({ table, column }) =>
          t("distinctCount", {
            value: formatNumber(getColumnAggregate(table, column.id)),
          }),
      },
      {
        accessorKey: "sessionId",
        header: t("sessionId"),
        aggregationFn: "uniqueCount",
        aggregatedCell: ({ getValue }) =>
          t("distinctCount", { value: formatNumber(getValue()) }),
        footer: ({ table, column }) =>
          t("distinctCount", {
            value: formatNumber(getColumnAggregate(table, column.id)),
          }),
      },
    ],
    [t, locale, formatDuration, formatNumber],
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="w-40 space-y-1">
            <Label htmlFor="analytics-days">{t("range")}</Label>
            <Select
              value={String(days)}
              onValueChange={(value) => setDays(Number(value) as 7 | 30 | 90)}
            >
              <SelectTrigger id="analytics-days">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[7, 30, 90].map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    {t("days", { days: value })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={report.isFetching}
            onClick={() => void report.refetch()}
          >
            {t("refresh")}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={exporting}
            onClick={() => void exportExcel()}
          >
            <Download className="h-4 w-4" aria-hidden />
            {exporting ? t("exporting") : t("exportExcel")}
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{t("privacyNote")}</p>
      {exportError ? (
        <p role="alert" className="text-sm text-destructive">
          {t("exportError")}
        </p>
      ) : null}
      {exporting ? (
        <p role="status" className="text-sm text-muted-foreground">
          {t("exporting")}
        </p>
      ) : null}
      {report.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {t("error")}
        </p>
      ) : null}
      {report.isLoading ? (
        <p role="status" className="text-sm text-muted-foreground">
          {t("loading")}
        </p>
      ) : null}
      {report.data ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[
              [
                t("visitors"),
                report.data.summary.visitors.toLocaleString(locale),
              ],
              [
                t("sessions"),
                report.data.summary.sessions.toLocaleString(locale),
              ],
              [
                t("pageViews"),
                report.data.summary.pageViews.toLocaleString(locale),
              ],
              [t("events"), report.data.summary.events.toLocaleString(locale)],
              [
                t("activeTime"),
                formatDuration(report.data.summary.engagementMs),
              ],
              [
                t("averageSession"),
                formatDuration(
                  report.data.summary.sessions
                    ? report.data.summary.engagementMs /
                        report.data.summary.sessions
                    : 0,
                ),
              ],
            ].map(([label, value]) => (
              <Card key={label}>
                <CardContent className="space-y-2 pt-6">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-semibold">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {t("aggregationNote")}
          </p>
          <DataTable
            key={`pages-${days}`}
            title={t("pages")}
            tableId="analytics-pages"
            data={report.data.pages}
            columns={pageColumns}
            labels={labels}
            initialSort={[{ id: "views", desc: true }]}
          />
          <DataTable
            key={`sources-${days}`}
            title={t("sources")}
            tableId="analytics-sources"
            data={report.data.sources}
            columns={sourceColumns}
            labels={labels}
            initialSort={[{ id: "sessions", desc: true }]}
          />
          <p className="text-sm text-muted-foreground">{t("eventsNote")}</p>
          <DataTable
            key={`events-${days}`}
            title={t("eventLog")}
            tableId="analytics-events"
            data={report.data.events}
            columns={eventColumns}
            labels={labels}
            initialSort={[{ id: "createdAt", desc: true }]}
          />
        </>
      ) : null}
    </section>
  );
}
