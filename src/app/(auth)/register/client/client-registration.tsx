"use client";

import { Building2, Store, User } from "lucide-react";
import { useState } from "react";
import { registerBusiness, registerIndividualClient } from "@/actions/auth";
import { Alert } from "@/components/ui/alert";
import { SubmitButton } from "@/components/ui/button";
import { TextAreaField, TextField } from "@/components/ui/field";
import { useFormAction } from "@/components/ui/use-form-action";
import { cn } from "@/lib/cn";
import { PersonForm } from "../person-form";

const tabs = [
  { id: "individual", label: "Individual", icon: User },
  { id: "business", label: "Business", icon: Building2 },
] as const;

export function ClientRegistration() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("individual");

  return (
    <div className="card p-6 sm:p-8">
      <div role="tablist" aria-label="Client type" className="mb-7 grid grid-cols-2 gap-1 rounded-xl border border-line bg-surface-2 p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition cursor-pointer",
              tab === id ? "bg-brand text-brand-ink shadow" : "text-muted hover:text-ink",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      {tab === "individual" ? (
        <PersonForm action={registerIndividualClient} submitLabel="Create client account" />
      ) : (
        <BusinessForm />
      )}
    </div>
  );
}

function BusinessForm() {
  const { state, formAction, values, errors } = useFormAction(registerBusiness);

  return (
    <form action={formAction} key={state.nonce} className="flex flex-col gap-5">
      {state.message && !state.ok && <Alert tone="error">{state.message}</Alert>}

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-3 text-xs font-semibold tracking-wider text-muted uppercase">Business account</legend>
        <TextField
          label="Business name"
          name="business_name"
          autoComplete="organization"
          hint="You'll log in with this name or your email"
          defaultValue={values.business_name}
          error={errors.business_name}
          className="sm:col-span-2"
        />
        <TextField label="Email" name="email" type="email" autoComplete="email" defaultValue={values.email} error={errors.email} />
        <TextField label="Password" name="password" type="password" autoComplete="new-password" minLength={8} hint="At least 8 characters" error={errors.password} />
      </fieldset>

      <fieldset className="grid gap-4">
        <legend className="mb-3 text-xs font-semibold tracking-wider text-muted uppercase">Contact</legend>
        <TextField label="Phone number" name="phone" type="tel" autoComplete="tel" defaultValue={values.phone} error={errors.phone} />
        <TextAreaField label="Business address" name="address" rows={3} autoComplete="street-address" defaultValue={values.address} error={errors.address} />
      </fieldset>

      <SubmitButton size="lg" className="w-full" pendingText="Creating account…">
        <Store className="size-4" aria-hidden />
        Create business account
      </SubmitButton>
    </form>
  );
}
