"use client";

import { CalendarDays, CarFront, MapPin, UserX } from "lucide-react";
import { VehicleCard } from "@/components/listing/VehicleCard";
import { VehicleCardSkeleton } from "@/components/listing/VehicleCardSkeleton";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useListings } from "@/hooks/useListings";
import { useUser } from "@/hooks/useUser";
import { formatMonthYear } from "@/lib/format";
import { SellerAvatar } from "./SellerAvatar";
import { SellerTypeBadge } from "./SellerTypeBadge";

export function SellerProfile({ id }: { id: string }) {
  const userState = useUser(id);
  const { data, loading } = useListings({ sellerId: id, limit: 60 });
  const listings = data?.items ?? [];

  if (userState.status === "not-found" || userState.status === "error") {
    const failed = userState.status === "error";
    return (
      <Container className="py-16">
        <EmptyState
          icon={<UserX aria-hidden />}
          title={failed ? "Não foi possível abrir o perfil" : "Vendedor não encontrado"}
          description={
            failed
              ? "Verifique sua internet e recarregue a página em alguns segundos."
              : "O perfil pode ter sido removido ou o link está incompleto."
          }
          action={<ButtonLink href="/carros">Ver carros à venda</ButtonLink>}
        />
      </Container>
    );
  }

  return (
    <Container className="py-8 lg:py-12">
      <header className="mb-10 flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
        {userState.status === "loading" ? (
          <>
            <Skeleton className="size-20 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-40" />
            </div>
          </>
        ) : (
          <>
            <SellerAvatar name={userState.user.storeName ?? userState.user.name} size="lg" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl text-chrome">{userState.user.storeName ?? userState.user.name}</h1>
                <SellerTypeBadge type={userState.user.sellerType} />
              </div>
              {userState.user.storeName && <p className="text-sm text-chrome-muted">{userState.user.name}</p>}
              <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-chrome-muted">
                <li className="flex items-center gap-1.5">
                  <MapPin aria-hidden className="size-4" />
                  {userState.user.city}/{userState.user.state}
                </li>
                <li className="flex items-center gap-1.5">
                  <CalendarDays aria-hidden className="size-4" />
                  No Car Repasse desde {formatMonthYear(userState.user.createdAt)}
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-surface-2 px-5 py-3 text-center">
              <p className="font-display text-3xl font-bold text-lime-ink">{loading && !data ? "–" : (data?.total ?? 0)}</p>
              <p className="text-xs text-chrome-muted">{data?.total === 1 ? "anúncio ativo" : "anúncios ativos"}</p>
            </div>
          </>
        )}
      </header>

      <h2 className="mb-5 text-2xl text-chrome">Carros à venda</h2>
      {!loading && listings.length === 0 ? (
        <EmptyState
          icon={<CarFront aria-hidden />}
          title="Nenhum anúncio ativo no momento"
          description="Este vendedor não tem carros à venda agora."
          action={<ButtonLink href="/carros">Ver outros carros</ButtonLink>}
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading && listings.length === 0
            ? Array.from({ length: 4 }, (_, index) => (
                <li key={index}>
                  <VehicleCardSkeleton />
                </li>
              ))
            : listings.map((listing) => (
                <li key={listing.id} className="flex">
                  <VehicleCard listing={listing} className="w-full" />
                </li>
              ))}
        </ul>
      )}
    </Container>
  );
}
