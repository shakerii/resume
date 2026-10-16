import { z } from "zod";

export const analyticsBatchSchema = z
  .object({
    visitorId: z.string().uuid(),
    sessionId: z.string().uuid(),
    events: z
      .array(
        z
          .object({
            id: z.string().uuid(),
            type: z.enum([
              "page_view",
              "engagement",
              "click",
              "download",
              "form_submit",
              "scroll",
            ]),
            path: z.string().min(1).max(1024),
            referrer: z.string().max(2048).optional(),
            source: z.string().max(100).optional(),
            medium: z.string().max(100).optional(),
            campaign: z.string().max(100).optional(),
            target: z.string().max(512).optional(),
            value: z.number().finite().min(0).max(100).optional(),
            durationMs: z.number().int().min(0).max(60000).optional(),
          })
          .strict(),
      )
      .min(1)
      .max(40),
  })
  .strict();

function hasUnsafePathCharacters(value: string) {
  return (
    /[\s@\\]/.test(value) ||
    Array.from(value).some((character) => character.charCodeAt(0) <= 0x1f)
  );
}

export function analyticsPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  const path = value.split(/[?#]/, 1)[0];
  if (!path || hasUnsafePathCharacters(path)) return null;
  let decodedPath: string;
  try {
    decodedPath = decodeURIComponent(path);
  } catch {
    return null;
  }
  if (
    hasUnsafePathCharacters(decodedPath) ||
    /(?:^|\/)admin(?:\/|$)/i.test(decodedPath)
  )
    return null;
  return path.slice(0, 256);
}

function attributionLabel(value: string | undefined) {
  if (!value) return null;
  return /^[a-z0-9][a-z0-9_. -]{0,99}$/i.test(value)
    ? value.toLowerCase()
    : null;
}

export function analyticsAttribution(
  event: z.infer<typeof analyticsBatchSchema>["events"][number],
  origin: string,
) {
  let referrer: string | null = null;
  if (event.referrer) {
    try {
      const url = new URL(event.referrer);
      if (["http:", "https:"].includes(url.protocol) && url.origin !== origin)
        referrer = url.hostname.toLowerCase();
    } catch {
      referrer = null;
    }
  }
  const source = attributionLabel(event.source);
  const host = referrer ?? "";
  const inferredSource = /(^|\.)google\.[a-z.]+$/.test(host)
    ? "google"
    : /(^|\.)linkedin\.com$/.test(host) || host === "lnkd.in"
      ? "linkedin"
      : /(^|\.)bing\.com$/.test(host)
        ? "bing"
        : /(^|\.)duckduckgo\.com$/.test(host)
          ? "duckduckgo"
          : /(^|\.)facebook\.com$/.test(host)
            ? "facebook"
            : /(^|\.)(twitter\.com|x\.com|t\.co)$/.test(host)
              ? "twitter"
              : host || "direct";
  return {
    source: source ?? inferredSource,
    referrer,
    medium: attributionLabel(event.medium),
    campaign: attributionLabel(event.campaign),
  };
}

export function analyticsTarget(value: string | undefined, origin: string) {
  if (!value) return null;
  if (/^(https?:\/\/|\/)/i.test(value)) {
    try {
      const url = new URL(value, origin);
      const path = analyticsPath(url.pathname);
      if (!path) return null;
      return (url.origin === origin ? path : `${url.origin}${path}`).slice(
        0,
        256,
      );
    } catch {
      return null;
    }
  }
  return /^[a-z0-9][a-z0-9_:.# -]{0,99}$/i.test(value) ? value : null;
}
