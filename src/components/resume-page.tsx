import {ExportPdfButton} from "./resume-pdf";
import {SwitchLocales} from "~/app/[locale]/_components/switch-locales";

export default function ResumePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div><h1 className="text-4xl font-bold">Ramtin Shakeri</h1><p className="text-lg text-indigo-600">Software Engineer</p></div>
        <div className="flex gap-2"><SwitchLocales /><ExportPdfButton /></div>
      </div>
      <p className="mb-8 text-slate-600">Full-stack Software Engineer with 7+ years of experience building AI-driven applications, scalable platforms, and user-focused web solutions.</p>
      <section className="mb-8"><h2 className="mb-3 border-b pb-2 text-xl font-semibold">Work Experience</h2><p>Farbonyan — Frontend & AI Developer · Feb 2024 – Present</p><p>Interactive 10 — CTO & Software Engineer · Jun 2022 – Feb 2024</p><p>Matap — CTO & Full-Stack Developer · Mar 2022 – Jun 2022</p><p>Freelance — Full-Stack Developer · 2020 – 2022</p></section>
      <section className="mb-8"><h2 className="mb-3 border-b pb-2 text-xl font-semibold">Projects</h2><p><strong>SABI:</strong> AI-powered reporting assistant.</p><p><strong>FIS:</strong> B2B e-commerce platform for car parts.</p><p><strong>Smart Catalog:</strong> Interactive product catalog builder.</p><p><strong>BAAS Platform:</strong> Backend and API management services.</p></section>
      <section><h2 className="mb-3 border-b pb-2 text-xl font-semibold">Education & Skills</h2><p>B.Sc. Computer Engineering (Software), Amirkabir University of Technology</p><p className="mt-2">TypeScript, JavaScript, Python, PHP, Go, NextJS, React, FastAPI, Laravel, PostgreSQL, MySQL, MongoDB, Redis, Docker</p></section>
    </main>
  );
}
