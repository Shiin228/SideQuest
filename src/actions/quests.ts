"use server";

import { revalidatePath } from "next/cache";
import { isDuplicateEntry, sql } from "@/lib/db";
import type { FormState } from "@/lib/form-state";
import { requireSession } from "@/lib/session";
import { MAX_PROOF_BYTES, proofContentType, saveProof } from "@/lib/uploads";
import { fieldErrorsOf, questSchema, statusSchema } from "@/lib/validation";

const done = (message: string): FormState => ({ ok: true, message, nonce: Date.now() });
const fail = (message: string): FormState => ({ ok: false, message, nonce: Date.now() });

function revalidateBoards() {
  revalidatePath("/freelancer");
  revalidatePath("/client");
  revalidatePath("/calendar");
}

export async function createQuest(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession("client");
  const parsed = questSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fieldErrorsOf(parsed.error);
  const { title, description, deadline, reward } = parsed.data;

  await sql`
    INSERT INTO quests (title, description, posted_by, deadline, reward)
    VALUES (${title}, ${description}, ${session.userId}, ${deadline}, ${reward})`;

  revalidateBoards();
  return done("Quest posted to the board!");
}

export async function acceptQuest(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession("freelancer");
  const questId = Number(formData.get("questId"));
  if (!Number.isInteger(questId) || questId <= 0) return fail("Unknown quest.");

  let result: FormState;
  try {
    result = await sql.begin(async (tx) => {
      // Lock the quest row so two freelancers can't grab it at the same moment.
      const quest = await tx`SELECT id FROM quests WHERE id = ${questId} FOR UPDATE`;
      if (quest.length === 0) return fail("That quest no longer exists.");

      const taken = await tx`SELECT 1 FROM quest_assignments WHERE quest_id = ${questId} LIMIT 1`;
      if (taken.length > 0) return fail("Another adventurer already accepted this quest.");

      await tx`
        INSERT INTO quest_assignments (quest_id, freelancer_id, status)
        VALUES (${questId}, ${session.userId}, 'accepted')`;
      await tx`UPDATE quests SET status = 'in_progress' WHERE id = ${questId}`;
      return done("Quest accepted — it's now in your quest log.");
    });
  } catch (err) {
    // The unique quest_id constraint is the last line of defence against a double accept.
    if (isDuplicateEntry(err)) return fail("Another adventurer already accepted this quest.");
    throw err;
  }

  revalidateBoards();
  return result;
}

export async function updateQuestProgress(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession("freelancer");
  const questId = Number(formData.get("questId"));
  const status = statusSchema.safeParse(formData.get("status"));
  if (!Number.isInteger(questId) || questId <= 0) return fail("Unknown quest.");
  if (!status.success) return fail("Pick a status.");

  const owned = await sql`
    SELECT 1 FROM quest_assignments WHERE quest_id = ${questId} AND freelancer_id = ${session.userId} LIMIT 1`;
  if (owned.length === 0) return fail("You haven't accepted that quest.");

  const proof = formData.get("proof");
  let proofPath: string | null = null;
  if (proof instanceof File && proof.size > 0) {
    if (proof.size > MAX_PROOF_BYTES) return fail("Proof files must be 10 MB or smaller.");
    if (!proofContentType(proof.name)) return fail("Upload an image (PNG, JPG, GIF, WEBP) or a PDF.");
    try {
      proofPath = await saveProof(proof);
    } catch (err) {
      console.error(err);
      return fail("Couldn't upload the proof file. Please try again.");
    }
  }

  await sql.begin(async (tx) => {
    if (proofPath) {
      await tx`
        UPDATE quest_assignments SET status = ${status.data}, proof_file = ${proofPath}
         WHERE quest_id = ${questId} AND freelancer_id = ${session.userId}`;
    } else {
      await tx`
        UPDATE quest_assignments SET status = ${status.data}
         WHERE quest_id = ${questId} AND freelancer_id = ${session.userId}`;
    }
    await tx`
      UPDATE quests SET status = ${status.data === "completed" ? "completed" : "in_progress"}
       WHERE id = ${questId}`;
  });

  revalidateBoards();
  return done(proofPath ? "Progress saved and proof uploaded." : "Progress saved.");
}
