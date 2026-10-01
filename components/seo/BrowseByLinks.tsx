import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { slugify, citySlug } from "@/lib/slug";
import { listingRepository } from "@/repositories/listingRepository";

// Links internos por marca e cidade, no rodapé da busca: dá caminho para o
// Google rastrear as páginas de SEO e para o visitante navegar.
export async function BrowseByLinks() {
  const options = await listingRepository.getFilterOptions().catch(() => null);
  if (!options) return null;

  const brands = options.brands.slice(0, 12);
  const cities = Object.entries(options.citiesByState)
    .flatMap(([uf, list]) => list.map((city) => ({ city, uf })))
    .slice(0, 12);

  if (brands.length === 0 && cities.length === 0) return null;

  return (
    <Container className="border-t border-line py-8">
      {brands.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-ink">Carros por marca</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {brands.map((b) => (
              <li key={b.brand}>
                <Link
                  href={`/carros/marca/${slugify(b.brand)}`}
                  className="inline-block rounded-full border border-line px-3 py-1.5 text-sm text-ink transition-colors hover:bg-surface-2"
                >
                  {b.brand}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {cities.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold text-ink">Carros por cidade</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {cities.map(({ city, uf }) => (
              <li key={`${city}-${uf}`}>
                <Link
                  href={`/carros/cidade/${citySlug(city, uf)}`}
                  className="inline-block rounded-full border border-line px-3 py-1.5 text-sm text-ink transition-colors hover:bg-surface-2"
                >
                  {city}/{uf}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
