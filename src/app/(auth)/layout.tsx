import { Coins, ScrollText, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";

const perks = [
  { icon: ScrollText, title: "Post quests in seconds", text: "Describe the task, set a deadline and a reward." },
  { icon: Coins, title: "Earn for your skills", text: "Adventurers pick up quests that match what they do best." },
  { icon: ShieldCheck, title: "Proof on delivery", text: "Freelancers upload proof so clients see the work done." },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden border-r border-line lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_28rem_at_20%_20%,#88b64933,transparent_60%),radial-gradient(30rem_20rem_at_90%_90%,#6cc4ff1a,transparent_60%)]"
        />
        <Link href="/login" className="w-fit">
          <Logo />
        </Link>

        <div className="max-w-md">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3 py-1 text-xs font-semibold tracking-wide text-brand-strong uppercase">
            The guild board
          </p>
          <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight text-balance">
            Every task is a <span className="text-brand">quest</span>. Every freelancer, an adventurer.
          </h1>
          <ul className="mt-10 space-y-5">
            {perks.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-brand">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="text-sm text-muted">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-faint">SideQuest · AppDev Finals by JimmyFurryBabies</p>
      </aside>

      <main className="flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <Link href="/login" className="mb-8 lg:hidden">
          <Logo />
        </Link>
        {children}
      </main>
    </div>
  );
}
