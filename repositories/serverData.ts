import { supabase } from "@/lib/supabase/client";
import type { ListingWithSeller } from "@/types/listing";
import type { User } from "@/types/user";
import { SELLER_COLUMNS, toListingWithSeller, toUser, type ListingRowWithSeller, type ProfileRow } from "./mappers";

// Leituras públicas feitas no SERVIDOR: metadados de compartilhamento,
// imagem Open Graph e pré-geração das páginas no build.

export async function getPublicListing(id: string): Promise<ListingWithSeller | null> {
  const { data } = await supabase()
    .from("listings")
    .select(`*, seller:profiles!inner(${SELLER_COLUMNS})`)
    .eq("id", id)
    .maybeSingle();
  return data ? toListingWithSeller(data as ListingRowWithSeller) : null;
}

export async function getPublicListingIds(): Promise<string[]> {
  const { data } = await supabase().from("listings").select("id").eq("status", "ativo");
  return (data ?? []).map((row: { id: string }) => row.id);
}

export async function getPublicProfile(id: string): Promise<User | null> {
  const { data } = await supabase().from("profiles").select(SELLER_COLUMNS).eq("id", id).maybeSingle();
  return data ? toUser(data as ProfileRow) : null;
}

export async function getPublicProfileIds(): Promise<string[]> {
  const { data } = await supabase().from("profiles").select("id");
  return (data ?? []).map((row: { id: string }) => row.id);
}
