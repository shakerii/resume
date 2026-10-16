import { NextRequest, NextResponse } from "next/server";
import { adminCookieName, isAdminToken } from "~/server/auth";
import {
  analyticsAttribution,
  analyticsBatchSchema,
  analyticsPath,
  analyticsTarget,
} from "~/server/analytics";
import { prisma } from "~/server/db";

export const runtime = "nodejs";

const recentBatches = new Map<string, { count: number; expiresAt: number }>();
const maxBodyBytes = 48 * 1024;

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host") ?? request.nextUrl.host;
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const protocol =
    forwardedProtocol === "https" || forwardedProtocol === "http"
      ? `${forwardedProtocol}:`
      : request.nextUrl.protocol;
  if (
    origin !== `${protocol}//${host}` ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  if (isAdminToken(request.cookies.get(adminCookieName)?.value))
    return new NextResponse(null, { status: 204 });
  if (
    Number(request.headers.get("content-length")) > maxBodyBytes ||
    !request.body
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 413 });
  }
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBodyBytes) {
        await reader.cancel();
        return NextResponse.json(
          { error: "Payload too large" },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    const result = analyticsBatchSchema.safeParse(
      JSON.parse(Buffer.concat(chunks).toString("utf8")),
    );
    if (!result.success)
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    const now = Date.now();
    for (const [key, batch] of recentBatches)
      if (batch.expiresAt <= now) recentBatches.delete(key);
    const key = result.data.sessionId;
    const previous = recentBatches.get(key);
    if (previous && previous.count >= 120)
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    if (!previous && recentBatches.size >= 5000)
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    recentBatches.set(key, {
      count: (previous?.count ?? 0) + 1,
      expiresAt: previous?.expiresAt ?? now + 60000,
    });
    const events = result.data.events.flatMap((event) => {
      const path = analyticsPath(event.path);
      if (!path) return [];
      return [
        {
          id: event.id,
          visitorId: result.data.visitorId,
          sessionId: result.data.sessionId,
          type: event.type,
          path,
          ...analyticsAttribution(event, origin),
          target: analyticsTarget(event.target, origin),
          value: event.type === "scroll" ? (event.value ?? null) : null,
          durationMs: event.type === "engagement" ? (event.durationMs ?? 0) : 0,
        },
      ];
    });
    await prisma.$transaction(
      events.map((event) =>
        prisma.analyticsLog.upsert({
          where: { id: event.id },
          create: event,
          update: {},
        }),
      ),
    );
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof SyntaxError)
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    console.error(
      "Analytics ingestion failed",
      error instanceof Error ? error.name : "Unknown error",
    );
    return NextResponse.json(
      { error: "Unable to record analytics" },
      { status: 500 },
    );
  }
}
