import type { Metadata } from "next";
import { EditListingSection } from "@/components/forms/wizard/EditListingSection";

export const metadata: Metadata = { title: "Editar anúncio", robots: { index: false } };

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditListingSection id={id} />;
}
