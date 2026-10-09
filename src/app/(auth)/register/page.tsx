import { ArrowRight, Compass, Crown } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Choose your role" };

const roles = [
  {
    href: "/register/freelancer",
    icon: Compass,
    title: "Freelancer",
    tagline: "Adventurer",
    text: "Find quests that fit your skills, deliver proof, and earn rewards.",
  },
  {
    href: "/register/client",
    icon: Crown,
    title: "Client",
    tagline: "Guildmaster",
    text: "Post quests for individuals or your business and track every mission.",
  },
];

export default function ChooseRolePage() {
  return (
    <div className="w-full max-w-xl animate-fade-up">
      <h1 className="font-display text-3xl font-bold tracking-tight">Choose your role</h1>
      <p className="mt-2 text-muted">How will you use SideQuest?</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {roles.map(({ href, icon: Icon, title, tagline, text }) => (
          <Link
            key={href}
            href={href}
            className="card group flex flex-col p-6 transition hover:-translate-y-1 hover:border-brand/50 hover:bg-surface-2"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand ring-1 ring-brand/25 transition group-hover:bg-brand group-hover:text-brand-ink">
              <Icon className="size-6" aria-hidden />
            </span>
            <span className="mt-5 text-xs font-semibold tracking-wider text-muted uppercase">{tagline}</span>
            <span className="font-display text-2xl font-semibold">{title}</span>
            <span className="mt-2 flex-1 text-sm text-muted">{text}</span>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
              Continue <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand hover:text-brand-strong hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
