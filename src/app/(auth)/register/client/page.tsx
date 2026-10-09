import type { Metadata } from "next";
import { LoginLink, RegisterHeader } from "../register-header";
import { ClientRegistration } from "./client-registration";

export const metadata: Metadata = { title: "Client registration" };

export default function ClientRegisterPage() {
  return (
    <div className="w-full max-w-2xl animate-fade-up">
      <RegisterHeader title="Join as a client" subtitle="Post quests and hire adventurers as an individual or a business." />
      <ClientRegistration />
      <LoginLink />
    </div>
  );
}
