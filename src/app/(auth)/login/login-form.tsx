"use client";

import { LogIn } from "lucide-react";
import { login } from "@/actions/auth";
import { Alert } from "@/components/ui/alert";
import { SubmitButton } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { useFormAction } from "@/components/ui/use-form-action";

export function LoginForm() {
  const { state, formAction, values } = useFormAction(login);

  return (
    <form action={formAction} key={state.nonce} className="mt-8 flex flex-col gap-4">
      {state.message && <Alert tone="error">{state.message}</Alert>}
      <TextField label="Username or email" name="username" autoComplete="username" autoFocus={!values.username} defaultValue={values.username} />
      <TextField label="Password" name="password" type="password" autoComplete="current-password" autoFocus={!!values.username} />
      <SubmitButton size="lg" className="mt-2 w-full" pendingText="Logging in…">
        <LogIn className="size-4" aria-hidden />
        Log in
      </SubmitButton>
    </form>
  );
}
