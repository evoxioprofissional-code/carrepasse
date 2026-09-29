import type { Metadata } from "next";
import { ListingDetail } from "@/components/listing/ListingDetail";
import { compareWithFipe, mainPrice } from "@/lib/fipe-math";
import { formatBRL, formatKm } from "@/lib/format";
import { getSeedListing, getSeedListingIds } from "@/repositories/seedSnapshot";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Anúncios de demonstração são pré-gerados; os criados no navegador
// abrem sob demanda (dados vêm do localStorage, no cliente).
export function generateStaticParams() {
  return getSeedListingIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = getSeedListing(id);

  if (!listing) {
    return {
      title: "Anúncio",
      description: "Veja este carro no Car Repasse: FIPE e estado real em todo anúncio.",
    };
  }

  const price = mainPrice(listing);
  const comparison = compareWithFipe(listing.fipePrice, price);
  const discount = comparison.kind === "below" ? ` (${comparison.percent}% abaixo da FIPE)` : "";
  const title = `${listing.brand} ${listing.model} ${listing.modelYear} por ${formatBRL(price)}${discount}`;
  const description = `${listing.version} · ${formatKm(listing.km)} · ${listing.city}/${listing.state}. FIPE ${formatBRL(listing.fipePrice)}. ${listing.description.slice(0, 110)}…`;

  return {
    title,
    description,
    alternates: { canonical: `/carros/${listing.id}` },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "pt_BR",
      siteName: "Car Repasse",
      url: `/carros/${listing.id}`,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;
  return <ListingDetail id={id} />;
}
