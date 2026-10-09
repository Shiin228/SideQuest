import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-brand text-brand-ink hover:bg-brand-strong shadow-[0_8px_24px_-10px_#88b649aa] disabled:hover:bg-brand",
  secondary: "bg-surface-3 text-ink border border-line-strong hover:bg-surface-2 hover:border-faint",
  ghost: "text-ink-soft hover:text-ink hover:bg-surface-3",
  outline: "border border-line-strong text-ink hover:border-brand hover:text-brand-strong",
} as const;

const sizes = {
  sm: "h-9 px-3 text-sm gap-1.5 rounded-lg",
  md: "h-11 px-4 text-[0.95rem] gap-2 rounded-xl",
  lg: "h-12 px-5 text-base gap-2 rounded-xl",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra?: string) {
  return cn(
    "inline-flex items-center justify-center font-semibold whitespace-nowrap transition select-none cursor-pointer",
    "disabled:opacity-60 disabled:cursor-not-allowed active:translate-y-px",
    variants[variant],
    sizes[size],
    extra,
  );
}
