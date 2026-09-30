import type { Metadata } from "next";
import { CreateListingSection } from "@/components/forms/wizard/CreateListingSection";

export const metadata: Metadata = {
  title: "Anunciar grátis",
  description: "Digite a placa, descreva o carro e publique grátis no Car Repasse.",
  robots: { index: false },
};

export default function CreateListingPage() {
  return <CreateListingSection />;
}
