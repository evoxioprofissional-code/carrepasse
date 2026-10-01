import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminUsers } from "@/components/admin/AdminUsers";

export const metadata: Metadata = { title: "Usuários", robots: { index: false } };

export default function UsersPage() {
  return (
    <Suspense>
      <AdminUsers />
    </Suspense>
  );
}
