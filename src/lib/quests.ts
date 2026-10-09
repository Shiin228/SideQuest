import "server-only";
import { sql } from "./db";
import type { Role } from "./session-token";

export type AssignmentStatus = "accepted" | "in_progress" | "completed";

export type ClientQuest = {
  id: number;
  title: string;
  description: string | null;
  reward: number;
  deadline: string;
  created_at: string;
  assignment_status: AssignmentStatus | null;
  proof_file: string | null;
  freelancer: string | null;
};

export type OpenQuest = {
  id: number;
  title: string;
  description: string | null;
  reward: number;
  deadline: string;
  created_at: string;
  poster: string;
};

export type AcceptedQuest = OpenQuest & {
  status: AssignmentStatus;
  proof_file: string | null;
  accepted_at: string;
};

export type CalendarQuest = {
  id: number;
  title: string;
  deadline: string;
  reward: number;
  status: AssignmentStatus | null;
};

export function getClientQuests(clientId: number) {
  return sql<ClientQuest[]>`
    SELECT q.id, q.title, q.description, q.reward, q.deadline, q.created_at,
           qa.status AS assignment_status, qa.proof_file, u.username AS freelancer
      FROM quests q
      LEFT JOIN quest_assignments qa ON qa.quest_id = q.id
      LEFT JOIN users u ON u.id = qa.freelancer_id
     WHERE q.posted_by = ${clientId}
     ORDER BY q.created_at DESC, q.id DESC`;
}

/** Quests nobody has taken yet. */
export function getOpenQuests() {
  return sql<OpenQuest[]>`
    SELECT q.id, q.title, q.description, q.reward, q.deadline, q.created_at, u.username AS poster
      FROM quests q
      JOIN users u ON u.id = q.posted_by
     WHERE NOT EXISTS (SELECT 1 FROM quest_assignments qa WHERE qa.quest_id = q.id)
     ORDER BY q.created_at DESC, q.id DESC`;
}

export function getAcceptedQuests(freelancerId: number) {
  return sql<AcceptedQuest[]>`
    SELECT q.id, q.title, q.description, q.reward, q.deadline, q.created_at, u.username AS poster,
           qa.status, qa.proof_file, qa.accepted_at
      FROM quest_assignments qa
      JOIN quests q ON q.id = qa.quest_id
      JOIN users u ON u.id = q.posted_by
     WHERE qa.freelancer_id = ${freelancerId}
     ORDER BY qa.accepted_at DESC, qa.id DESC`;
}

export function getCalendarQuests(userId: number, role: Role) {
  if (role === "client") {
    return sql<CalendarQuest[]>`
      SELECT q.id, q.title, q.deadline, q.reward, qa.status
        FROM quests q
        LEFT JOIN quest_assignments qa ON qa.quest_id = q.id
       WHERE q.posted_by = ${userId}`;
  }
  return sql<CalendarQuest[]>`
    SELECT q.id, q.title, q.deadline, q.reward, qa.status
      FROM quest_assignments qa
      JOIN quests q ON q.id = qa.quest_id
     WHERE qa.freelancer_id = ${userId}`;
}

/** Returns true when the user is allowed to see a proof file: the assigned freelancer or the quest's poster. */
export async function canViewProof(userId: number, proofFile: string) {
  const rows = await sql`
    SELECT 1
      FROM quest_assignments qa
      JOIN quests q ON q.id = qa.quest_id
     WHERE qa.proof_file = ${proofFile} AND (qa.freelancer_id = ${userId} OR q.posted_by = ${userId})
     LIMIT 1`;
  return rows.length > 0;
}
