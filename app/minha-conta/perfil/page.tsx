import type { Metadata } from "next";
import { Suspense } from "react";
import { ProfileSection } from "@/components/account/ProfileSection";

export const metadata: Metadata = { title: "Minha conta", robots: { index: false } };

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileSection />
    </Suspense>
  );
}
