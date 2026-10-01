import { siteUrl } from "@/lib/site-url";
import { renderStory } from "@/lib/story-image";
import { getPublicListing } from "@/repositories/serverData";

// /carros/[id]/story → imagem 1080×1920 para postar nos stories do Instagram.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getPublicListing(id).catch(() => null);
  if (!listing) return new Response("Anúncio não encontrado", { status: 404 });
  return renderStory(listing, siteUrl().host.replace(/^www\./, ""));
}
