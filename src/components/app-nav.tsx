"use client";

import { CalendarDays, LayoutGrid, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";
import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";
import type { Role } from "@/lib/session-token";
import { LogoMark } from "./logo";

export function AppNav({ username, role }: { username: string; role: Role }) {
  const pathname = usePathname();
  const links = [
    { href: role === "client" ? "/client" : "/freelancer", label: "Questboard", icon: LayoutGrid },
    { href: "/calendar", label: "Calendar", icon: CalendarDays },
    { href: "/profile", label: "Profile", icon: UserRound },
  ];
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <Link href={links[0].href} className="flex items-center gap-2.5" aria-label="SideQuest home">
            <LogoMark className="size-8" />
            <span className="font-display text-lg font-bold tracking-tight">
              Side<span className="text-brand">Quest</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition",
                  isActive(href) ? "bg-surface-3 text-ink" : "text-muted hover:bg-surface-2 hover:text-ink",
                )}
              >
                <Icon className={cn("size-4", isActive(href) && "text-brand")} aria-hidden />
                {label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right leading-tight sm:block">
              <p className="max-w-40 truncate text-sm font-semibold">{username}</p>
              <p className="text-xs text-muted">{role === "client" ? "Guildmaster" : "Adventurer"}</p>
            </div>
            <span
              className="grid size-9 place-items-center rounded-full bg-linear-to-br from-brand-strong to-[#5e8a2a] text-xs font-bold text-brand-ink ring-2 ring-canvas"
              aria-hidden
            >
              {initials(username)}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="grid size-9 place-items-center rounded-lg text-muted transition hover:bg-surface-3 hover:text-danger cursor-pointer"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="size-4.5" aria-hidden />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Bottom tab bar on phones */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-3">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 py-3 text-[0.7rem] font-semibold transition",
                isActive(href) ? "text-brand" : "text-muted hover:text-ink",
              )}
            >
              <Icon className="size-5" aria-hidden />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
