import { cn } from "@/lib/cn";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "text-brand",
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent?: string;
}) {
  return (
    <div className="card flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl bg-surface-3 sm:size-11", accent)}>
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="w-full min-w-0">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
        <p className="truncate font-display text-xl font-semibold tabular-nums sm:text-2xl" title={String(value)}>
          {value}
        </p>
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-(--radius-card) border border-dashed border-line-strong px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-surface-2 text-muted ring-1 ring-line">
        <Icon className="size-6" aria-hidden />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
