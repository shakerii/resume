import { NextRequest, NextResponse } from "next/server";
import { createAnalyticsExport } from "~/server/analytics-export";
import { adminCookieName, isAdminToken } from "~/server/auth";
import { prisma } from "~/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAdminToken(request.cookies.get(adminCookieName)?.value)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const exportedAt = new Date();
  try {
    const body = await createAnalyticsExport(
      prisma,
      exportedAt,
      request.signal,
    );
    return new Response(body, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="analytics-all-time-${exportedAt.toISOString().slice(0, 10)}.xlsx"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(
      "Analytics export failed",
      error instanceof Error ? error.name : "Unknown error",
    );
    return NextResponse.json(
      { error: "Unable to export analytics" },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
