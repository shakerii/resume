import { SkillBadge } from "~/components/charts/skill-badge";
import type { ResumeData } from "~/components/resume/types";
import { cn } from "~/utils/cn";

function chipTone(rating: number) {
  if (rating >= 9) return "border-primary/30 bg-primary/10 text-foreground";
  if (rating >= 7) return "border-transparent bg-secondary text-foreground";
  return "border-border bg-transparent text-muted-foreground";
}

export function SkillChart({ groups }: { groups: ResumeData["skillGroups"] }) {
  return (
    <div className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {groups.map((group) => (
        <div key={group.id}>
          <p className="text-sm font-semibold">{group.name}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {group.skills.map((skill) => (
              <li key={skill.id}>
                <SkillBadge
                  name={skill.name}
                  rating={skill.rating}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-medium",
                    chipTone(skill.rating),
                  )}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
