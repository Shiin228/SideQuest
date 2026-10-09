export type FormState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Changes on every submit so client components can react to repeated results. */
  nonce?: number;
};

export const initialFormState: FormState = {};
