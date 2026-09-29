import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { searchHref, type SearchFilters } from "@/lib/listing-query";
import { SITE } from "@/lib/site";
import { FeaturedDeal } from "./FeaturedDeal";
import { HeroSearch } from "./HeroSearch";

const QUICK_SEARCHES: { label: string; filters: SearchFilters }[] = [
  { label: "Até R$ 50 mil", filters: { priceMax: 50000 } },
  { label: "SUVs", filters: { bodyType: "suv" } },
  { label: "Picapes", filters: { bodyType: "picape" } },
  { label: "Automáticos", filters: { transmission: "automatico" } },
  { label: "Sem leilão e sem sinistro", filters: { noAuction: true, noAccident: true } },
  { label: "Só repasse", filters: { priceMode: "repasse" } },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Brilho verde de fundo, discreto */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-brand/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]"
      />

      <Container className="relative grid items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">{SITE.slogan}</p>
          <h1 className="text-chrome-gradient mt-3 text-4xl font-extrabold leading-[1.05] sm:text-5xl xl:text-6xl">
            Carros abaixo da FIPE. Sem enrolação.
          </h1>
          <p className="mt-4 max-w-xl text-base text-chrome-muted sm:text-lg">
            Repasse e preço final de lojistas, corretores e particulares, com a FIPE e o estado real de
            cada carro à vista.
          </p>

          <div className="mt-8">
            <HeroSearch />
          </div>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Buscas rápidas">
            {QUICK_SEARCHES.map((item) => (
              <li key={item.label}>
                <Link
                  href={searchHref(item.filters)}
                  className="inline-flex h-8 items-center rounded-full border border-border bg-surface px-3 text-sm text-chrome transition duration-150 hover:border-brand hover:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden lg:block">
          <FeaturedDeal />
        </div>
      </Container>
    </section>
  );
}
