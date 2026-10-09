import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function RegisterHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <Link href="/register" className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> Change role
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted">{subtitle}</p>
    </div>
  );
}

export function LoginLink() {
  return (
    <p className="mt-8 text-center text-sm text-muted">
      Already have an account?{" "}
      <Link href="/login" className="font-semibold text-brand hover:text-brand-strong hover:underline">
        Log in
      </Link>
    </p>
  );
}
