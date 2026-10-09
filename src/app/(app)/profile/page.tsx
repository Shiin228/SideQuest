import { Building2, Cake, CalendarDays, Hash, Mail, MapPin, Phone, UserRound } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate, initials } from "@/lib/format";
import { requireSession } from "@/lib/session";
import { getProfileDetails, getUser } from "@/lib/users";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await requireSession();
  const user = await getUser(session.userId);
  if (!user) redirect("/login");
  const details = await getProfileDetails(user);

  const displayName =
    details?.kind === "person"
      ? [details.firstname, details.middlename, details.lastname].filter(Boolean).join(" ")
      : details?.kind === "business"
        ? details.business_name
        : user.username;

  const isClient = user.role === "client";
  const account = [
    { icon: Hash, label: "User ID", value: `#${user.id}` },
    { icon: UserRound, label: "Username", value: user.username },
    { icon: Mail, label: "Email", value: user.email },
    { icon: CalendarDays, label: "Member since", value: formatDate(user.created_at) },
  ];
  const contact = [
    details?.kind === "business" && { icon: Building2, label: "Business name", value: details.business_name },
    { icon: Phone, label: "Phone", value: details?.phone },
    details?.kind === "person" && { icon: Cake, label: "Date of birth", value: details.dob ? formatDate(details.dob) : null },
    { icon: MapPin, label: "Address", value: details?.address, wide: true },
  ].filter(Boolean) as { icon: React.ComponentType<{ className?: string }>; label: string; value?: string | null; wide?: boolean }[];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <section className="card relative overflow-hidden p-6 sm:p-8">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(30rem_10rem_at_20%_0%,#88b64944,transparent_70%)]"
        />
        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-brand-strong to-[#5e8a2a] font-display text-2xl font-bold text-brand-ink shadow-[0_12px_30px_-12px_#88b649]">
            {initials(displayName)}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-bold tracking-tight">{displayName}</h1>
              <Badge tone={isClient ? "accepted" : "completed"}>
                {isClient ? (details?.kind === "business" ? "Business client" : "Client") : "Freelancer"}
              </Badge>
            </div>
            <p className="mt-1 text-muted">
              @{user.username} · {isClient ? "Guildmaster" : "Adventurer"} profile
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <InfoCard title="Account" rows={account} />
        <InfoCard title="Contact details" rows={contact} />
      </div>
    </div>
  );
}

function InfoCard({
  title,
  rows,
}: {
  title: string;
  rows: { icon: React.ComponentType<{ className?: string }>; label: string; value?: string | null; wide?: boolean }[];
}) {
  return (
    <section className="card p-6">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <dl className="mt-4 divide-y divide-line">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-surface-3 text-muted">
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <dt className="text-xs text-muted">{label}</dt>
              <dd className={value ? "break-words whitespace-pre-line" : "text-faint italic"}>{value || "Not provided"}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
