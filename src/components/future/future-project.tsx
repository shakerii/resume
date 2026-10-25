"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Soundtrack } from "~/components/future/soundtrack";
import { Starfield } from "~/components/future/starfield";
import {
  GlitchText,
  Reveal,
  TiltCard,
  Typewriter,
} from "~/components/future/widgets";
import {
  ResumeControls,
  type ProjectArticleData,
} from "~/components/resume/resume-shell";
import { hasMarkup, plainText } from "~/utils/html";
import type { Locale } from "~/utils/navigation";

export function FutureProjectArticle({
  locale,
  project,
}: {
  locale: Locale;
  project: ProjectArticleData;
}) {
  const admin = useTranslations("admin");
  const activeLocale = useLocale();

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#02040a] text-slate-100"
      dir={activeLocale === "fa" ? "rtl" : "ltr"}
    >
      <Starfield />
      <div
        className="scanlines pointer-events-none fixed inset-0 z-10"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-10 h-64 bg-gradient-to-b from-fuchsia-500/10 to-transparent"
        aria-hidden
      />

      <div className="relative z-20 mx-auto max-w-4xl px-6 py-10">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-2">
          <Link
            href={`/${locale}`}
            className="flex h-8 items-center gap-2 rounded-md border border-cyan-400/40 bg-cyan-950/40 px-3 font-mono text-xs uppercase tracking-widest text-cyan-300 transition hover:border-cyan-300 hover:shadow-[0_0_14px_rgba(34,211,238,0.4)]"
          >
            <span aria-hidden>«</span>
            {admin("back")}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Soundtrack />
            <ResumeControls
              locale={locale}
              variant="future"
              showAdmin={false}
            />
          </div>
        </div>

        <header>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-fuchsia-400">
            ░ PROJECT FILE ░
          </p>
          <h1 className="text-4xl font-black leading-tight md:text-5xl">
            <GlitchText text={project.title} className="neon-text" />
          </h1>
          {plainText(project.excerpt) ? (
            hasMarkup(project.excerpt) ? (
              <div
                className="prose prose-invert-future mt-4 max-w-none text-cyan-100"
                dangerouslySetInnerHTML={{ __html: project.excerpt }}
              />
            ) : (
              <p className="mt-4 font-mono text-base text-cyan-300">
                <Typewriter text={`// ${project.excerpt}`} speed={18} />
              </p>
            )
          ) : null}
          {project.technologies.length ? (
            <p className="mt-6 flex flex-wrap gap-1.5">
              {project.technologies.map((name) => (
                <span
                  key={name}
                  className="rounded border border-fuchsia-400/30 bg-fuchsia-950/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fuchsia-300"
                >
                  {name}
                </span>
              ))}
            </p>
          ) : null}
        </header>

        <Reveal className="mt-10">
          <TiltCard glow="magenta" className="p-6 md:p-8">
            <article
              className="prose prose-invert-future max-w-none text-slate-300"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </TiltCard>
        </Reveal>

        <footer className="mt-16 border-t border-cyan-400/20 pt-6 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-slate-500">
          ◢ EOF ◣
        </footer>
      </div>
    </div>
  );
}
