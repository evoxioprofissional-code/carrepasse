import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ListingDetail } from "@/components/listing/ListingDetail";
import { compareWithFipe, mainPrice } from "@/lib/fipe-math";
import { formatBRL, formatKm } from "@/lib/format";
import { FUEL_LABEL, TRANSMISSION_LABEL } from "@/lib/labels";
import { isExpired } from "@/lib/listing-expiry";
import { siteUrl } from "@/lib/site-url";
import { getPublicListing, getPublicListingIds } from "@/repositories/serverData";
import type { ListingWithSeller } from "@/types/listing";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Anúncios ativos são pré-gerados no build; os novos abrem sob demanda.
// A página chega pronta (Google lê o conteúdo) e revalida a cada 5 min.
export const revalidate = 300;

export async function generateStaticParams() {
  return (await getPublicListingIds()).map((id) => ({ id }));
}

// Metadados e página usam a mesma consulta (uma ida ao banco por requisição).
const loadListing = cache((id: string) => getPublicListing(id));

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await loadListing(id).catch(() => null);

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
  const available = listing.status === "ativo" && !isExpired(listing);

  return {
    title,
    description,
    alternates: { canonical: `/carros/${listing.id}` },
    // Vendido, pausado ou vencido: a página continua no ar, mas sai do Google.
    robots: available ? undefined : { index: false, follow: true },
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

/** Dados estruturados (schema.org/Car) para resultados ricos no Google. */
function structuredData(listing: ListingWithSeller) {
  const url = new URL(`/carros/${listing.id}`, siteUrl()).toString();
  const photo = listing.photos[0];
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${listing.brand} ${listing.model} ${listing.version}`,
    brand: { "@type": "Brand", name: listing.brand },
    model: listing.model,
    vehicleModelDate: String(listing.modelYear),
    productionDate: String(listing.manufactureYear),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: listing.km, unitCode: "KMT" },
    fuelType: FUEL_LABEL[listing.fuel],
    vehicleTransmission: TRANSMISSION_LABEL[listing.transmission],
    color: listing.color,
    description: listing.description,
    url,
    image: photo ? new URL(photo, siteUrl()).toString() : undefined,
    offers: {
      "@type": "Offer",
      price: mainPrice(listing),
      priceCurrency: "BRL",
      availability:
        listing.status === "vendido"
          ? "https://schema.org/SoldOut"
          : listing.status === "ativo" && !isExpired(listing)
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/UsedCondition",
      url,
      areaServed: `${listing.city}/${listing.state}`,
    },
  };
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await loadListing(id);
  if (!listing) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify não escapa "<": sem isso, "</script>" na descrição quebraria a página.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(listing)).replace(/</g, "\\u003c") }}
      />
      <ListingDetail id={listing.id} initial={listing} />
    </>
  );
}
