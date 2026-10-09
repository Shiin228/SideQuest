import type { Metadata } from "next";
import { registerFreelancer } from "@/actions/auth";
import { PersonForm } from "../person-form";
import { LoginLink, RegisterHeader } from "../register-header";

export const metadata: Metadata = { title: "Freelancer registration" };

export default function FreelancerRegisterPage() {
  return (
    <div className="w-full max-w-2xl animate-fade-up">
      <RegisterHeader title="Join as a freelancer" subtitle="Create your adventurer profile and start taking on quests." />
      <div className="card p-6 sm:p-8">
        <PersonForm action={registerFreelancer} submitLabel="Create freelancer account" />
      </div>
      <LoginLink />
    </div>
  );
}
