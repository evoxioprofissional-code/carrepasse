import type { Metadata } from "next";
import { FavoritesSection } from "@/components/account/FavoritesSection";

export const metadata: Metadata = { title: "Favoritos", robots: { index: false } };

export default function FavoritesPage() {
  return <FavoritesSection />;
}
