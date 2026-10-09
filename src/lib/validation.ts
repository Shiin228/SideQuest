import { z } from "zod";
import { toDateKey, todayDateOnly } from "./format";
import type { FormState } from "./form-state";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or fewer`)
    .transform((v) => (v === "" ? null : v));

const dateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date");

export const usernameField = z
  .string()
  .trim()
  .min(3, "At least 3 characters")
  .max(50, "50 characters or fewer");

export const emailField = z.string().trim().max(100, "100 characters or fewer").pipe(z.email("Enter a valid email"));

export const passwordField = z
  .string()
  .min(8, "At least 8 characters")
  .max(72, "72 characters or fewer");

export const phoneField = z
  .string()
  .trim()
  .regex(/^[0-9+()\-\s]{7,20}$/, "Enter a valid phone number");

export const addressField = z.string().trim().min(1, "Address is required").max(500, "500 characters or fewer");

export const personSchema = z.object({
  firstname: z.string().trim().min(1, "First name is required").max(100),
  middlename: optionalText(100),
  lastname: z.string().trim().min(1, "Last name is required").max(100),
  username: usernameField,
  email: emailField,
  password: passwordField,
  phone: phoneField,
  dob: dateKey.refine((v) => v < toDateKey(todayDateOnly()), "Birthday must be in the past"),
  address: addressField,
});

export const businessSchema = z.object({
  // The business name doubles as the login username, so it shares the 50-character limit.
  business_name: z.string().trim().min(2, "Business name is required").max(50, "50 characters or fewer"),
  email: emailField,
  password: passwordField,
  phone: phoneField,
  address: addressField,
});

export const questSchema = z.object({
  title: z.string().trim().min(3, "Give your quest a name").max(100, "100 characters or fewer"),
  description: z.string().trim().min(1, "Describe the quest").max(5000, "5000 characters or fewer"),
  deadline: dateKey.refine((v) => v >= toDateKey(todayDateOnly()), "Deadline can't be in the past"),
  reward: z.coerce
    .number({ error: "Enter a reward amount" })
    .positive("Reward must be more than ₱0")
    .max(99_999_999.99, "That reward is too large"),
});

export const statusSchema = z.enum(["accepted", "in_progress", "completed"]);

export function fieldErrorsOf(error: z.ZodError): FormState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    fieldErrors[key] ??= issue.message;
  }
  return { ok: false, message: "Please fix the highlighted fields.", fieldErrors, nonce: Date.now() };
}
