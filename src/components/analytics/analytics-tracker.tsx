"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type AnalyticsEvent = {
  id: string;
  type:
    | "page_view"
    | "engagement"
    | "click"
    | "download"
    | "form_submit"
    | "scroll";
  path: string;
  target?: string;
  value?: number;
  durationMs?: number;
  referrer?: string;
  source?: string;
  medium?: string;
  campaign?: string;
};

type Session = {
  id: string;
  updatedAt: number;
  referrer: string;
  source: string;
  medium: string;
  campaign: string;
};

let fallbackVisitor: string | undefined;
let fallbackSession: Session | undefined;

function readStorage(storage: "localStorage" | "sessionStorage", key: string) {
  try {
    return window[storage].getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(
  storage: "localStorage" | "sessionStorage",
  key: string,
  value: string,
) {
  try {
    window[storage].setItem(key, value);
  } catch {
    return;
  }
}

function getIdentity() {
  const storedVisitor = readStorage("localStorage", "resume_analytics_visitor");
  const visitorId =
    storedVisitor && /^[\da-f-]{36}$/i.test(storedVisitor)
      ? storedVisitor
      : (fallbackVisitor ??= crypto.randomUUID());
  writeStorage("localStorage", "resume_analytics_visitor", visitorId);
  let session = fallbackSession;
  try {
    const stored = readStorage("sessionStorage", "resume_analytics_session");
    if (stored) session = JSON.parse(stored) as Session;
  } catch {
    session = undefined;
  }
  if (
    !session?.id ||
    !Number.isFinite(session.updatedAt) ||
    Date.now() - session.updatedAt > 30 * 60 * 1000
  ) {
    const params = new URLSearchParams(window.location.search);
    let referrer = "";
    try {
      const url = new URL(document.referrer);
      if (url.origin !== window.location.origin) referrer = url.origin;
    } catch {
      referrer = "";
    }
    session = {
      id: crypto.randomUUID(),
      updatedAt: Date.now(),
      referrer,
      source: params.get("utm_source")?.slice(0, 100) ?? "",
      medium: params.get("utm_medium")?.slice(0, 100) ?? "",
      campaign: params.get("utm_campaign")?.slice(0, 100) ?? "",
    };
  }
  session.updatedAt = Date.now();
  fallbackSession = session;
  writeStorage(
    "sessionStorage",
    "resume_analytics_session",
    JSON.stringify(session),
  );
  return { visitorId, session };
}

function targetName(element: Element) {
  const label = element.getAttribute("data-analytics");
  if (label) return label.slice(0, 160);
  if (element instanceof HTMLAnchorElement) {
    try {
      const url = new URL(element.href, window.location.href);
      if (!["http:", "https:"].includes(url.protocol)) return url.protocol;
      return (
        url.origin === window.location.origin
          ? url.pathname
          : `${url.origin}${url.pathname}`
      ).slice(0, 160);
    } catch {
      return "link";
    }
  }
  return `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}`.slice(
    0,
    160,
  );
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      !pathname ||
      pathname.split("/").includes("admin") ||
      navigator.doNotTrack === "1" ||
      (navigator as Navigator & { globalPrivacyControl?: boolean })
        .globalPrivacyControl
    )
      return;

    let queue: AnalyticsEvent[] = [];
    let lastTick = performance.now();
    let lastActivity = lastTick;
    let engagementMs = 0;
    let scrollMilestone = 0;
    let stopped = false;
    let pending = false;
    let wasActive =
      document.visibilityState === "visible" && document.hasFocus();

    function record(
      type: AnalyticsEvent["type"],
      details: Partial<AnalyticsEvent> = {},
    ) {
      if (queue.length >= 100) return;
      queue.push({
        ...details,
        id: crypto.randomUUID(),
        type,
        path: pathname!,
      });
    }

    function tick() {
      const now = performance.now();
      if (wasActive) {
        engagementMs += Math.max(
          0,
          Math.min(now, lastActivity + 60_000) - lastTick,
        );
      }
      lastTick = now;
      wasActive = document.visibilityState === "visible" && document.hasFocus();
    }

    function flush(final = false) {
      tick();
      if (engagementMs >= 1000) {
        record("engagement", { durationMs: Math.round(engagementMs) });
        engagementMs = 0;
      }
      if (!queue.length || (pending && !final)) return;
      const { visitorId, session } = getIdentity();
      const events = queue.splice(0, 20).map((event) => ({
        ...event,
        referrer: session.referrer,
        source: session.source,
        medium: session.medium,
        campaign: session.campaign,
      }));
      const body = JSON.stringify({ visitorId, sessionId: session.id, events });
      if (
        final &&
        navigator.sendBeacon?.(
          "/api/analytics",
          new Blob([body], { type: "application/json" }),
        )
      ) {
        if (queue.length) flush(true);
        return;
      }
      pending = true;
      void fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      })
        .then((response) => {
          if (response.status >= 500)
            queue = [...events, ...queue].slice(0, 100);
        })
        .catch(() => {
          queue = [...events, ...queue].slice(0, 100);
        })
        .finally(() => {
          pending = false;
        });
      if (final && queue.length) flush(true);
    }

    function activity() {
      tick();
      lastActivity = performance.now();
    }

    function click(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest(
        "a,button,[role='button'],[data-analytics]",
      );
      if (!element || element.closest("[data-analytics-ignore]")) return;
      record(element.hasAttribute("download") ? "download" : "click", {
        target: targetName(element),
      });
      if (element instanceof HTMLAnchorElement) flush(true);
    }

    function submit(event: SubmitEvent) {
      if (
        event.target instanceof HTMLFormElement &&
        !event.target.closest("[data-analytics-ignore]")
      ) {
        record("form_submit", { target: targetName(event.target) });
        flush(true);
      }
    }

    function download(event: Event) {
      const name = (event as CustomEvent<string>).detail;
      if (typeof name === "string")
        record("download", { target: name.slice(0, 160) });
    }

    function scroll() {
      activity();
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const percent =
        height > 0
          ? Math.min(100, Math.round((window.scrollY / height) * 100))
          : 0;
      for (const milestone of [25, 50, 75, 100]) {
        if (percent >= milestone && scrollMilestone < milestone) {
          record("scroll", { value: milestone });
          scrollMilestone = milestone;
        }
      }
    }

    function visibility() {
      flush(document.visibilityState === "hidden");
      lastTick = performance.now();
    }

    function pagehide() {
      flush(true);
    }
    function start() {
      if (stopped) return;
      record("page_view");
      flush();
    }

    const startTimer = window.setTimeout(start, 0);
    const timer = window.setInterval(() => flush(), 10_000);
    document.addEventListener("click", click, true);
    document.addEventListener("submit", submit, true);
    document.addEventListener("keydown", activity, { passive: true });
    document.addEventListener("pointerdown", activity, { passive: true });
    document.addEventListener("pointermove", activity, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("blur", pagehide);
    window.addEventListener("focus", activity);
    window.addEventListener("pagehide", pagehide);
    window.addEventListener("analytics:download", download);
    return () => {
      stopped = true;
      window.clearTimeout(startTimer);
      window.clearInterval(timer);
      flush(true);
      document.removeEventListener("click", click, true);
      document.removeEventListener("submit", submit, true);
      document.removeEventListener("keydown", activity);
      document.removeEventListener("pointerdown", activity);
      document.removeEventListener("pointermove", activity);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("blur", pagehide);
      window.removeEventListener("focus", activity);
      window.removeEventListener("pagehide", pagehide);
      window.removeEventListener("analytics:download", download);
    };
  }, [pathname]);

  return null;
}
