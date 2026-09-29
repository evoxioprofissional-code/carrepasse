import type { Metadata } from "next";
import { SellerProfile } from "@/components/seller/SellerProfile";
import { SELLER_TYPE_LABEL } from "@/lib/labels";
import { getPublicProfile, getPublicProfileIds } from "@/repositories/serverData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getPublicProfileIds()).map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const user = await getPublicProfile(id);
  if (!user) return { title: "Vendedor" };

  const name = user.storeName ?? user.name;
  const title = `${name} — ${SELLER_TYPE_LABEL[user.sellerType]} em ${user.city}/${user.state}`;
  const description = `Carros à venda por ${name} no Car Repasse, com FIPE e estado real em todo anúncio.`;
  return { title, description, openGraph: { title, description, locale: "pt_BR", siteName: "Car Repasse" } };
}

export default async function SellerPage({ params }: PageProps) {
  const { id } = await params;
  return <SellerProfile id={id} />;
}
