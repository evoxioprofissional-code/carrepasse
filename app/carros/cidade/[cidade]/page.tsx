import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { SeoListingSection } from "@/components/seo/SeoListingSection";
import { searchHref } from "@/lib/listing-query";
import { siteUrl } from "@/lib/site-url";
import { slugify, citySlug } from "@/lib/slug";
import { listingRepository } from "@/repositories/listingRepository";
import type { ListingWithSeller } from "@/types/listing";

interface PageProps {
  params: Promise<{ cidade: string }>;
}

export const revalidate = 3600;
const LIMIT = 24;

const loadOptions = cache(() => listingRepository.getFilterOptions());

const resolveCity = cache(async (slug: string) => {
  const options = await loadOptions().catch(() => null);
  if (!options) return null;
  for (const [uf, cities] of Object.entries(options.citiesByState)) {
    for (const city of cities) {
      if (citySlug(city, uf) === slug) return { city, uf, options };
    }
  }
  return null;
});

export async function generateStaticParams() {
  const options = await listingRepository.getFilterOptions().catch(() => null);
  return Object.entries(options?.citiesByState ?? {}).flatMap(([uf, cities]) =>
    cities.map((city) => ({ cidade: citySlug(city, uf) })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cidade } = await params;
  const found = await resolveCity(cidade);
  if (!found) {
    return { title: "Carros por cidade", robots: { index: false, follow: true } };
  }
  const place = `${found.city}, ${found.uf}`;
  const title = `Carros à venda em ${place} com a FIPE`;
  const description = `Carros de repasse e preço final em ${found.city} e região, com a tabela FIPE e o estado real em cada anúncio. Fale direto com o vendedor.`;
  const url = `/carros/cidade/${cidade}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, type: "website", locale: "pt_BR", siteName: "Car Repasse", url },
    twitter: { card: "summary_large_image", title, description },
  };
}

function structuredData(city: string, uf: string, slug: string, listings: ListingWithSeller[]) {
  const base = siteUrl().origin;
  const pageUrl = `${base}/carros/cidade/${slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Carros à venda em ${city}, ${uf}`,
    url: pageUrl,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: base },
        { "@type": "ListItem", position: 2, name: "Carros", item: `${base}/carros` },
        { "@type": "ListItem", position: 3, name: `${city}, ${uf}`, item: pageUrl },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: listings.map((listing, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${base}/carros/${listing.id}`,
        name: `${listing.brand} ${listing.model} ${listing.modelYear}`,
      })),
    },
  };
}

export default async function CityPage({ params }: PageProps) {
  const { cidade } = await params;
  const found = await resolveCity(cidade);
  if (!found) notFound();

  const page = await listingRepository.list({
    city: found.city,
    state: found.uf,
    limit: LIMIT,
    sort: "maior-desconto",
  });

  const relatedCities = Object.entries(found.options.citiesByState)
    .flatMap(([uf, cities]) => cities.map((city) => ({ city, uf })))
    .filter((c) => !(c.city === found.city && c.uf === found.uf))
    .slice(0, 10)
    .map(({ city, uf }) => ({ href: `/carros/cidade/${citySlug(city, uf)}`, label: `${city}/${uf}` }));

  const topBrands = found.options.brands
    .slice(0, 10)
    .map((b) => ({ href: `/carros/marca/${slugify(b.brand)}`, label: b.brand }));

  const intro = `Veja carros de repasse e preço final em ${found.city} e região, com a tabela FIPE e o estado real em cada anúncio. ${page.total} ${page.total === 1 ? "disponível" : "disponíveis"} agora — contato direto com o vendedor.`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData(found.city, found.uf, cidade, page.items)).replace(/</g, "\\u003c"),
        }}
      />
      <SeoListingSection
        breadcrumb={[
          { label: "Início", href: "/" },
          { label: "Carros", href: "/carros" },
          { label: `${found.city}, ${found.uf}` },
        ]}
        heading={`Carros à venda em ${found.city}, ${found.uf}`}
        intro={intro}
        ctaHref={searchHref({ city: found.city, state: found.uf })}
        ctaLabel="Ver com filtros"
        listings={page.items}
        related={[
          ...(topBrands.length ? [{ title: "Carros por marca", links: topBrands }] : []),
          ...(relatedCities.length ? [{ title: "Outras cidades", links: relatedCities }] : []),
        ]}
      />
    </>
  );
}
