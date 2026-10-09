"use client";

import { UserPlus } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { SubmitButton } from "@/components/ui/button";
import { TextAreaField, TextField } from "@/components/ui/field";
import { useFormAction } from "@/components/ui/use-form-action";
import type { FormState } from "@/lib/form-state";

/** Personal details form shared by freelancers and individual clients. */
export function PersonForm({
  action,
  submitLabel,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
}) {
  const { state, formAction, values, errors } = useFormAction(action);

  return (
    <form action={formAction} key={state.nonce} className="flex flex-col gap-5">
      {state.message && !state.ok && <Alert tone="error">{state.message}</Alert>}

      <fieldset className="grid gap-4 sm:grid-cols-3">
        <legend className="mb-3 text-xs font-semibold tracking-wider text-muted uppercase">Your name</legend>
        <TextField label="First name" name="firstname" autoComplete="given-name" defaultValue={values.firstname} error={errors.firstname} />
        <TextField label="Middle name" name="middlename" autoComplete="additional-name" optional defaultValue={values.middlename} error={errors.middlename} />
        <TextField label="Last name" name="lastname" autoComplete="family-name" defaultValue={values.lastname} error={errors.lastname} />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-3 text-xs font-semibold tracking-wider text-muted uppercase">Account</legend>
        <TextField label="Username" name="username" autoComplete="username" defaultValue={values.username} error={errors.username} />
        <TextField label="Email" name="email" type="email" autoComplete="email" defaultValue={values.email} error={errors.email} />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          hint="At least 8 characters"
          error={errors.password}
          className="sm:col-span-2"
        />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-3 text-xs font-semibold tracking-wider text-muted uppercase">Contact</legend>
        <TextField label="Phone number" name="phone" type="tel" autoComplete="tel" placeholder="09XX XXX XXXX" defaultValue={values.phone} error={errors.phone} />
        <TextField label="Date of birth" name="dob" type="date" autoComplete="bday" defaultValue={values.dob} error={errors.dob} />
        <TextAreaField label="Address" name="address" rows={3} autoComplete="street-address" defaultValue={values.address} error={errors.address} className="sm:col-span-2" />
      </fieldset>

      <SubmitButton size="lg" className="w-full" pendingText="Creating account…">
        <UserPlus className="size-4" aria-hidden />
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
