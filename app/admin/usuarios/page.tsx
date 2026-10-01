import type { Metadata } from "next";
import { AdminUsers } from "@/components/admin/AdminUsers";

export const metadata: Metadata = { title: "Usuários", robots: { index: false } };

export default function UsersPage() {
  return <AdminUsers />;
}
