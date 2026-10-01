import type { Metadata } from "next";
import { AdminRevenue } from "@/components/admin/AdminRevenue";

export const metadata: Metadata = { title: "Faturamento", robots: { index: false } };

export default function RevenuePage() {
  return <AdminRevenue />;
}
