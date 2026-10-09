import { cn } from "@/lib/cn";

const tones = {
  open: "bg-sky/10 text-sky ring-sky/25",
  accepted: "bg-violet/10 text-violet ring-violet/25",
  in_progress: "bg-amber/10 text-amber ring-amber/25",
  completed: "bg-brand-soft text-brand-strong ring-brand/30",
  danger: "bg-danger/10 text-danger ring-danger/25",
  warning: "bg-amber/10 text-amber ring-amber/25",
  muted: "bg-surface-3 text-muted ring-line-strong",
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({ tone, children, dot, className }: { tone: BadgeTone; children: React.ReactNode; dot?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

export const STATUS_LABEL = {
  open: "Open",
  accepted: "Accepted",
  in_progress: "In progress",
  completed: "Completed",
} as const;

export function StatusBadge({ status }: { status: keyof typeof STATUS_LABEL }) {
  return (
    <Badge tone={status} dot>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
