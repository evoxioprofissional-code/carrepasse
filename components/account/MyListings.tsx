"use client";

import { Megaphone, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useListings } from "@/hooks/useListings";
import { cn } from "@/lib/cn";
import { listingRepository } from "@/repositories/listingRepository";
import { photoRepository } from "@/repositories/photoRepository";
import type { ListingStatus, ListingWithSeller } from "@/types/listing";
import { MyListingRow } from "./MyListingRow";

type Tab = ListingStatus | "todos";

const TABS: { value: Tab; label: string }[] = [
  { value: "ativo", label: "Ativos" },
  { value: "pausado", label: "Pausados" },
  { value: "vendido", label: "Vendidos" },
  { value: "todos", label: "Todos" },
];

const STATUS_MESSAGE: Record<ListingStatus, string> = {
  ativo: "Anúncio reativado.",
  pausado: "Anúncio pausado. Ele some da busca até você reativar.",
  vendido: "Parabéns pela venda! O anúncio fica marcado como vendido.",
};

export function MyListings({ userId }: { userId: string }) {
  const saved = useSearchParams().get("salvo") === "1";
  const { data, loading, error } = useListings({ sellerId: userId, status: "todos", limit: 200 });
  const [tab, setTab] = useState<Tab>("ativo");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ tone: "success" | "danger"; text: string } | null>(
    saved ? { tone: "success", text: "Alterações salvas." } : null,
  );
  const [toDelete, setToDelete] = useState<ListingWithSeller | null>(null);

  const all = data?.items ?? [];
  const count = (value: Tab) => (value === "todos" ? all.length : all.filter((item) => item.status === value).length);
  const items = tab === "todos" ? all : all.filter((item) => item.status === tab);

  const changeStatus = async (listing: ListingWithSeller, status: ListingStatus) => {
    setBusyId(listing.id);
    try {
      await listingRepository.update(listing.id, { status });
      setNotice({ tone: "success", text: STATUS_MESSAGE[status] });
    } catch {
      setNotice({ tone: "danger", text: "Não foi possível alterar o anúncio. Tente de novo." });
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const listing = toDelete;
    setToDelete(null);
    setBusyId(listing.id);
    try {
      await listingRepository.remove(listing.id);
      void photoRepository.remove(listing.photos);
      setNotice({ tone: "success", text: "Anúncio excluído." });
    } catch {
      setNotice({ tone: "danger", text: "Não foi possível excluir. Tente de novo." });
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col gap-3" aria-busy>
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (all.length === 0) {
    return (
      <EmptyState
        icon={<Megaphone aria-hidden />}
        title="Você ainda não tem anúncios"
        description="Digite a placa, descreva o carro e receba contatos no WhatsApp. É grátis."
        action={
          <ButtonLink href="/anunciar">
            <Plus aria-hidden className="size-4" />
            Anunciar grátis
          </ButtonLink>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {notice && (
        <Alert variant={notice.tone === "success" ? "success" : "danger"}>
          <span aria-live="polite">{notice.text}</span>
        </Alert>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Filtrar por situação" className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {TABS.map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={tab === item.value}
              onClick={() => setTab(item.value)}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition duration-150",
                tab === item.value ? "border-brand bg-brand/10 text-brand" : "border-border text-chrome-muted hover:text-chrome",
              )}
            >
              {item.label}
              <span className="text-xs opacity-80">{count(item.value)}</span>
            </button>
          ))}
        </div>
        <ButtonLink href="/anunciar" size="sm" className="h-10 max-sm:w-full">
          <Plus aria-hidden className="size-4" />
          Novo anúncio
        </ButtonLink>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-chrome-muted">
          Nenhum anúncio nesta aba.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((listing) => (
            <MyListingRow
              key={listing.id}
              listing={listing}
              busy={busyId === listing.id}
              onStatus={(status) => void changeStatus(listing, status)}
              onDelete={() => setToDelete(listing)}
            />
          ))}
        </ul>
      )}

      <Modal
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        title="Excluir anúncio?"
        description={toDelete ? `${toDelete.brand} ${toDelete.model} ${toDelete.modelYear} — isso não pode ser desfeito.` : undefined}
        footer={
          <>
            <Button variant="ghost" onClick={() => setToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => void confirmDelete()}>
              Excluir de vez
            </Button>
          </>
        }
      >
        <p className="text-sm text-chrome-muted">
          Se você só vendeu o carro, prefira <strong className="text-chrome">marcar como vendido</strong>: o histórico fica
          na sua página.
        </p>
      </Modal>
    </div>
  );
}
