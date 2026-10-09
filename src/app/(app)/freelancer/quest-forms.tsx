"use client";

import { Check, FileUp, Paperclip, Save, Swords, X } from "lucide-react";
import { useActionState, useRef, useState } from "react";
import { acceptQuest, updateQuestProgress } from "@/actions/quests";
import { Alert } from "@/components/ui/alert";
import { SubmitButton } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { initialFormState } from "@/lib/form-state";
import type { AssignmentStatus } from "@/lib/quests";

export function AcceptQuestForm({ questId }: { questId: number }) {
  const [state, action] = useActionState(acceptQuest, initialFormState);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="questId" value={questId} />
      {state.message && !state.ok && <Alert tone="error">{state.message}</Alert>}
      <SubmitButton className="w-full" pendingText="Accepting…">
        <Swords className="size-4" aria-hidden />
        Accept quest
      </SubmitButton>
    </form>
  );
}

const STATUS_OPTIONS: { value: AssignmentStatus; label: string; active: string }[] = [
  { value: "accepted", label: "Accepted", active: "bg-violet/15 text-violet ring-violet/40" },
  { value: "in_progress", label: "In progress", active: "bg-amber/15 text-amber ring-amber/40" },
  { value: "completed", label: "Completed", active: "bg-brand-soft text-brand-strong ring-brand/40" },
];

export function ProgressForm({
  questId,
  status,
  proofFile,
}: {
  questId: number;
  status: AssignmentStatus;
  proofFile: string | null;
}) {
  const [state, action] = useActionState(updateQuestProgress, initialFormState);
  const [selected, setSelected] = useState(status);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const proofHref = proofFile ? `/${proofFile.split("/").map(encodeURIComponent).join("/")}` : null;

  return (
    <form
      action={async (formData) => {
        await action(formData);
        setFileName(null);
      }}
      className="flex flex-col gap-3"
    >
      <input type="hidden" name="questId" value={questId} />

      <fieldset>
        <legend className="mb-2 text-xs font-semibold tracking-wider text-muted uppercase">Progress</legend>
        <div className="grid grid-cols-3 gap-1 rounded-xl border border-line bg-surface-2 p-1">
          {STATUS_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex h-9 cursor-pointer items-center justify-center rounded-lg text-xs font-semibold ring-1 ring-transparent transition ring-inset",
                "has-focus-visible:outline-2 has-focus-visible:outline-brand",
                selected === opt.value ? opt.active : "text-muted hover:text-ink",
              )}
            >
              <input
                type="radio"
                name="status"
                value={opt.value}
                checked={selected === opt.value}
                onChange={() => setSelected(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {proofHref && (
        <a
          href={proofHref}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 truncate text-sm font-semibold text-sky hover:underline"
        >
          <Paperclip className="size-4 shrink-0" aria-hidden /> View uploaded proof
        </a>
      )}

      <div
        className={cn(
          "relative flex items-center gap-3 rounded-xl border border-dashed px-3 py-2.5 text-sm transition",
          fileName ? "border-brand/50 bg-brand-soft" : "border-line-strong hover:border-brand/50 hover:bg-surface-2",
        )}
      >
        <FileUp className={cn("size-4 shrink-0", fileName ? "text-brand" : "text-muted")} aria-hidden />
        <span className={cn("min-w-0 flex-1 truncate", fileName ? "text-ink" : "text-muted")}>
          {fileName ?? (proofFile ? "Replace proof (image or PDF)" : "Upload proof (image or PDF)")}
        </span>
        {fileName && (
          <button
            type="button"
            onClick={() => {
              if (fileRef.current) fileRef.current.value = "";
              setFileName(null);
            }}
            className="relative z-10 rounded p-0.5 text-muted hover:text-ink cursor-pointer"
            aria-label="Remove selected file"
          >
            <X className="size-4" />
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          name="proof"
          accept="image/png,image/jpeg,image/gif,image/webp,application/pdf"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          className={cn("absolute inset-0 cursor-pointer opacity-0", fileName && "right-10")}
          aria-label="Upload proof"
        />
      </div>

      {state.message && <Alert tone={state.ok ? "success" : "error"}>{state.message}</Alert>}

      {selected === "completed" && status !== "completed" ? (
        <SubmitButton className="w-full" pendingText="Saving…">
          <Check className="size-4" aria-hidden />
          Mark as completed
        </SubmitButton>
      ) : (
        <SubmitButton variant="secondary" className="w-full" pendingText="Saving…">
          <Save className="size-4" aria-hidden />
          {selected === status ? "Save changes" : "Save progress"}
        </SubmitButton>
      )}
    </form>
  );
}
