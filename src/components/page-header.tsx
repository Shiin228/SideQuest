"use client";

import { useEffect, useState } from "react";

/** Page heading with the typewriter greeting carried over from the original SideQuest header. */
export function PageHeader({
  greeting,
  title,
  description,
  actions,
}: {
  greeting?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!greeting) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(greeting.slice(0, i));
      if (i >= greeting.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [greeting]);

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {greeting && (
          <p className="mb-2 h-6 font-mono text-sm text-brand" aria-label={greeting}>
            <span aria-hidden>
              {typed}
              <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-brand animate-caret" />
            </span>
          </p>
        )}
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-3 text-ink-soft/80 text-balance">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 gap-3">{actions}</div>}
    </div>
  );
}
