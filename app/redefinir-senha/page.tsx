import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Nova senha", robots: { index: false } };

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
