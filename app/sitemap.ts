import type { MetadataRoute } from "next";
import { getPublicListingIds, getPublicProfileIds } from "@/repositories/serverData";
import { listingRepository } from "@/repositories/listingRepository";
import { siteUrl } from "@/lib/site-url";
import { slugify, citySlug } from "@/lib/slug";

export const revalidate = 3600;

// Páginas públicas + anúncios ativos + perfis + páginas por marca/cidade (SEO).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl().origin;
  const [listingIds, profileIds, options] = await Promise.all([
    getPublicListingIds(),
    getPublicProfileIds(),
    listingRepository.getFilterOptions().catch(() => null),
  ]);
  const staticPages = ["", "/carros", "/como-funciona", "/seguranca", "/termos", "/privacidade", "/creditos"];

  const brandUrls = (options?.brands ?? []).map((b) => ({
    url: `${base}/carros/marca/${slugify(b.brand)}`,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));
  const cityUrls = Object.entries(options?.citiesByState ?? {}).flatMap(([uf, cities]) =>
    cities.map((city) => ({
      url: `${base}/carros/cidade/${citySlug(city, uf)}`,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  );

  return [
    ...staticPages.map((path) => ({ url: `${base}${path}`, changeFrequency: "daily" as const, priority: path === "" ? 1 : 0.6 })),
    ...brandUrls,
    ...cityUrls,
    ...listingIds.map((id) => ({ url: `${base}/carros/${id}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...profileIds.map((id) => ({ url: `${base}/vendedor/${id}`, changeFrequency: "weekly" as const, priority: 0.4 })),
  ];
}
