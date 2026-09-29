/**
 * URL pública do site, usada nos metadados de compartilhamento.
 * Defina NEXT_PUBLIC_SITE_URL no deploy; na Vercel cai no domínio de produção.
 */
export function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3010");
}
