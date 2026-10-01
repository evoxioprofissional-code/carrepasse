"use client";

import { Eye, Flag, Heart, Megaphone, MessageCircle, RefreshCw, ScanLine, UsersRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { adminRepository } from "@/repositories/adminRepository";
import type { AdminStats } from "@/types/admin";
import { AdminOnly } from "./AdminOnly";
import { AdminShell } from "./AdminShell";

/** Painel da equipe: números reais do site, agrupados e visuais. */
export function AdminDashboard() {
  return (
    <AdminOnly>
      {() => (
        <AdminShell title="Painel" subtitle="Os números reais do site. Os dados de demonstração ficam de fora.">
          <DashboardContent />
        </AdminShell>
      )}
    </AdminOnly>
  );
}

function DashboardContent() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    adminRepository
      .stats()
      .then((value) => {
        if (cancelled) return;
        setStats(value);
        setError(null);
      })
      .catch(() => !cancelled && setError("Não foi possível carregar os números. Tente de novo."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [version]);

  const refresh = () => {
    setLoading(true);
    setVersion((value) => value + 1);
  };

  if (!stats) {
    return error ? (
      <Alert variant="danger">
        {error}{" "}
        <button type="button" onClick={refresh} className="font-semibold underline">
          Recarregar
        </button>
      </Alert>
    ) : (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  const { users, listings, reports, plateLookups, demo } = stats;
  const contactRate = listings.views > 0 ? Math.round((listings.contacts / listings.views) * 1000) / 10 : null;
  const listingsByStatus = Math.max(listings.active + listings.sold + listings.paused + listings.expired, 1);

  return (
    <div className="flex flex-col gap-5">
      {error && <Alert variant="danger">{error}</Alert>}
      {demo.listings > 0 && (
        <Alert variant="warning">
          O site ainda tem {formatNumber(demo.listings)} anúncios e {formatNumber(demo.users)} usuários de
          demonstração. Remova-os antes do lançamento.
        </Alert>
      )}

      {/* Indicadores principais */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          icon={<UsersRound />}
          label="Usuários"
          value={users.total}
          hint={`+${formatNumber(users.newLast7Days)} em 7 dias`}
        />
        <StatTile
          icon={<Megaphone />}
          label="Anúncios ativos"
          value={listings.active}
          hint={`+${formatNumber(listings.newLast7Days)} novos em 7 dias`}
        />
        <StatTile icon={<Eye />} label="Visitas" value={listings.views} hint="Aberturas de anúncios" />
        <StatTile
          icon={<MessageCircle />}
          label="Contatos"
          value={listings.contacts}
          hint={
            contactRate === null
              ? "Toques no WhatsApp"
              : `${String(contactRate).replace(".", ",")}% das visitas`
          }
        />
      </div>

      {/* Composição */}
      <div className="grid gap-4 lg:grid-cols-2">
        <BreakdownCard
          title="Usuários por tipo"
          total={users.total}
          rows={[
            { label: "Lojistas", value: users.lojista },
            { label: "Corretores", value: users.corretor },
            { label: "Particulares", value: users.particular },
          ]}
        />
        <BreakdownCard
          title="Situação dos anúncios"
          total={listingsByStatus}
          rows={[
            { label: "Ativos", value: listings.active },
            { label: "Vendidos", value: listings.sold },
            { label: "Pausados", value: listings.paused },
            { label: "Vencidos", value: listings.expired },
          ]}
        />
      </div>

      {/* Engajamento e moderação */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={<Heart />} label="Favoritos" value={stats.favorites} hint="Carros salvos pelos visitantes" />
        <StatTile
          icon={<Flag />}
          label="Denúncias abertas"
          value={reports.open}
          tone={reports.open > 0 ? "danger" : "default"}
          hint={`${formatNumber(reports.newLast7Days)} recebidas em 7 dias`}
          href="/admin/denuncias"
        />
        <StatTile
          icon={<ScanLine />}
          label="Consultas de placa"
          value={plateLookups.last7Days}
          hint={`${formatNumber(plateLookups.last30Days)} em 30 dias`}
          className="col-span-2 lg:col-span-2"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-chrome-muted">
        <span>
          Atualizado às{" "}
          {new Date(stats.generatedAt).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "America/Sao_Paulo",
          })}
        </span>
        <Button size="sm" variant="secondary" onClick={refresh} disabled={loading}>
          <RefreshCw aria-hidden className={cn("size-4", loading && "animate-spin motion-reduce:animate-none")} />
          Atualizar
        </Button>
      </div>
    </div>
  );
}

interface StatTileProps {
  icon: ReactNode;
  label: string;
  value: number;
  hint: string;
  tone?: "default" | "danger";
  href?: string;
  className?: string;
}

function StatTile({ icon, label, value, hint, tone = "default", href, className }: StatTileProps) {
  const danger = tone === "danger";
  const content = (
    <>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl [&>svg]:size-5",
            danger ? "bg-danger/10 text-danger-ink" : "bg-lime-soft text-lime-ink",
          )}
        >
          {icon}
        </span>
        <p className="min-w-0 truncate text-sm font-medium text-chrome-muted">{label}</p>
      </div>
      <p
        className={cn(
          "mt-3 font-display text-3xl font-extrabold tracking-tight",
          danger ? "text-danger-ink" : "text-chrome",
        )}
      >
        {formatNumber(value)}
      </p>
      <p className="mt-1 text-xs text-chrome-muted">{hint}</p>
    </>
  );

  return (
    <Card interactive={Boolean(href)} className={cn("min-w-0 p-4 sm:p-5", className)}>
      {href ? (
        <Link href={href} className="block">
          {content}
        </Link>
      ) : (
        content
      )}
    </Card>
  );
}

function BreakdownCard({
  title,
  total,
  rows,
}: {
  title: string;
  total: number;
  rows: { label: string; value: number }[];
}) {
  return (
    <Card className="p-5">
      <p className="text-sm font-semibold text-chrome">{title}</p>
      <div className="mt-4 flex flex-col gap-3">
        {rows.map((row) => {
          const pct = total > 0 ? Math.round((row.value / total) * 100) : 0;
          return (
            <div key={row.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-chrome-muted">{row.label}</span>
                <span className="font-semibold tabular-nums text-chrome">
                  {formatNumber(row.value)}
                  <span className="ml-1 text-xs font-normal text-chrome-muted">({pct}%)</span>
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-lime" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
