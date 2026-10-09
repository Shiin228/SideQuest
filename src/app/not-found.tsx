import { MapPinOff } from "lucide-react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button-styles";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-surface-2 text-brand ring-1 ring-line">
        <MapPinOff className="size-7" aria-hidden />
      </span>
      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight">You wandered off the map</h1>
      <p className="mt-2 max-w-md text-muted">This page doesn&apos;t exist. Head back to the board to find your next quest.</p>
      <Link href="/" className={buttonClass("primary", "lg", "mt-8")}>
        Back to the Questboard
      </Link>
    </main>
  );
}
