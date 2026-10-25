"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { createContext, useContext, useEffect, useState } from "react";
import { ExportPdfButton } from "~/components/resume/resume-pdf";
import { SwitchLocales } from "~/components/resume/switch-locales";
import type { ResumeData } from "~/components/resume/types";
import { Button } from "~/components/ui/button";
import type { Locale } from "~/utils/navigation";

type ViewMode = "classic" | "future";

const STORAGE_KEY = "resume-view-mode";

const ViewModeContext = createContext<{
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
} | null>(null);

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error("useViewMode must be used inside ViewModeProvider");
  }
  return context;
}

export function ViewModeToggle() {
  const t = useTranslations("nav");
  const { mode, setMode } = useViewMode();
  const next: ViewMode = mode === "classic" ? "future" : "classic";
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => setMode(next)}
      data-analytics={`view-mode-${next}`}
      className={
        mode === "classic"
          ? "border-primary/60 text-primary hover:text-primary"
          : "border-fuchsia-400/40 bg-fuchsia-950/40 font-mono text-xs uppercase tracking-widest text-fuchsia-300 hover:border-fuchsia-300 hover:text-fuchsia-200 hover:shadow-[0_0_14px_rgba(232,121,249,0.4)]"
      }
    >
      {mode === "classic" ? t("futureMode") : t("classicMode")}
    </Button>
  );
}

const futureLoading = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#02040a] font-mono text-sm text-cyan-300">
    <span className="animate-pulse">BOOTING INTERFACE…</span>
  </div>
);

const FutureResume = dynamic(
  () =>
    import("~/components/future/future-resume").then((mod) => mod.FutureResume),
  { ssr: false, loading: futureLoading },
);

const FutureProjectArticle = dynamic(
  () =>
    import("~/components/future/future-project").then(
      (mod) => mod.FutureProjectArticle,
    ),
  { ssr: false, loading: futureLoading },
);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>("classic");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "future") {
      setModeState("future");
    }
  }, []);

  function setMode(next: ViewMode) {
    setModeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <ViewModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

function ModeSwitch({
  classic,
  future,
}: {
  classic: React.ReactNode;
  future: React.ReactNode;
}) {
  const { mode } = useViewMode();
  return <>{mode === "classic" ? classic : future}</>;
}

export function ResumeShell({
  locale,
  data,
  classic,
}: {
  locale: Locale;
  data: ResumeData;
  classic: React.ReactNode;
}) {
  return (
    <ViewModeProvider>
      <ModeSwitch
        classic={classic}
        future={<FutureResume locale={locale} data={data} />}
      />
    </ViewModeProvider>
  );
}

export type ProjectArticleData = {
  title: string;
  excerpt: string;
  content: string;
  technologies: string[];
};

export function ResumeControls({
  locale,
  data,
  variant = "classic",
  showAdmin = true,
}: {
  locale: Locale;
  data?: ResumeData;
  variant?: "classic" | "future";
  showAdmin?: boolean;
}) {
  const nav = useTranslations("nav");
  if (variant === "future") {
    return (
      <>
        <SwitchLocales variant="future" />
        {data ? <ExportPdfButton data={data} variant="future" /> : null}
        <ViewModeToggle />
        {showAdmin ? (
          <Link
            href={`/${locale}/admin`}
            className="flex h-8 items-center rounded-md border border-slate-600/60 bg-slate-900/60 px-3 font-mono text-xs uppercase tracking-widest text-slate-300 transition hover:border-slate-400"
          >
            {nav("admin")}
          </Link>
        ) : null}
      </>
    );
  }
  return (
    <>
      <SwitchLocales />
      {data ? <ExportPdfButton data={data} /> : null}
      <ViewModeToggle />
      {showAdmin ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${locale}/admin`}>{nav("admin")}</Link>
        </Button>
      ) : null}
    </>
  );
}

export function ProjectShell({
  locale,
  project,
  classic,
}: {
  locale: Locale;
  project: ProjectArticleData;
  classic: React.ReactNode;
}) {
  return (
    <ViewModeProvider>
      <ModeSwitch
        classic={classic}
        future={<FutureProjectArticle locale={locale} project={project} />}
      />
    </ViewModeProvider>
  );
}
