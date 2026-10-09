const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});

export function formatReward(amount: number) {
  return peso.format(amount);
}

/** Parses a MySQL DATE ("YYYY-MM-DD") as a local calendar date. */
export function parseDateOnly(value: string) {
  const [y, m, d] = value.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Formats a MySQL DATE or TIMESTAMP string by its calendar date (as shown by the database). */
export function formatDate(value: string) {
  return parseDateOnly(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function toDateKey(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export function todayDateOnly() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function daysUntil(deadline: string) {
  const ms = parseDateOnly(deadline).getTime() - todayDateOnly().getTime();
  return Math.round(ms / 86_400_000);
}

export function deadlineLabel(deadline: string) {
  const days = daysUntil(deadline);
  if (days < 0) return { text: `${-days}d overdue`, tone: "danger" as const };
  if (days === 0) return { text: "Due today", tone: "warning" as const };
  if (days === 1) return { text: "Due tomorrow", tone: "warning" as const };
  if (days <= 3) return { text: `${days} days left`, tone: "warning" as const };
  return { text: `${days} days left`, tone: "muted" as const };
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
