"use client";

import { Plus, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { createQuest } from "@/actions/quests";
import { Alert } from "@/components/ui/alert";
import { Button, SubmitButton } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TextAreaField, TextField } from "@/components/ui/field";
import { useFormAction } from "@/components/ui/use-form-action";
import { toDateKey, todayDateOnly } from "@/lib/format";

export function PostQuestButton({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 4000);
    return () => clearTimeout(t);
  }, [flash]);

  return (
    <>
      <Button size="lg" onClick={() => setOpen(true)}>
        <Plus className="size-5" aria-hidden />
        Post a quest
      </Button>

      {flash && (
        <div className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-sm md:bottom-6">
          <Alert tone="success" className="shadow-2xl backdrop-blur">
            {flash}
          </Alert>
        </div>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} title="Post a new quest" description="Adventurers will see it on the board right away.">
        <QuestForm
          onPosted={(message) => {
            setOpen(false);
            setFlash(message);
          }}
        />
      </Dialog>
    </>
  );
}

function QuestForm({ onPosted }: { onPosted: (message: string) => void }) {
  const { state, formAction, values, errors } = useFormAction(createQuest);

  useEffect(() => {
    if (state.ok && state.message) onPosted(state.message);
    // Only react to new results from the server.
  }, [state.nonce]);

  const keep = state.ok ? {} : values;

  return (
    <form action={formAction} key={state.nonce} className="flex flex-col gap-4">
      {state.message && !state.ok && <Alert tone="error">{state.message}</Alert>}
      <TextField label="Quest name" name="title" maxLength={100} placeholder="e.g. Design a logo for my café" defaultValue={keep.title} error={errors.title} autoFocus />
      <TextAreaField
        label="Description"
        name="description"
        rows={5}
        placeholder="What needs to be done? Include how the adventurer should reach you."
        defaultValue={keep.description}
        error={errors.description}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Deadline" name="deadline" type="date" min={toDateKey(todayDateOnly())} defaultValue={keep.deadline} error={errors.deadline} />
        <TextField
          label="Reward (₱)"
          name="reward"
          type="number"
          inputMode="decimal"
          min="1"
          step="0.01"
          placeholder="500.00"
          defaultValue={keep.reward}
          error={errors.reward}
        />
      </div>
      <SubmitButton size="lg" className="mt-2 w-full" pendingText="Posting…">
        <Send className="size-4" aria-hidden />
        Post quest
      </SubmitButton>
    </form>
  );
}
