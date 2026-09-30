import { LISTING_PHOTOS_BUCKET } from "@/lib/supabase/config";
import { supabase } from "@/lib/supabase/client";

const PUBLIC_MARKER = `/storage/v1/object/public/${LISTING_PHOTOS_BUCKET}/`;

function randomName(): string {
  const random = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Math.random()).slice(2);
  return `${Date.now().toString(36)}-${random.slice(0, 8)}.jpg`;
}

/** Caminho dentro do bucket a partir da URL pública (só para fotos nossas). */
function storagePath(url: string): string | null {
  const index = url.indexOf(PUBLIC_MARKER);
  return index === -1 ? null : decodeURIComponent(url.slice(index + PUBLIC_MARKER.length));
}

export const photoRepository = {
  /**
   * Envia a foto (já comprimida) para <usuário>/<pasta>/arquivo.jpg.
   * As regras do bucket só deixam cada usuário escrever na própria pasta.
   */
  async upload(userId: string, folder: string, file: Blob): Promise<string> {
    const path = `${userId}/${folder}/${randomName()}`;
    const bucket = supabase().storage.from(LISTING_PHOTOS_BUCKET);
    const { error } = await bucket.upload(path, file, { contentType: "image/jpeg", cacheControl: "31536000", upsert: false });
    if (error) throw new Error("Não foi possível enviar a foto. Verifique sua conexão.");
    return bucket.getPublicUrl(path).data.publicUrl;
  },

  /** Apaga fotos enviadas pelo usuário (ignora fotos de demonstração). */
  async remove(urls: string[]): Promise<void> {
    const paths = urls.map(storagePath).filter((path): path is string => Boolean(path));
    if (paths.length === 0) return;
    await supabase().storage.from(LISTING_PHOTOS_BUCKET).remove(paths);
  },
};
