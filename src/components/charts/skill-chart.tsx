export function SkillChart({
  title,
  groups,
}: {
  title: string;
  groups: Array<{ name: string; count: number }>;
}) {
  const max = Math.max(...groups.map((group) => group.count), 1);
  return (
    <section className="mt-4 space-y-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      {groups.map((group) => (
        <div key={group.name}>
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>{group.name}</span>
            <span>{group.count}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(group.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </section>
  );
}
