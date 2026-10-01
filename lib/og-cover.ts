import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { illustrationColorFor, renderCarSvg } from "@/lib/car-illustration";
import { LISTING_PHOTOS_BUCKET, SUPABASE_URL } from "@/lib/supabase/config";
import type { BodyType } from "@/types/listing";

// SÓ NO SERVIDOR: foto de capa embutida nas imagens geradas (compartilhamento
// no WhatsApp/Instagram e story do anúncio).

const STORAGE_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${LISTING_PHOTOS_BUCKET}/`;

/** Foto enviada pelo vendedor (só do nosso Storage; o gerador lê JPEG e PNG). */
async function storagePhotoDataUrl(photo: string): Promise<string | null> {
  try {
    const response = await fetch(photo, { signal: AbortSignal.timeout(5000) });
    const type = response.headers.get("content-type") ?? "";
    if (!response.ok || !/^image\/(jpeg|png)/.test(type)) return null;
    const data = Buffer.from(await response.arrayBuffer());
    return `data:${type.split(";")[0]};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Foto do anúncio embutida na imagem; sem foto utilizável, usa a ilustração.
 * `illustrative` liga o selo "Imagem ilustrativa" (demonstração ou desenho).
 */
export async function coverImage(
  photo: string | undefined,
  bodyType: BodyType,
  color: string,
): Promise<{ src: string; illustrative: boolean }> {
  if (photo?.startsWith("/demo/")) {
    try {
      const file = await readFile(join(process.cwd(), "public", photo));
      return { src: `data:image/jpeg;base64,${file.toString("base64")}`, illustrative: true };
    } catch {
      // cai na ilustração abaixo
    }
  }
  if (photo?.startsWith(STORAGE_PREFIX)) {
    const uploaded = await storagePhotoDataUrl(photo);
    if (uploaded) return { src: uploaded, illustrative: false };
  }
  const svg = renderCarSvg(bodyType, illustrationColorFor(color), 1);
  return { src: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`, illustrative: true };
}
