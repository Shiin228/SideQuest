import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { STATUS_LABEL } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";
import { formatReward, toDateKey, todayDateOnly } from "@/lib/format";
import { getCalendarQuests, type CalendarQuest } from "@/lib/quests";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Calendar" };

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const chipTone: Record<keyof typeof STATUS_LABEL, string> = {
  open: "bg-sky/12 text-sky border-sky/25",
  accepted: "bg-violet/12 text-violet border-violet/25",
  in_progress: "bg-amber/12 text-amber border-amber/25",
  completed: "bg-brand-soft text-brand-strong border-brand/25",
};

function monthKey(date: Date) {
  return toDateKey(date).slice(0, 7);
}

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const session = await requireSession();
  const { month } = await searchParams;

  const today = todayDateOnly();
  const [y, m] = /^\d{4}-\d{2}$/.test(month ?? "") ? month!.split("-").map(Number) : [today.getFullYear(), today.getMonth() + 1];
  const first = new Date(y, m - 1, 1);
  const prev = new Date(y, m - 2, 1);
  const next = new Date(y, m, 1);
  const daysInMonth = new Date(y, m, 0).getDate();

  const quests = await getCalendarQuests(session.userId, session.role);
  const byDay = new Map<string, CalendarQuest[]>();
  for (const q of quests) {
    const key = q.deadline.slice(0, 10);
    byDay.set(key, [...(byDay.get(key) ?? []), q]);
  }

  const cells: (Date | null)[] = [
    ...Array.from({ length: first.getDay() }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(y, m - 1, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthQuests = quests
    .filter((q) => q.deadline.startsWith(monthKey(first)))
    .sort((a, b) => a.deadline.localeCompare(b.deadline));
  const todayKey = toDateKey(today);
  const home = session.role === "client" ? "/client" : "/freelancer";

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Quest Calendar"
        description={
          session.role === "client"
            ? "Deadlines for every quest you've posted."
            : "Deadlines for the quests in your quest log."
        }
      />

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-4 sm:px-6">
          <h2 className="font-display text-xl font-semibold">
            {first.toLocaleDateString("en-PH", { month: "long", year: "numeric" })}
          </h2>
          <div className="flex items-center gap-1">
            <Link href={`/calendar?month=${monthKey(prev)}`} className={buttonClass("ghost", "sm")} aria-label="Previous month">
              <ChevronLeft className="size-4" />
            </Link>
            <Link href="/calendar" className={buttonClass("secondary", "sm")}>
              Today
            </Link>
            <Link href={`/calendar?month=${monthKey(next)}`} className={buttonClass("ghost", "sm")} aria-label="Next month">
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-line text-center text-xs font-semibold tracking-wide text-muted uppercase">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2.5">
              <span className="sm:hidden">{d[0]}</span>
              <span className="hidden sm:inline">{d}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((date, i) => {
            const key = date ? toDateKey(date) : `empty-${i}`;
            const items = date ? (byDay.get(key) ?? []) : [];
            const isToday = key === todayKey;
            return (
              <div
                key={key}
                className={cn(
                  "min-h-16 border-line p-1.5 sm:min-h-28 sm:p-2",
                  i % 7 !== 6 && "border-r",
                  i < cells.length - 7 && "border-b",
                  !date && "bg-canvas/40",
                )}
              >
                {date && (
                  <>
                    <span
                      className={cn(
                        "grid size-7 place-items-center rounded-full text-xs font-semibold tabular-nums",
                        isToday ? "bg-brand text-brand-ink" : "text-ink-soft",
                      )}
                    >
                      {date.getDate()}
                    </span>
                    {/* Dots on phones, titled chips on larger screens */}
                    <div className="mt-1 flex flex-wrap gap-1 sm:hidden">
                      {items.map((q) => (
                        <span key={q.id} className={cn("size-2 rounded-full border", chipTone[q.status ?? "open"])} />
                      ))}
                    </div>
                    <ul className="mt-1 hidden space-y-1 sm:block">
                      {items.slice(0, 3).map((q) => (
                        <li
                          key={q.id}
                          title={q.title}
                          className={cn("truncate rounded-md border px-1.5 py-0.5 text-[0.7rem] font-semibold", chipTone[q.status ?? "open"])}
                        >
                          {q.title}
                        </li>
                      ))}
                      {items.length > 3 && <li className="px-1.5 text-[0.7rem] text-muted">+{items.length - 3} more</li>}
                    </ul>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold">Due this month</h2>
        {monthQuests.length === 0 ? (
          <p className="text-muted">
            No deadlines this month.{" "}
            <Link href={home} className="font-semibold text-brand hover:underline">
              Back to the Questboard
            </Link>
          </p>
        ) : (
          <ul className="card divide-y divide-line">
            {monthQuests.map((q) => {
              const status = q.status ?? "open";
              return (
                <li key={q.id} className="flex items-center gap-4 px-4 py-3 sm:px-5">
                  <span className="w-12 shrink-0 text-center">
                    <span className="block text-xs text-muted uppercase">
                      {new Date(q.deadline.slice(0, 10) + "T00:00").toLocaleDateString("en-PH", { month: "short" })}
                    </span>
                    <span className="block font-display text-xl font-semibold tabular-nums">{Number(q.deadline.slice(8, 10))}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{q.title}</span>
                    <span className="text-sm text-muted">{formatReward(q.reward)}</span>
                  </span>
                  <span className={cn("shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold", chipTone[status])}>
                    {STATUS_LABEL[status]}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
