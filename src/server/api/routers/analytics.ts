import { Prisma } from "@prisma/client";
import { z } from "zod";
import { adminProcedure, router } from "~/server/api/trpc";

type SummaryRow = {
  visitors: bigint;
  sessions: bigint;
  pageViews: bigint;
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

export const analyticsRouter = router({
  report: adminProcedure
    .input(
      z.object({ days: z.union([z.literal(7), z.literal(30), z.literal(90)]) }),
    )
    .query(async ({ ctx, input }) => {
      const since = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000);
      const [summaryRows, pageRows, sourceRows, recentEvents] =
        await ctx.prisma.$transaction([
          ctx.prisma.$queryRaw<SummaryRow[]>(Prisma.sql`
          SELECT COUNT(DISTINCT "visitorId") AS visitors,
            COUNT(DISTINCT "sessionId") AS sessions,
            SUM(CASE WHEN "type" = 'page_view' THEN 1 ELSE 0 END) AS pageViews,
            COUNT(*) AS events, SUM("durationMs") AS engagementMs
          FROM "AnalyticsLog" WHERE "createdAt" >= ${since}
        `),
          ctx.prisma.$queryRaw<PageRow[]>(Prisma.sql`
          SELECT "path", SUM(CASE WHEN "type" = 'page_view' THEN 1 ELSE 0 END) AS views,
            COUNT(DISTINCT "visitorId") AS visitors, SUM("durationMs") AS engagementMs
          FROM "AnalyticsLog" WHERE "createdAt" >= ${since}
          GROUP BY "path" ORDER BY views DESC, "path" ASC
        `),
          ctx.prisma.$queryRaw<SourceRow[]>(Prisma.sql`
          SELECT "source", COUNT(DISTINCT "visitorId") AS visitors,
            COUNT(DISTINCT "sessionId") AS sessions,
            SUM(CASE WHEN "type" = 'page_view' THEN 1 ELSE 0 END) AS views
          FROM "AnalyticsLog" WHERE "createdAt" >= ${since}
          GROUP BY "source" ORDER BY visitors DESC, "source" ASC
        `),
          ctx.prisma.analyticsLog.findMany({
            where: { createdAt: { gte: since } },
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            take: 500,
            select: {
              id: true,
              createdAt: true,
              visitorId: true,
              sessionId: true,
              type: true,
              path: true,
              source: true,
              target: true,
              value: true,
              durationMs: true,
            },
          }),
        ]);
      const summary = summaryRows[0];
      return {
        summary: {
          visitors: Number(summary?.visitors ?? 0),
          sessions: Number(summary?.sessions ?? 0),
          pageViews: Number(summary?.pageViews ?? 0),
          events: Number(summary?.events ?? 0),
          engagementMs: Number(summary?.engagementMs ?? 0),
        },
        pages: pageRows.map((row) => ({
          path: row.path,
          views: Number(row.views),
          visitors: Number(row.visitors),
          engagementMs: Number(row.engagementMs ?? 0),
        })),
        sources: sourceRows.map((row) => ({
          source: row.source,
          visitors: Number(row.visitors),
          sessions: Number(row.sessions),
          views: Number(row.views),
        })),
        events: recentEvents.map((event) => ({
          ...event,
          createdAt: event.createdAt.toISOString(),
        })),
      };
    }),
});
