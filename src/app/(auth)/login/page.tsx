import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm animate-fade-up">
      <h1 className="font-display text-3xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-muted">Log in to check the board for new quests.</p>
      <LoginForm />
      <p className="mt-8 text-center text-sm text-muted">
        New to SideQuest?{" "}
        <Link href="/register" className="font-semibold text-brand hover:text-brand-strong hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
