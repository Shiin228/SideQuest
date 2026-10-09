import { CircleAlert, CircleCheck } from "lucide-react";
import { cn } from "@/lib/cn";

export function Alert({ tone, children, className }: { tone: "error" | "success"; children: React.ReactNode; className?: string }) {
  const Icon = tone === "error" ? CircleAlert : CircleCheck;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm animate-fade-up",
        tone === "error" ? "border-danger/30 bg-danger/10 text-danger" : "border-brand/30 bg-brand-soft text-brand-strong",
        className,
      )}
    >
      <Icon className="mt-px size-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </div>
  );
}
