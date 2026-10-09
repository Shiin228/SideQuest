import "server-only";
import { sql } from "./db";
import type { Role } from "./session-token";

export type UserRow = {
  id: number;
  username: string;
  email: string;
  role: Role;
  created_at: string;
};

type PersonDetails = {
  firstname: string;
  middlename: string | null;
  lastname: string;
  phone: string | null;
  dob: string | null;
  address: string | null;
};

type BusinessDetails = {
  business_name: string;
  phone: string | null;
  address: string | null;
};

export type ProfileDetails = ({ kind: "person" } & PersonDetails) | ({ kind: "business" } & BusinessDetails);

export async function getUser(id: number) {
  const [user] = await sql<UserRow[]>`SELECT id, username, email, role, created_at FROM users WHERE id = ${id}`;
  return user ?? null;
}

export async function getProfileDetails(user: UserRow): Promise<ProfileDetails | null> {
  const person = async (table: "freelancers" | "individual_clients") => {
    const [row] = await sql<PersonDetails[]>`
      SELECT firstname, middlename, lastname, phone, dob, address FROM ${sql(table)} WHERE user_id = ${user.id} LIMIT 1`;
    return row ? ({ kind: "person", ...row } as const) : null;
  };

  if (user.role === "freelancer") return person("freelancers");

  const individual = await person("individual_clients");
  if (individual) return individual;

  const [business] = await sql<BusinessDetails[]>`
    SELECT business_name, phone, address FROM businesses WHERE user_id = ${user.id} LIMIT 1`;
  return business ? { kind: "business", ...business } : null;
}
