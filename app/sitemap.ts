import type { MetadataRoute } from "next";
import { getPublicListingIds, getPublicProfileIds } from "@/repositories/serverData";
import { siteUrl } from "@/lib/site-url";

export const revalidate = 3600;

// Páginas públicas + anúncios ativos + perfis de vendedores.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl().origin;
  const [listingIds, profileIds] = await Promise.all([getPublicListingIds(), getPublicProfileIds()]);
  const staticPages = ["", "/carros", "/como-funciona", "/seguranca", "/termos", "/privacidade", "/creditos"];

  return [
    ...staticPages.map((path) => ({ url: `${base}${path}`, changeFrequency: "daily" as const, priority: path === "" ? 1 : 0.6 })),
    ...listingIds.map((id) => ({ url: `${base}/carros/${id}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...profileIds.map((id) => ({ url: `${base}/vendedor/${id}`, changeFrequency: "weekly" as const, priority: 0.4 })),
  ];
}
