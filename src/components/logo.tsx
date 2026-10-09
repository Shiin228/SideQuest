import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("size-9", className)} aria-hidden>
      <defs>
        <linearGradient id="sq-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a3d063" />
          <stop offset="1" stopColor="#5e8a2a" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#sq-logo)" />
      <path
        d="M20 46V18m0 0h20l-5 7 5 7H20"
        fill="none"
        stroke="#0d1606"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="44" cy="44" r="4" fill="#0d1606" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-xl font-bold tracking-tight">
        Side<span className="text-brand">Quest</span>
      </span>
    </span>
  );
}
