"use client";

import { ExternalLink, Flag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { formatRelativeDate } from "@/lib/format";
import { REPORT_REASON_LABEL } from "@/lib/labels";
import { listingRepository } from "@/repositories/listingRepository";
import { reportRepository } from "@/repositories/reportRepository";
import type { ReportStatus, ReportWithListing } from "@/types/report";
import { AdminNav } from "./AdminNav";
import { AdminOnly } from "./AdminOnly";

const TABS: { value: ReportStatus; label: string }[] = [
  { value: "aberta", label: "Abertas" },
  { value: "resolvida", label: "Resolvidas" },
  { value: "descartada", label: "Descartadas" },
];

const LISTING_STATUS_LABEL = { ativo: "Ativo", pausado: "Pausado", vendido: "Vendido" } as const;

/** Painel de moderação: denúncias dos visitantes e ações sobre o anúncio. */
export function ReportsPanel() {
  return <AdminOnly>{(userId) => <ReportsContent userId={userId} />}</AdminOnly>;
}

function ReportsContent({ userId }: { userId: string }) {
  const [tab, setTab] = useState<ReportStatus>("aberta");
  const [loaded, setLoaded] = useState<{ tab: ReportStatus; items: ReportWithListing[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [version, setVersion] = useState(0);
  const reload = () => setVersion((value) => value + 1);

  useEffect(() => {
    let cancelled = false;
    reportRepository
      .list(tab)
      .then((items) => {
        if (cancelled) return;
        setLoaded({ tab, items });
        setError(null);
      })
      .catch(() => !cancelled && setError("Não foi possível carregar as denúncias."));
    return () => {
      cancelled = true;
    };
  }, [tab, version]);

  const run = async (report: ReportWithListing, action: () => Promise<void>) => {
    setBusyId(report.id);
    try {
      await action();
      reload();
    } catch {
      setError("Não foi possível concluir a ação. Tente de novo.");
    } finally {
      setBusyId(null);
    }
  };

  const pauseListing = (report: ReportWithListing) =>
    run(report, async () => {
      if (report.listing) await listingRepository.update(report.listing.id, { status: "pausado" });
      await reportRepository.resolve(report.id, userId, "resolvida");
    });

  const items = loaded?.tab === tab ? loaded.items : null;

  return (
    <Container className="max-w-4xl py-8 lg:py-12">
      <AdminNav />
      <h1 className="mt-6 text-3xl text-chrome sm:text-4xl">Denúncias</h1>
      <p className="mt-1 text-sm text-chrome-muted">
        Pausar tira o anúncio da busca na hora; o vendedor pode reativar, então fale com ele se for golpe.
      </p>

      <div role="tablist" aria-label="Situação" className="scrollbar-none -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {TABS.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={tab === item.value}
            onClick={() => setTab(item.value)}
            className={cn(
              "inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition duration-150",
              tab === item.value ? "border-lime-ink bg-lime-soft text-lime-ink" : "border-border text-chrome-muted hover:text-chrome",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {error && <Alert variant="danger">{error}</Alert>}
        {!items && !error && Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-36 w-full rounded-xl" />)}
        {items && items.length === 0 && (
          <EmptyState
            icon={<Flag aria-hidden />}
            title={tab === "aberta" ? "Nenhuma denúncia aberta" : "Nada por aqui"}
            description={tab === "aberta" ? "Quando alguém denunciar um anúncio, ele aparece aqui." : undefined}
          />
        )}
        {items?.map((report) => (
          <article key={report.id} className={cn("rounded-xl border border-border bg-surface p-4", busyId === report.id && "opacity-60")}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={report.reason === "golpe" ? "danger" : "warning"}>{REPORT_REASON_LABEL[report.reason]}</Badge>
              <span className="text-xs text-chrome-muted">{formatRelativeDate(report.createdAt)}</span>
            </div>
            {report.details && <p className="mt-2 whitespace-pre-line text-sm text-chrome">“{report.details}”</p>}

            {report.listing ? (
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-surface-2 px-3 py-2 text-sm">
                <Link href={`/carros/${report.listing.id}`} target="_blank" className="inline-flex items-center gap-1 font-semibold text-chrome hover:text-lime-ink">
                  {report.listing.title}
                  <ExternalLink aria-hidden className="size-3.5" />
                </Link>
                <Link href={`/vendedor/${report.listing.sellerId}`} target="_blank" className="text-chrome-muted hover:text-chrome">
                  {report.listing.sellerName}
                </Link>
                <Badge variant={report.listing.status === "ativo" ? "brand" : "neutral"}>{LISTING_STATUS_LABEL[report.listing.status]}</Badge>
              </div>
            ) : (
              <p className="mt-3 text-sm text-chrome-muted">O anúncio já foi excluído.</p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              {report.status === "aberta" ? (
                <>
                  {report.listing?.status === "ativo" && (
                    <Button size="sm" variant="danger" disabled={busyId !== null} onClick={() => void pauseListing(report)}>
                      Pausar anúncio
                    </Button>
                  )}
                  <Button size="sm" variant="secondary" disabled={busyId !== null} onClick={() => void run(report, () => reportRepository.resolve(report.id, userId, "resolvida"))}>
                    Marcar resolvida
                  </Button>
                  <Button size="sm" variant="ghost" disabled={busyId !== null} onClick={() => void run(report, () => reportRepository.resolve(report.id, userId, "descartada"))}>
                    Descartar
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="ghost" disabled={busyId !== null} onClick={() => void run(report, () => reportRepository.reopen(report.id))}>
                  Reabrir
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
    </Container>
  );
}
