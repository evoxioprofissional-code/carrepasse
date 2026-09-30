import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Alert } from "@/components/ui/Alert";
import { Container } from "@/components/ui/Container";
import { isExpired } from "@/lib/listing-expiry";
import { searchHref } from "@/lib/listing-query";
import type { ListingWithSeller } from "@/types/listing";
import { ConditionChecklist } from "./ConditionChecklist";
import { DetailSection } from "./DetailSection";
import { InspectionCard } from "./InspectionCard";
import { ListingActions } from "./ListingActions";
import { ListingGallery } from "./ListingGallery";
import { ListingTitleBlock } from "./ListingTitleBlock";
import { MobileContactBar } from "./MobileContactBar";
import { PriceBlock } from "./PriceBlock";
import { SellerCard } from "./SellerCard";
import { SimilarListings } from "./SimilarListings";
import { SpecsGrid } from "./SpecsGrid";

export function ListingContent({ listing }: { listing: ListingWithSeller }) {
  const title = `${listing.brand} ${listing.model}`;
  const expired = isExpired(listing);
  const canContact = listing.status === "ativo" && !expired;

  return (
    <>
      <Container className="py-6 lg:py-10">
        <nav aria-label="Você está em" className="mb-5 text-sm text-chrome-muted">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="rounded hover:text-chrome">
                Início
              </Link>
            </li>
            <ChevronRight aria-hidden className="size-3.5" />
            <li>
              <Link href="/carros" className="rounded hover:text-chrome">
                Carros
              </Link>
            </li>
            <ChevronRight aria-hidden className="size-3.5" />
            <li>
              <Link href={searchHref({ brand: listing.brand })} className="rounded hover:text-chrome">
                {listing.brand}
              </Link>
            </li>
            <ChevronRight aria-hidden className="size-3.5" />
            <li>
              <Link
                href={searchHref({ brand: listing.brand, model: listing.model })}
                className="rounded hover:text-chrome"
              >
                {listing.model}
              </Link>
            </li>
          </ol>
        </nav>

        {listing.status === "vendido" && (
          <Alert variant="warning" title="Este carro já foi vendido" className="mb-6">
            O anúncio fica no ar só para consulta. Veja os semelhantes logo abaixo.
          </Alert>
        )}
        {expired && (
          <Alert variant="info" title="Anúncio aguardando confirmação" className="mb-6">
            O vendedor ainda não confirmou que este carro continua à venda. Veja carros parecidos logo abaixo.
          </Alert>
        )}
        {listing.status === "pausado" && (
          <Alert variant="info" title="Anúncio pausado pelo vendedor" className="mb-6">
            O vendedor pausou este anúncio por enquanto. Volte mais tarde ou veja carros parecidos.
          </Alert>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:gap-10">
          <div className="flex min-w-0 flex-col gap-10">
            <ListingGallery photos={listing.photos} title={title} />

            {/* No celular, título e preço vêm logo depois da galeria */}
            <div className="flex flex-col gap-6 lg:hidden">
              <ListingTitleBlock listing={listing} />
              <PriceBlock listing={listing} />
              <ListingActions listingId={listing.id} title={title} />
            </div>

            <DetailSection title="Estado do carro">
              <ConditionChecklist condition={listing.condition} />
            </DetailSection>

            <DetailSection title="Ficha técnica">
              <SpecsGrid listing={listing} />
            </DetailSection>

            <DetailSection title="O que o vendedor diz">
              <div className="rounded-xl border border-border bg-surface p-5">
                <p className="whitespace-pre-line leading-relaxed text-chrome">{listing.description}</p>
              </div>
            </DetailSection>

            <div className="lg:hidden">
              <SellerCard listing={listing} canContact={canContact} />
            </div>

            <InspectionCard />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-5">
              <div className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-5">
                <ListingTitleBlock listing={listing} />
                <PriceBlock listing={listing} />
                <ListingActions listingId={listing.id} title={title} />
              </div>
              <SellerCard listing={listing} canContact={canContact} />
            </div>
          </aside>
        </div>

        <div className="mt-16">
          <SimilarListings listing={listing} />
        </div>
      </Container>

      {canContact && (
        <>
          {/* Espaço para a barra fixa não cobrir o fim da página */}
          <div aria-hidden className="h-20 lg:hidden" />
          <MobileContactBar listing={listing} />
        </>
      )}
    </>
  );
}
