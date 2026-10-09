"use client";

import { ArrowUpDown, Compass, Search, Swords } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { QuestCard } from "@/components/quest-card";
import { EmptyState } from "@/components/stat-card";
import { buttonClass } from "@/components/ui/button-styles";
import type { AcceptedQuest, OpenQuest } from "@/lib/quests";
import { AcceptQuestForm, ProgressForm } from "./quest-forms";

const sorts = {
  newest: { label: "Newest", fn: (a: OpenQuest, b: OpenQuest) => b.created_at.localeCompare(a.created_at) },
  reward: { label: "Highest reward", fn: (a: OpenQuest, b: OpenQuest) => b.reward - a.reward },
  deadline: { label: "Deadline soonest", fn: (a: OpenQuest, b: OpenQuest) => a.deadline.localeCompare(b.deadline) },
} as const;

export function AvailableQuests({ quests }: { quests: OpenQuest[] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<keyof typeof sorts>("newest");

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return quests
      .filter((q) => !term || `${q.title} ${q.description ?? ""} ${q.poster}`.toLowerCase().includes(term))
      .sort(sorts[sort].fn);
  }, [quests, search, sort]);

  if (quests.length === 0) {
    return (
      <EmptyState
        icon={Compass}
        title="No quests on the board"
        text="Every quest has been claimed. Check back later — new quests are posted all the time."
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search quests</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint" aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description or client…"
            className="field pl-10"
          />
        </label>
        <label className="relative sm:w-56">
          <span className="sr-only">Sort quests</span>
          <ArrowUpDown className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint" aria-hidden />
          <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof sorts)} className="field cursor-pointer appearance-none pl-10">
            {Object.entries(sorts).map(([id, s]) => (
              <option key={id} value={id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={Search} title="No matches" text={`No quests match “${search}”. Try a different word.`} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((q, i) => (
            <QuestCard key={q.id} index={i} quest={{ ...q, status: "open", person: { label: "Posted by", name: q.poster } }}>
              <AcceptQuestForm questId={q.id} />
            </QuestCard>
          ))}
        </div>
      )}
    </div>
  );
}

export function QuestLog({ quests }: { quests: AcceptedQuest[] }) {
  if (quests.length === 0) {
    return (
      <EmptyState
        icon={Swords}
        title="Your quest log is empty"
        text="Accept a quest from the board and it will show up here so you can track progress and upload proof."
        action={
          <Link href="/freelancer" className={buttonClass("primary")}>
            Browse available quests
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {quests.map((q, i) => (
        <QuestCard key={q.id} index={i} quest={{ ...q, person: { label: "Posted by", name: q.poster } }}>
          <ProgressForm questId={q.id} status={q.status} proofFile={q.proof_file} />
        </QuestCard>
      ))}
    </div>
  );
}
