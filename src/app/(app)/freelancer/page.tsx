import { CircleCheckBig, Coins, Hourglass, ScrollText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { cn } from "@/lib/cn";
import { formatReward } from "@/lib/format";
import { getAcceptedQuests, getOpenQuests } from "@/lib/quests";
import { requireSession } from "@/lib/session";
import { AvailableQuests, QuestLog } from "./quest-lists";

export const metadata: Metadata = { title: "Questboard" };

export default async function FreelancerQuestboard({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const session = await requireSession("freelancer");
  const { tab } = await searchParams;
  const showLog = tab === "mine";

  const [open, mine] = await Promise.all([getOpenQuests(), getAcceptedQuests(session.userId)]);
  const active = mine.filter((q) => q.status !== "completed");
  const completed = mine.filter((q) => q.status === "completed");
  const earned = completed.reduce((sum, q) => sum + q.reward, 0);

  const tabs = [
    { href: "/freelancer", label: "Available quests", count: open.length, current: !showLog },
    { href: "/freelancer?tab=mine", label: "My quest log", count: mine.length, current: showLog },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        greeting={`Welcome, ${session.username}`}
        title="The Questboard"
        description="Pick up quests that match your skills, deliver proof, and collect your rewards."
      />

      <section aria-label="Overview" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="Available" value={open.length} icon={ScrollText} accent="text-sky" />
        <StatCard label="Active quests" value={active.length} icon={Hourglass} accent="text-amber" />
        <StatCard label="Completed" value={completed.length} icon={CircleCheckBig} />
        <StatCard label="Rewards earned" value={formatReward(earned)} icon={Coins} accent="text-violet" />
      </section>

      <section className="flex flex-col gap-5">
        <nav aria-label="Quest lists" className="flex gap-6 border-b border-line">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              scroll={false}
              aria-current={t.current ? "page" : undefined}
              className={cn(
                "-mb-px inline-flex items-center gap-2 border-b-2 pb-3 font-display text-lg font-semibold transition",
                t.current ? "border-brand text-ink" : "border-transparent text-muted hover:text-ink",
              )}
            >
              {t.label}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-sans text-xs tabular-nums",
                  t.current ? "bg-brand text-brand-ink" : "bg-surface-3 text-ink-soft",
                )}
              >
                {t.count}
              </span>
            </Link>
          ))}
        </nav>

        {showLog ? <QuestLog quests={mine} /> : <AvailableQuests quests={open} />}
      </section>
    </div>
  );
}
