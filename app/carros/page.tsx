import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingSearch } from "@/components/listing/ListingSearch";
import { VehicleCardSkeleton } from "@/components/listing/VehicleCardSkeleton";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Carros à venda",
  description: "Carros de repasse e preço final com a FIPE em todo anúncio. Filtre por marca, preço, ano e estado.",
};

function SearchFallback() {
  return (
    <Container className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <VehicleCardSkeleton key={index} />
      ))}
    </Container>
  );
}

export default function CarsPage() {
  // useSearchParams exige Suspense para a página continuar estática.
  return (
    <Suspense fallback={<SearchFallback />}>
      <ListingSearch />
    </Suspense>
  );
}
