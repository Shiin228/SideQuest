import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  homeFor,
  signSession,
  verifySession,
  type Role,
  type SessionPayload,
} from "./session-token";

export async function createSession(payload: SessionPayload) {
  const token = await signSession(payload);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value);
});

/** Use at the top of protected pages and actions. Redirects when signed out or on the wrong side. */
export async function requireSession(role?: Role): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (role && session.role !== role) redirect(homeFor(session.role));
  return session;
}
