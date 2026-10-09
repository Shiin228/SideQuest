import "server-only";
import postgres from "postgres";

// Reuse one client across hot reloads in development.
const globalForDb = globalThis as unknown as { sidequestSql?: postgres.Sql };

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url && process.env.NEXT_PHASE !== "phase-production-build") {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local, paste your Supabase connection string, and restart `npm run dev`.",
    );
  }

  return postgres(url ?? "", {
    // Supabase's connection pooler (transaction mode, port 6543) doesn't support prepared statements.
    prepare: false,
    max: 5,
    types: {
      // Return DATE/TIMESTAMP columns as plain strings so deadlines never shift with time zones.
      date: {
        to: 1082,
        from: [1082, 1114, 1184],
        serialize: (x: string) => x,
        parse: (x: string) => x,
      },
      // NUMERIC (quest rewards) as JS numbers instead of strings.
      numeric: {
        to: 1700,
        from: [1700],
        serialize: (x: number) => String(x),
        parse: (x: string) => Number(x),
      },
    },
  });
}

export const sql: postgres.Sql = globalForDb.sidequestSql ?? createClient();

if (process.env.NODE_ENV !== "production") globalForDb.sidequestSql = sql;

/** True for unique-constraint violations (duplicate username, email, or a quest that's already taken). */
export function isDuplicateEntry(err: unknown): err is postgres.PostgresError {
  return err instanceof postgres.PostgresError && err.code === "23505";
}
