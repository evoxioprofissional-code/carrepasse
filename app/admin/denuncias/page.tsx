import type { Metadata } from "next";
import { ReportsPanel } from "@/components/admin/ReportsPanel";

export const metadata: Metadata = { title: "Denúncias", robots: { index: false } };

export default function ReportsPage() {
  return <ReportsPanel />;
}
