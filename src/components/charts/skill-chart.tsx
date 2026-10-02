export function SkillChart({
  title,
  groups,
}: {
  title: string;
  groups: Array<{
    name: string;
    skills: Array<{ id: string; name: string; rating: number }>;
  }>;
}) {
  return (
    <section className="mt-4 space-y-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      {groups.map((group) => (
        <div key={group.name} className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground">{group.name}</h4>
          {group.skills.map((skill) => (
            <div key={skill.id}>
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>{skill.name}</span>
                <span>{skill.rating}/10</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${skill.rating * 10}%` }} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
