import { Prisma, type PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";
import { PassThrough, Readable } from "node:stream";

type SummaryRow = {
  visitors: bigint;
  sessions: bigint;
  pageViews: bigint | null;
  events: bigint;
  engagementMs: bigint | null;
};

type PageRow = {
  path: string;
  views: bigint;
  visitors: bigint;
  engagementMs: bigint | null;
};

type SourceRow = {
  source: string;
  visitors: bigint;
  sessions: bigint;
  views: bigint;
};

const dateFormat = 'yyyy-mm-dd hh:mm:ss "UTC"';
const maxWorksheetRows = 1_048_576;

function addWorksheet(
  workbook: ExcelJS.stream.xlsx.WorkbookWriter,
  name: string,
  columns: Partial<ExcelJS.Column>[],
) {
  const sheet = workbook.addWorksheet(name, {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  sheet.columns = columns;
  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF334155" },
  };
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: columns.length },
  };
  header.commit();
  return sheet;
}

export async function createAnalyticsExport(
  database: PrismaClient,
  exportedAt: Date,
  signal?: AbortSignal,
) {
  const [summaryRows, pageRows, sourceRows] = await Promise.all([
    database.$queryRaw<SummaryRow[]>(Prisma.sql`
      SELECT COUNT(DISTINCT "visitorId") AS visitors,
        COUNT(DISTINCT "sessionId") AS sessions,
        SUM(CASE WHEN "type" = 'page_view' THEN 1 ELSE 0 END) AS pageViews,
        COUNT(*) AS events, SUM("durationMs") AS engagementMs
      FROM "AnalyticsLog" WHERE "createdAt" <= ${exportedAt}
    `),
    database.$queryRaw<PageRow[]>(Prisma.sql`
      SELECT "path", SUM(CASE WHEN "type" = 'page_view' THEN 1 ELSE 0 END) AS views,
        COUNT(DISTINCT "visitorId") AS visitors, SUM("durationMs") AS engagementMs
      FROM "AnalyticsLog" WHERE "createdAt" <= ${exportedAt}
      GROUP BY "path" ORDER BY views DESC, "path" ASC
    `),
    database.$queryRaw<SourceRow[]>(Prisma.sql`
      SELECT "source", COUNT(DISTINCT "visitorId") AS visitors,
        COUNT(DISTINCT "sessionId") AS sessions,
        SUM(CASE WHEN "type" = 'page_view' THEN 1 ELSE 0 END) AS views
      FROM "AnalyticsLog" WHERE "createdAt" <= ${exportedAt}
      GROUP BY "source" ORDER BY visitors DESC, "source" ASC
    `),
  ]);

  signal?.throwIfAborted();
  const output = new PassThrough();
  const body = Readable.toWeb(output) as ReadableStream<Uint8Array>;
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: output,
    useStyles: true,
    useSharedStrings: false,
  });
  workbook.creator = "Resume Analytics";
  workbook.created = exportedAt;
  const abort = () => output.destroy(new Error("Analytics export cancelled"));
  signal?.addEventListener("abort", abort, { once: true });
  output.once("close", () => signal?.removeEventListener("abort", abort));

  const writeWorkbook = async () => {
    const summary = addWorksheet(workbook, "Summary", [
      { header: "Metric", key: "metric", width: 30 },
      { header: "Value", key: "value", width: 28 },
    ]);
    const totals = summaryRows[0];
    summary.addRow(["Period", "All time"]).commit();
    const timestamp = summary.addRow(["Exported at (UTC)", exportedAt]);
    timestamp.getCell(2).numFmt = dateFormat;
    timestamp.commit();
    for (const [metric, value] of [
      ["Unique visitors", totals?.visitors],
      ["Sessions", totals?.sessions],
      ["Page views", totals?.pageViews],
      ["Events", totals?.events],
      ["Active time (milliseconds)", totals?.engagementMs],
    ] as const) {
      summary.addRow([metric, Number(value ?? 0)]).commit();
    }
    summary.commit();

    const pages = addWorksheet(workbook, "Pages", [
      { header: "Page", width: 50 },
      { header: "Page views", width: 18 },
      { header: "Unique visitors", width: 20 },
      { header: "Active time (milliseconds)", width: 28 },
    ]);
    for (const page of pageRows) {
      pages
        .addRow([
          page.path,
          Number(page.views),
          Number(page.visitors),
          Number(page.engagementMs ?? 0),
        ])
        .commit();
    }
    pages.commit();

    const sources = addWorksheet(workbook, "Sources", [
      { header: "Source", width: 35 },
      { header: "Unique visitors", width: 20 },
      { header: "Sessions", width: 18 },
      { header: "Page views", width: 18 },
    ]);
    for (const source of sourceRows) {
      sources
        .addRow([
          source.source,
          Number(source.visitors),
          Number(source.sessions),
          Number(source.views),
        ])
        .commit();
    }
    sources.commit();

    const eventColumns: Partial<ExcelJS.Column>[] = [
      { header: "Event ID", width: 38 },
      { header: "Created at (UTC)", width: 26, style: { numFmt: dateFormat } },
      { header: "Visitor ID", width: 38 },
      { header: "Session ID", width: 38 },
      { header: "Event type", width: 20 },
      { header: "Page", width: 50 },
      { header: "Source", width: 25 },
      { header: "Referrer", width: 35 },
      { header: "Medium", width: 25 },
      { header: "Campaign", width: 25 },
      { header: "Target", width: 50 },
      { header: "Value (scroll %)", width: 20 },
      { header: "Duration (milliseconds)", width: 26 },
    ];
    let sheetNumber = 1;
    let events = addWorksheet(workbook, "Events", eventColumns);
    let rowCount = 1;
    let cursor: string | undefined;
    while (true) {
      if (output.destroyed) throw new Error("Analytics export cancelled");
      const batch = await database.analyticsLog.findMany({
        where: {
          createdAt: { lte: exportedAt },
          ...(cursor ? { id: { gt: cursor } } : {}),
        },
        orderBy: { id: "asc" },
        take: 1000,
      });
      if (batch.length === 0) break;
      for (const event of batch) {
        if (rowCount === maxWorksheetRows) {
          events.commit();
          sheetNumber += 1;
          events = addWorksheet(
            workbook,
            `Events ${sheetNumber}`,
            eventColumns,
          );
          rowCount = 1;
        }
        events
          .addRow([
            event.id,
            event.createdAt,
            event.visitorId,
            event.sessionId,
            event.type,
            event.path,
            event.source,
            event.referrer,
            event.medium,
            event.campaign,
            event.target,
            event.value,
            event.durationMs,
          ])
          .commit();
        rowCount += 1;
      }
      cursor = batch[batch.length - 1]?.id;
      await new Promise<void>((resolve) => setImmediate(resolve));
    }
    events.commit();
    await workbook.commit();
  };

  void writeWorkbook().catch((error: unknown) => {
    if (output.destroyed) return;
    console.error(
      "Analytics export failed",
      error instanceof Error ? error.name : "Unknown error",
    );
    output.destroy(
      error instanceof Error ? error : new Error("Analytics export failed"),
    );
  });

  return body;
}
