import type { Metadata } from "next";
import { SellerProfile } from "@/components/seller/SellerProfile";
import { SELLER_TYPE_LABEL } from "@/lib/labels";
import { getSeedUser, getSeedUserIds } from "@/repositories/seedSnapshot";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getSeedUserIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const user = getSeedUser(id);
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
