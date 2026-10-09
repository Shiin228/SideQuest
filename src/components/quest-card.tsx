"use client";

import { CalendarClock, ChevronRight, Coins, UserRound } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { deadlineLabel, formatDate, formatReward } from "@/lib/format";
import { Badge, StatusBadge, STATUS_LABEL } from "./ui/badge";
import { Dialog } from "./ui/dialog";

export type QuestCardData = {
  id: number;
  title: string;
  description: string | null;
  reward: number;
  deadline: string;
  created_at: string;
  status: keyof typeof STATUS_LABEL;
  /** "Posted by" for freelancers, "Freelancer" for clients. */
  person: { label: string; name: string | null };
};

export function QuestCard({
  quest,
  children,
  index = 0,
}: {
  quest: QuestCardData;
  /** Actions shown at the bottom of the card (accept button, proof link, progress form...). */
  children?: React.ReactNode;
  index?: number;
}) {
  const [open, setOpen] = useState(false);
  const due = deadlineLabel(quest.deadline);
  const showDue = quest.status !== "completed";

  return (
    <article
      className="card group flex flex-col p-5 transition duration-200 hover:-translate-y-0.5 hover:border-line-strong animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <StatusBadge status={quest.status} />
        <span className="font-display text-lg font-semibold text-brand-strong tabular-nums">{formatReward(quest.reward)}</span>
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 text-left cursor-pointer focus-visible:outline-none"
        aria-haspopup="dialog"
      >
        <h3 className="font-display text-lg leading-snug font-semibold text-balance transition group-hover:text-brand-strong">
          {quest.title}
        </h3>
        {quest.description && (
          <p className="mt-2 line-clamp-3 text-sm whitespace-pre-line text-muted">{quest.description}</p>
        )}
        <span className="mt-2 inline-flex items-center gap-0.5 text-xs font-semibold text-ink-soft/70 transition group-hover:text-ink">
          View details <ChevronRight className="size-3.5" aria-hidden />
        </span>
      </button>

      <dl className="mt-4 grid gap-2 border-t border-line pt-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="inline-flex items-center gap-2 text-muted">
            <CalendarClock className="size-4" aria-hidden /> Deadline
          </dt>
          <dd className="flex items-center gap-2 text-right">
            {formatDate(quest.deadline)}
            {showDue && due.tone !== "muted" && <Badge tone={due.tone}>{due.text}</Badge>}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="inline-flex items-center gap-2 text-muted">
            <UserRound className="size-4" aria-hidden /> {quest.person.label}
          </dt>
          <dd className={cn("truncate text-right", !quest.person.name && "text-faint italic")}>
            {quest.person.name ?? "Not assigned yet"}
          </dd>
        </div>
      </dl>

      {children && <div className="mt-auto pt-4">{children}</div>}

      <Dialog open={open} onClose={() => setOpen(false)} title={quest.title} description={`Posted ${formatDate(quest.created_at)}`}>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={quest.status} />
          {showDue && <Badge tone={due.tone}>{due.text}</Badge>}
        </div>
        <p className="mt-4 text-[0.95rem] leading-relaxed whitespace-pre-line text-ink-soft">
          {quest.description || "No description provided."}
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-3">
          <DetailTile icon={Coins} label="Reward" value={formatReward(quest.reward)} />
          <DetailTile icon={CalendarClock} label="Deadline" value={formatDate(quest.deadline)} />
          <DetailTile icon={UserRound} label={quest.person.label} value={quest.person.name ?? "Not assigned yet"} className="col-span-2" />
        </dl>
      </Dialog>
    </article>
  );
}

function DetailTile({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-line bg-surface-2 p-3", className)}>
      <dt className="flex items-center gap-1.5 text-xs text-muted">
        <Icon className="size-3.5" aria-hidden /> {label}
      </dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}
