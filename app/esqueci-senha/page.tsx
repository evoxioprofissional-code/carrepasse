import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Esqueci minha senha", robots: { index: false } };

export default function ForgotPasswordPage() {
  // useSearchParams (?link=invalido) exige Suspense.
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
