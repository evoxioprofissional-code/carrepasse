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
  params: Promise<{ marca: string }>;
}

export const revalidate = 3600;
const LIMIT = 24;

const loadOptions = cache(() => listingRepository.getFilterOptions());

const resolveBrand = cache(async (slug: string) => {
  const options = await loadOptions().catch(() => null);
  if (!options) return null;
  const match = options.brands.find((b) => slugify(b.brand) === slug);
  return match ? { brand: match.brand, count: match.count, options } : null;
});

export async function generateStaticParams() {
  const options = await listingRepository.getFilterOptions().catch(() => null);
  return (options?.brands ?? []).map((b) => ({ marca: slugify(b.brand) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { marca } = await params;
  const found = await resolveBrand(marca);
  if (!found) {
    return { title: "Carros por marca", robots: { index: false, follow: true } };
  }
  const title = `Carros ${found.brand} à venda com a FIPE`;
  const description = `${found.count} ${found.count === 1 ? "anúncio" : "anúncios"} de ${found.brand} com preço de repasse ou final e a tabela FIPE em cada carro. Fale direto com o vendedor.`;
  const url = `/carros/marca/${marca}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: found.count === 0 ? { index: false, follow: true } : undefined,
    openGraph: { title, description, type: "website", locale: "pt_BR", siteName: "Car Repasse", url },
    twitter: { card: "summary_large_image", title, description },
  };
}

function structuredData(brand: string, slug: string, listings: ListingWithSeller[]) {
  const base = siteUrl().origin;
  const pageUrl = `${base}/carros/marca/${slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Carros ${brand} à venda`,
    url: pageUrl,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: base },
        { "@type": "ListItem", position: 2, name: "Carros", item: `${base}/carros` },
        { "@type": "ListItem", position: 3, name: brand, item: pageUrl },
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

export default async function BrandPage({ params }: PageProps) {
  const { marca } = await params;
  const found = await resolveBrand(marca);
  if (!found) notFound();

  const page = await listingRepository.list({ brand: found.brand, limit: LIMIT, sort: "maior-desconto" });

  const relatedBrands = found.options.brands
    .filter((b) => b.brand !== found.brand)
    .slice(0, 10)
    .map((b) => ({ href: `/carros/marca/${slugify(b.brand)}`, label: b.brand }));

  const topCities = Object.entries(found.options.citiesByState)
    .flatMap(([uf, cities]) => cities.map((city) => ({ city, uf })))
    .slice(0, 10)
    .map(({ city, uf }) => ({ href: `/carros/cidade/${citySlug(city, uf)}`, label: `${city}/${uf}` }));

  const intro = `Encontre ${found.brand} de repasse e preço final, com a tabela FIPE e o estado real em cada anúncio. ${page.total} ${page.total === 1 ? "disponível" : "disponíveis"} agora — e o contato é direto com o vendedor, sem intermediário.`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData(found.brand, marca, page.items)).replace(/</g, "\\u003c"),
        }}
      />
      <SeoListingSection
        breadcrumb={[{ label: "Início", href: "/" }, { label: "Carros", href: "/carros" }, { label: found.brand }]}
        heading={`Carros ${found.brand} à venda`}
        intro={intro}
        ctaHref={searchHref({ brand: found.brand })}
        ctaLabel={`Ver todos os ${found.brand} com filtros`}
        listings={page.items}
        related={[
          ...(relatedBrands.length ? [{ title: "Outras marcas", links: relatedBrands }] : []),
          ...(topCities.length ? [{ title: "Carros por cidade", links: topCities }] : []),
        ]}
      />
    </>
  );
}
