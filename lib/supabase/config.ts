// URL e chave publicável são públicas por natureza (vão para o navegador);
// quem protege os dados são as políticas de RLS do banco. As variáveis de
// ambiente permitem apontar para outro projeto sem mudar o código.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://xpsklsfvbvzxsibesylf.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_aDEGGrgeUKluWL5AAxXZ9g_P8ajNmJ5";

export const LISTING_PHOTOS_BUCKET = "listing-photos";
