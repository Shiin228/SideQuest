// Edge-safe session token helpers, shared by the proxy and server code.
import { SignJWT, jwtVerify } from "jose";

export type Role = "client" | "freelancer";

export type SessionPayload = {
  userId: number;
  username: string;
  role: Role;
};

export const SESSION_COOKIE = "sq_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be set in production.");
    }
    return new TextEncoder().encode("sidequest-dev-only-secret-do-not-use-in-production");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    const { userId, username, role } = payload as Partial<SessionPayload>;
    if (typeof userId !== "number" || typeof username !== "string") return null;
    if (role !== "client" && role !== "freelancer") return null;
    return { userId, username, role };
  } catch {
    return null;
  }
}

export function homeFor(role: Role) {
  return role === "client" ? "/client" : "/freelancer";
}
