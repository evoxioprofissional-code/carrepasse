import type { Metadata } from "next";
import { MyListingsSection } from "@/components/account/MyListingsSection";

export const metadata: Metadata = { title: "Meus anúncios", robots: { index: false } };

export default function MyListingsPage() {
  return <MyListingsSection />;
}
