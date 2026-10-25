"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ContactForm } from "~/components/contact/contact-form";
import { Soundtrack } from "~/components/future/soundtrack";
import { SkillMatrix } from "~/components/future/skill-matrix";
import { Starfield } from "~/components/future/starfield";
import {
  GlitchText,
  HoloCube,
  Reveal,
  SectionHeading,
  TiltCard,
} from "~/components/future/widgets";
import { ResumeControls } from "~/components/resume/resume-shell";
import type { ResumeData } from "~/components/resume/types";
import { hasMarkup, plainText } from "~/utils/html";
import type { Locale } from "~/utils/navigation";

function linkLabel(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function BootScreen({ name, onDone }: { name: string; onDone: () => void }) {
  const lines = [
    "> INITIALIZING NEURAL LINK …",
    "> LOADING PROFILE MODULES … OK",
    "> DECRYPTING CAREER ARCHIVE … OK",
    `> IDENTITY CONFIRMED: ${name || "UNKNOWN"}`,
    "> WELCOME ABOARD.",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= lines.length) {
      const timer = window.setTimeout(onDone, 500);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setStep(step + 1), 420);
    return () => window.clearTimeout(timer);
  }, [step, lines.length, onDone]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040a]"
      dir="ltr"
    >
      <div className="w-full max-w-md px-6 font-mono text-sm text-lime-300">
        {lines.slice(0, step).map((line) => (
          <p key={line} className="mb-1">
            {line}
          </p>
        ))}
        <span className="inline-block h-4 w-2 animate-pulse bg-lime-300" />
      </div>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-cyan-400/20 bg-cyan-950/30 px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-500">
        {label}
      </p>
      <p className="mt-1 truncate text-sm text-cyan-100">{value}</p>
    </div>
  );
}

export function FutureResume({
  locale,
  data,
}: {
  locale: Locale;
  data: ResumeData;
}) {
  const t = useTranslations("resume");
  const nav = useTranslations("nav");
  const activeLocale = useLocale();
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem("future-booted") === "1") {
      setBooted(true);
    }
  }, []);

  function finishBoot() {
    window.sessionStorage.setItem("future-booted", "1");
    setBooted(true);
  }

  const techLabels = Array.from(
    new Set(data.projects.flatMap((project) => project.technologies)),
  ).slice(0, 6);

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#02040a] text-slate-100"
      dir={activeLocale === "fa" ? "rtl" : "ltr"}
    >
      {!booted ? <BootScreen name={data.name} onDone={finishBoot} /> : null}
      <Starfield />
      <div
        className="scanlines pointer-events-none fixed inset-0 z-10"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-10 h-64 bg-gradient-to-b from-cyan-500/10 to-transparent"
        aria-hidden
      />

      <div className="relative z-20 mx-auto max-w-5xl px-6 py-10">
        <div className="mb-10 flex flex-wrap items-center justify-end gap-2">
          <Soundtrack />
          <ResumeControls locale={locale} data={data} variant="future" />
        </div>

        <header className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-fuchsia-400">
              ░ {nav("futureTagline")} ░
            </p>
            <h1 className="text-5xl font-black leading-tight md:text-6xl">
              <GlitchText text={data.name} className="neon-text" />
              {data.title ? (
                <>
                  <span className="sr-only">, </span>
                  <span className="mt-4 block font-mono text-lg font-normal text-cyan-300">
                    {"// "}
                    {data.title}
                  </span>
                </>
              ) : null}
            </h1>
            {data.summary ? (
              <p className="mt-5 max-w-xl leading-relaxed text-slate-300/90">
                {data.summary}
              </p>
            ) : null}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {data.website ? (
                <a href={data.website} className="block" dir="ltr">
                  <StatChip
                    label={t("website")}
                    value={linkLabel(data.website)}
                  />
                </a>
              ) : null}
              {data.email ? (
                <a href={`mailto:${data.email}`} className="block">
                  <StatChip label={t("email")} value={data.email} />
                </a>
              ) : null}
              {data.phone ? (
                <a
                  href={`tel:${data.phone.replace(/\s/g, "")}`}
                  className="block"
                  dir="ltr"
                >
                  <StatChip label={t("phone")} value={data.phone} />
                </a>
              ) : null}
              {data.github ? (
                <a href={data.github} className="block" dir="ltr">
                  <StatChip
                    label={t("github")}
                    value={linkLabel(data.github)}
                  />
                </a>
              ) : null}
              {data.location ? (
                <StatChip label={t("location")} value={data.location} />
              ) : null}
            </div>
          </div>
          <div className="hidden md:block">
            <HoloCube labels={techLabels} />
          </div>
        </header>

        <section className="mt-20">
          <SectionHeading index="01" title={t("experience")} />
          <div className="relative ms-3 border-s border-cyan-400/30 ps-8">
            {data.experiences.map((item, index) => (
              <Reveal
                key={item.id}
                delay={index * 80}
                className="relative mb-10 last:mb-0"
              >
                <span
                  className="absolute -start-[2.42rem] top-1.5 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]"
                  aria-hidden
                />
                <TiltCard className="p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-bold text-cyan-100">
                      {item.company} <span className="text-fuchsia-400">⟋</span>{" "}
                      {item.role}
                    </h3>
                    {item.period ? (
                      <span className="rounded border border-fuchsia-400/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-fuchsia-300">
                        {item.period}
                      </span>
                    ) : null}
                  </div>
                  {plainText(item.description) ? (
                    <div
                      className="prose prose-invert-future mt-3 text-sm text-slate-300"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  ) : null}
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <SectionHeading
            index="02"
            title={t("projects")}
            accent="text-fuchsia-300"
          />
          <div className="grid gap-5 md:grid-cols-2">
            {data.projects.map((project, index) => (
              <Reveal key={project.id} delay={index * 80}>
                <TiltCard glow="magenta" className="group h-full p-5">
                  <Link
                    href={`/${locale}/projects/${project.slug}`}
                    className="block"
                  >
                    <p className="text-lg font-bold text-fuchsia-100 transition group-hover:text-fuchsia-300">
                      ▣ {project.title}
                    </p>
                    {plainText(project.excerpt) ? (
                      hasMarkup(project.excerpt) ? (
                        <div
                          className="prose prose-invert-future mt-2 text-sm text-slate-300/90"
                          dangerouslySetInnerHTML={{ __html: project.excerpt }}
                        />
                      ) : (
                        <p className="mt-2 text-sm leading-relaxed text-slate-300/90">
                          {project.excerpt}
                        </p>
                      )
                    ) : null}
                    {project.technologies.length ? (
                      <p className="mt-4 flex flex-wrap gap-1.5">
                        {project.technologies.map((name) => (
                          <span
                            key={name}
                            className="rounded border border-cyan-400/30 bg-cyan-950/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyan-300"
                          >
                            {name}
                          </span>
                        ))}
                      </p>
                    ) : null}
                  </Link>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <SectionHeading
            index="03"
            title={t("skills")}
            accent="text-lime-300"
          />
          <Reveal>
            <SkillMatrix groups={data.skillGroups} />
          </Reveal>
        </section>

        <section className="mt-20 grid gap-5 md:grid-cols-2">
          <Reveal>
            <TiltCard glow="amber" className="h-full p-5">
              <SectionHeading
                index="04"
                title={t("education")}
                accent="text-amber-300"
              />
              <div className="space-y-3">
                {data.education.map((item) => (
                  <div key={item.id} className="text-sm text-slate-200">
                    <p>
                      <span className="font-bold text-amber-200">
                        {item.degree}
                      </span>
                      {item.institution ? (
                        <span className="text-slate-400">
                          {" "}
                          - {item.institution}
                        </span>
                      ) : null}
                    </p>
                    {plainText(item.description) ? (
                      <div
                        className="prose prose-invert-future mt-1 text-slate-300"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </TiltCard>
          </Reveal>
          <Reveal delay={120}>
            <TiltCard className="h-full p-5">
              <SectionHeading index="05" title={t("languages")} />
              <div className="flex flex-wrap gap-2">
                {data.languages.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-full border border-cyan-400/40 bg-cyan-950/40 px-4 py-1.5 text-sm text-cyan-100"
                  >
                    {item.name}
                    {item.level ? (
                      <span className="ms-2 font-mono text-xs text-cyan-400">
                        {item.level}
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>
            </TiltCard>
          </Reveal>
        </section>

        <ContactForm variant="future" />

        <footer className="mt-20 border-t border-cyan-400/20 pt-6 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-slate-500">
          ◢ EOF ◣
        </footer>
      </div>
    </div>
  );
}
