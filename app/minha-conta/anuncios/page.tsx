import type { Metadata } from "next";
import { Suspense } from "react";
import { MyListingsSection } from "@/components/account/MyListingsSection";

export const metadata: Metadata = { title: "Meus anúncios", robots: { index: false } };

export default function MyListingsPage() {
  // useSearchParams (?salvo=1) exige Suspense.
  return (
    <Suspense>
      <MyListingsSection />
    </Suspense>
  );
}
