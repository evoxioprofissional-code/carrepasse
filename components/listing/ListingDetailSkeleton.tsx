import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export function ListingDetailSkeleton() {
  return (
    <Container className="py-6 lg:py-10" aria-busy>
      <Skeleton className="mb-6 h-4 w-64" />
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <div className="hidden grid-cols-6 gap-2 sm:grid">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="aspect-[4/3]" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </Container>
  );
}
