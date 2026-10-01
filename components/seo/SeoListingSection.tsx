import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { VehicleCard } from "@/components/listing/VehicleCard";
import { buttonStyles } from "@/components/ui/buttonStyles";
import type { ListingWithSeller } from "@/types/listing";

export interface SeoCrumb {
  label: string;
  href?: string;
}

export interface SeoRelated {
  title: string;
  links: { href: string; label: string }[];
}

interface SeoListingSectionProps {
  breadcrumb: SeoCrumb[];
  heading: string;
  intro: string;
  ctaHref: string;
  ctaLabel: string;
  listings: ListingWithSeller[];
  related?: SeoRelated[];
}

export function SeoListingSection({
  breadcrumb,
  heading,
  intro,
  ctaHref,
  ctaLabel,
  listings,
  related,
}: SeoListingSectionProps) {
  return (
    <Container className="py-8 sm:py-10">
      <nav aria-label="Você está em" className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
        {breadcrumb.map((crumb, index) => (
          <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
            {crumb.href ? (
              <Link href={crumb.href} className="transition-colors hover:text-ink">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-ink">{crumb.label}</span>
            )}
            {index < breadcrumb.length - 1 && <span aria-hidden="true">/</span>}
          </span>
        ))}
      </nav>

      <header className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{heading}</h1>
        <p className="mt-2 text-ink-muted">{intro}</p>
        <Link href={ctaHref} className={buttonStyles({ variant: "primary", size: "md", className: "mt-4" })}>
          {ctaLabel}
        </Link>
      </header>

      {listings.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line p-8 text-center text-ink-muted">
          <p>Nenhum anúncio ativo por aqui no momento.</p>
          <Link href="/carros" className="mt-3 inline-block font-medium text-ink underline underline-offset-4">
            Ver todos os carros
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing, index) => (
            <VehicleCard key={listing.id} listing={listing} priority={index < 3} className="w-full" />
          ))}
        </div>
      )}

      {related?.map((group) => (
        <section key={group.title} className="mt-10 border-t border-line pt-6">
          <h2 className="text-sm font-semibold text-ink">{group.title}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block rounded-full border border-line px-3 py-1.5 text-sm text-ink transition-colors hover:bg-surface-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Container>
  );
}
