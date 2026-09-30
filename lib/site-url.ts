/** Domínio oficial (links de compartilhamento, sitemap, canonical). */
const PRODUCTION_URL = "https://www.carrepasse.com.br";

/**
 * URL pública do site, usada nos metadados de compartilhamento.
 * NEXT_PUBLIC_SITE_URL tem prioridade; em produção na Vercel vale o domínio
 * oficial; nas prévias da Vercel, a URL da própria prévia.
 */
export function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  if (process.env.VERCEL_ENV === "production") return new URL(PRODUCTION_URL);
  const preview = process.env.VERCEL_URL;
  if (preview) return new URL(`https://${preview}`);
  return new URL("http://localhost:3010");
}
