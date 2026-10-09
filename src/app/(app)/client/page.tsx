import { CircleCheckBig, Coins, Hourglass, Paperclip, ScrollText, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { QuestCard } from "@/components/quest-card";
import { EmptyState, StatCard } from "@/components/stat-card";
import { cn } from "@/lib/cn";
import { formatReward } from "@/lib/format";
import { getClientQuests } from "@/lib/quests";
import { requireSession } from "@/lib/session";
import { PostQuestButton } from "./post-quest";

export const metadata: Metadata = { title: "Questboard" };

const filters = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "active", label: "In progress" },
  { id: "completed", label: "Completed" },
] as const;

type Filter = (typeof filters)[number]["id"];

export default async function ClientQuestboard({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; compose?: string }>;
}) {
  const session = await requireSession("client");
  const { status, compose } = await searchParams;
  const filter: Filter = filters.some((f) => f.id === status) ? (status as Filter) : "all";

  const quests = (await getClientQuests(session.userId)).map((q) => ({
    ...q,
    status: q.assignment_status ?? ("open" as const),
  }));

  const counts = {
    all: quests.length,
    open: quests.filter((q) => q.status === "open").length,
    active: quests.filter((q) => q.status === "accepted" || q.status === "in_progress").length,
    completed: quests.filter((q) => q.status === "completed").length,
  };
  const totalRewards = quests.reduce((sum, q) => sum + q.reward, 0);

  const visible = quests.filter((q) => {
    if (filter === "open") return q.status === "open";
    if (filter === "active") return q.status === "accepted" || q.status === "in_progress";
    if (filter === "completed") return q.status === "completed";
    return true;
  });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        greeting={`Welcome, ${session.username}`}
        title="The Questboard"
        description="Post tasks, hire adventurers, and manage your missions like a guildmaster."
        actions={<PostQuestButton defaultOpen={compose === "1"} />}
      />

      <section aria-label="Overview" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="Quests posted" value={counts.all} icon={ScrollText} accent="text-sky" />
        <StatCard label="In progress" value={counts.active} icon={Hourglass} accent="text-amber" />
        <StatCard label="Completed" value={counts.completed} icon={CircleCheckBig} />
        <StatCard label="Total rewards" value={formatReward(totalRewards)} icon={Coins} accent="text-violet" />
      </section>

      <section aria-labelledby="posted-heading" className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="posted-heading" className="font-display text-2xl font-semibold">
            Your posted quests
          </h2>
          <nav aria-label="Filter quests" className="scrollbar-none -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {filters.map((f) => (
              <Link
                key={f.id}
                href={f.id === "all" ? "/client" : `/client?status=${f.id}`}
                scroll={false}
                aria-current={filter === f.id ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition",
                  filter === f.id
                    ? "border-brand/40 bg-brand-soft text-brand-strong"
                    : "border-line text-muted hover:border-line-strong hover:text-ink",
                )}
              >
                {f.label}
                <span className="rounded-full bg-surface-3 px-1.5 text-xs tabular-nums text-ink-soft">{counts[f.id]}</span>
              </Link>
            ))}
          </nav>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title={quests.length === 0 ? "Your board is empty" : "Nothing here"}
            text={
              quests.length === 0
                ? "Post your first quest and adventurers will start picking it up."
                : "No quests match this filter right now."
            }
            action={quests.length === 0 ? <PostQuestButton /> : undefined}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((q, i) => (
              <QuestCard
                key={q.id}
                index={i}
                quest={{ ...q, person: { label: "Freelancer", name: q.freelancer } }}
              >
                {q.proof_file ? (
                  <a
                    href={`/${q.proof_file.split("/").map(encodeURIComponent).join("/")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-brand/30 bg-brand-soft px-3 py-2.5 text-sm font-semibold text-brand-strong transition hover:bg-brand/20"
                  >
                    <Paperclip className="size-4" aria-hidden /> View uploaded proof
                  </a>
                ) : (
                  q.status !== "open" && (
                    <p className="flex items-center gap-2 rounded-xl border border-dashed border-line-strong px-3 py-2.5 text-sm text-muted">
                      <Paperclip className="size-4" aria-hidden /> No proof uploaded yet
                    </p>
                  )
                )}
              </QuestCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
