import { loadResume } from "~/server/resume";
import { plainText } from "~/utils/html";
import { locales, type Locale } from "~/utils/navigation";
import { localizedUrl, seoDescription } from "~/utils/seo";

export async function GET() {
  const resumes = await Promise.all(
    locales.map(async (locale) => [locale, await loadResume(locale)] as const),
  );
  const english =
    resumes.find(([locale]) => locale === "en")?.[1] ?? resumes[0]?.[1];
  const name = english?.name || "Ramtin Shakeri";
  const title = english?.title || "";
  const summary = seoDescription(plainText(english?.summary ?? "")) || title;
  const lines = [
    `# ${name}`,
    "",
    summary ? `> ${summary}` : "",
    "",
    title ? `${name} is a ${title}.` : name,
    "",
    "## Resume",
    "",
    ...resumes.flatMap(([locale, resume]) => pageLinks(locale, resume)),
    "",
  ];
  return new Response(
    lines
      .filter((line, index, all) => line !== "" || all[index - 1] !== "")
      .join("\n"),
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
}

function pageLinks(
  locale: Locale,
  resume: {
    title: string;
    projects: Array<{ slug: string; title: string; excerpt: string }>;
  },
) {
  const label = locale === "fa" ? "فارسی" : "English";
  return [
    `- [Resume (${label})](${localizedUrl(locale)}): ${resume.title}`,
    ...resume.projects.map((project) => {
      const description =
        seoDescription(plainText(project.excerpt)) || resume.title;
      const url = localizedUrl(
        locale,
        `/projects/${encodeURIComponent(project.slug)}`,
      );
      return `- [${project.title} (${label})](${url}): ${description}`;
    }),
  ];
}
