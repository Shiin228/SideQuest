"use client";

import { useActionState, useState } from "react";
import { initialFormState, type FormState } from "@/lib/form-state";

type ServerAction = (prev: FormState, formData: FormData) => Promise<FormState>;

/**
 * useActionState plus the last submitted values, so fields keep what the user typed
 * when the server sends back validation errors (React resets forms after an action).
 */
export function useFormAction(serverAction: ServerAction) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [state, formAction, pending] = useActionState(async (prev: FormState, formData: FormData) => {
    const next: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string" && key !== "password" && !key.startsWith("$")) next[key] = value;
    });
    setValues(next);
    return serverAction(prev, formData);
  }, initialFormState);

  return { state, formAction, pending, values, errors: state.fieldErrors ?? {} };
}
