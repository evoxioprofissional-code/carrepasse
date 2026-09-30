import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { SellerProfile } from "@/components/seller/SellerProfile";
import { SELLER_TYPE_LABEL } from "@/lib/labels";
import { SELLER_PAGE_LIMIT } from "@/lib/listing-query";
import { listingRepository } from "@/repositories/listingRepository";
import { getPublicProfile, getPublicProfileIds } from "@/repositories/serverData";

interface PageProps {
  params: Promise<{ id: string }>;
}

// A página chega pronta (Google lê perfil e anúncios) e revalida a cada 5 min.
export const revalidate = 300;

export async function generateStaticParams() {
  return (await getPublicProfileIds()).map((id) => ({ id }));
}

// Metadados e página usam a mesma consulta.
const loadProfile = cache((id: string) => getPublicProfile(id));

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const user = await loadProfile(id).catch(() => null);
  if (!user) return { title: "Vendedor" };

  const name = user.storeName ?? user.name;
  const title = `${name} — ${SELLER_TYPE_LABEL[user.sellerType]} em ${user.city}/${user.state}`;
  const description = `Carros à venda por ${name} no Car Repasse, com FIPE e estado real em todo anúncio.`;
  return {
    title,
    description,
    alternates: { canonical: `/vendedor/${user.id}` },
    openGraph: { title, description, locale: "pt_BR", siteName: "Car Repasse" },
  };
}

export default async function SellerPage({ params }: PageProps) {
  const { id } = await params;
  const user = await loadProfile(id);
  if (!user) notFound();
  // Os anúncios são um bônus: se falharem, o navegador tenta de novo.
  const listings = await listingRepository.list({ sellerId: id, limit: SELLER_PAGE_LIMIT }).catch(() => undefined);

  return <SellerProfile id={id} initialUser={user} initialListings={listings} />;
}
