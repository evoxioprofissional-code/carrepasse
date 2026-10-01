// Slugs para as páginas de marca/cidade: /carros/marca/fiat, /carros/cidade/recife-pe.
// Sem acento, minúsculo, com hífen — bom para URL e para o Google.

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Cidade + UF viram um slug único (cidades repetem nome entre estados). */
export function citySlug(city: string, uf: string): string {
  return `${slugify(city)}-${uf.toLowerCase()}`;
}
