"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { isDuplicateEntry, sql } from "@/lib/db";
import type { FormState } from "@/lib/form-state";
import { createSession, destroySession } from "@/lib/session";
import { homeFor, type Role } from "@/lib/session-token";
import { businessSchema, fieldErrorsOf, personSchema } from "@/lib/validation";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function duplicateMessage(err: { constraint_name?: string }): FormState {
  const isEmail = err.constraint_name?.includes("email");
  return {
    ok: false,
    message: isEmail ? "That email is already registered." : "That username is already taken.",
    fieldErrors: isEmail ? { email: "Already registered" } : { username: "Already taken", business_name: "Already taken" },
    nonce: Date.now(),
  };
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const identifier = text(formData, "username").trim();
  const password = text(formData, "password");

  if (!identifier || !password) {
    return { ok: false, message: "Enter your username and password.", nonce: Date.now() };
  }

  const [user] = await sql<{ id: number; username: string; password_hash: string; role: Role }[]>`
    SELECT id, username, password_hash, role FROM users
     WHERE lower(username) = lower(${identifier}) OR lower(email) = lower(${identifier})
     LIMIT 1`;

  // Accounts created by the old PHP site use the "$2y$" bcrypt prefix, which is the same algorithm as "$2b$".
  const hash = user?.password_hash.replace(/^\$2y\$/, "$2b$");
  const valid = hash ? await bcrypt.compare(password, hash) : false;

  if (!user || !valid) {
    return { ok: false, message: "Invalid username or password.", nonce: Date.now() };
  }

  await createSession({ userId: user.id, username: user.username, role: user.role });
  redirect(homeFor(user.role));
}

export async function registerFreelancer(prev: FormState, formData: FormData) {
  return registerPerson("freelancer", prev, formData);
}

export async function registerIndividualClient(prev: FormState, formData: FormData) {
  return registerPerson("client", prev, formData);
}

async function registerPerson(role: Role, _prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = personSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fieldErrorsOf(parsed.error);
  const data = parsed.data;
  const table = role === "freelancer" ? "freelancers" : "individual_clients";

  let userId: number;
  try {
    const passwordHash = await bcrypt.hash(data.password, 10);
    userId = await sql.begin(async (tx) => {
      const [user] = await tx<{ id: number }[]>`
        INSERT INTO users (username, email, password_hash, role)
        VALUES (${data.username}, ${data.email}, ${passwordHash}, ${role})
        RETURNING id`;
      await tx`
        INSERT INTO ${tx(table)} (user_id, firstname, middlename, lastname, phone, dob, address)
        VALUES (${user.id}, ${data.firstname}, ${data.middlename}, ${data.lastname}, ${data.phone}, ${data.dob}, ${data.address})`;
      return user.id;
    });
  } catch (err) {
    if (isDuplicateEntry(err)) return duplicateMessage(err);
    console.error("Registration failed", err);
    return { ok: false, message: "Something went wrong. Please try again.", nonce: Date.now() };
  }

  await createSession({ userId, username: data.username, role });
  redirect(homeFor(role));
}

export async function registerBusiness(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = businessSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fieldErrorsOf(parsed.error);
  const data = parsed.data;

  let userId: number;
  try {
    const passwordHash = await bcrypt.hash(data.password, 10);
    userId = await sql.begin(async (tx) => {
      const [user] = await tx<{ id: number }[]>`
        INSERT INTO users (username, email, password_hash, role)
        VALUES (${data.business_name}, ${data.email}, ${passwordHash}, 'client')
        RETURNING id`;
      await tx`
        INSERT INTO businesses (user_id, business_name, phone, address)
        VALUES (${user.id}, ${data.business_name}, ${data.phone}, ${data.address})`;
      return user.id;
    });
  } catch (err) {
    if (isDuplicateEntry(err)) return duplicateMessage(err);
    console.error("Business registration failed", err);
    return { ok: false, message: "Something went wrong. Please try again.", nonce: Date.now() };
  }

  await createSession({ userId, username: data.business_name, role: "client" });
  redirect("/client");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
