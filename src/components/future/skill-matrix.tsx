import { SkillBadge } from "~/components/charts/skill-badge";
import type { ResumeData } from "~/components/resume/types";
import { cn } from "~/utils/cn";

function chipTone(rating: number) {
  if (rating >= 9) {
    return "border-cyan-400/50 bg-cyan-400/10 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.18)]";
  }
  if (rating >= 7)
    return "border-fuchsia-400/35 bg-fuchsia-400/10 text-fuchsia-100";
  return "border-slate-500/40 text-slate-400";
}

export function SkillMatrix({ groups }: { groups: ResumeData["skillGroups"] }) {
  return (
    <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
      {groups.map((group) => (
        <div key={group.id}>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-fuchsia-300/90">
            ▸ {group.name}
          </p>
          <ul className="flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <li key={skill.id}>
                <SkillBadge
                  name={skill.name}
                  rating={skill.rating}
                  className={cn(
                    "rounded border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider",
                    chipTone(skill.rating),
                  )}
                  tooltipClassName="border border-cyan-400/40 bg-[#02040a] font-mono uppercase tracking-wider text-cyan-100 [--tooltip-bg:#02040a]"
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
