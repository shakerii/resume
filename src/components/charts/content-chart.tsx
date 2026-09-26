export function ContentChart({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; value: number }>;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);
  const colors = ["bg-chart-1", "bg-chart-2", "bg-chart-4", "bg-chart-5", "bg-primary"];
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{item.label}</span>
              <span className="text-muted-foreground">{item.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${colors[index % colors.length]}`}
                style={{ width: `${Math.max(item.value === 0 ? 0 : 6, (item.value / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
