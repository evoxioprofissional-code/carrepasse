"use client";

import {
  Calendar,
  Download,
  Eye,
  Flag,
  Heart,
  Megaphone,
  MessageCircle,
  ScanLine,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { adminRepository } from "@/repositories/adminRepository";
import type { AdminStats } from "@/types/admin";
import { AdminPageHeader } from "./AdminPageHeader";

type Period = "7d" | "30d";
const PERIOD_LABEL: Record<Period, string> = { "7d": "Últimos 7 dias", "30d": "Últimos 30 dias" };

/** Visão geral do painel: a atividade real do marketplace. */
export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("7d");

  useEffect(() => {
    let cancelled = false;
    adminRepository
      .stats()
      .then((value) => !cancelled && (setStats(value), setError(null)))
      .catch(() => !cancelled && setError("Não foi possível carregar os números. Tente de novo."));
    return () => {
      cancelled = true;
    };
  }, []);

  const exportCsv = () => {
    if (!stats) return;
    const plate = period === "7d" ? stats.plateLookups.last7Days : stats.plateLookups.last30Days;
    const rows: (string | number)[][] = [
      ["Indicador", "Valor"],
      ["Período", PERIOD_LABEL[period]],
      ["Usuários (total)", stats.users.total],
      ["Novos usuários (7 dias)", stats.users.newLast7Days],
      ["Lojistas", stats.users.lojista],
      ["Corretores", stats.users.corretor],
      ["Particulares", stats.users.particular],
      ["Anúncios ativos", stats.listings.active],
      ["Novos anúncios (7 dias)", stats.listings.newLast7Days],
      ["Vendidos", stats.listings.sold],
      ["Pausados", stats.listings.paused],
      ["Vencidos", stats.listings.expired],
      ["Visitas", stats.listings.views],
      ["Contatos (WhatsApp)", stats.listings.contacts],
      ["Favoritos", stats.favorites],
      ["Denúncias abertas", stats.reports.open],
      [`Consultas de placa (${PERIOD_LABEL[period].toLowerCase()})`, plate],
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `visao-geral-${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const actions = (
    <>
      <label className="relative">
        <Calendar aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-chrome-muted" />
        <span className="sr-only">Período</span>
        <select
          value={period}
          onChange={(event) => setPeriod(event.target.value as Period)}
          className="h-10 cursor-pointer rounded-lg border border-[#DFE5EC] bg-white pl-9 pr-8 text-sm font-medium text-chrome outline-none transition focus:border-lime-ink"
        >
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
        </select>
      </label>
      <button
        type="button"
        onClick={exportCsv}
        disabled={!stats}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#DFE5EC] bg-white px-4 text-sm font-medium text-chrome transition hover:bg-surface-2 disabled:opacity-50"
      >
        <Download aria-hidden className="size-4" />
        Exportar
      </button>
    </>
  );

  return (
    <>
      <AdminPageHeader title="Visão geral" subtitle="Acompanhe a atividade do seu marketplace." actions={actions} />
      {!stats ? (
        error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-32 rounded-xl" />
            ))}
          </div>
        )
      ) : (
        <Content stats={stats} period={period} />
      )}
    </>
  );
}

function Content({ stats, period }: { stats: AdminStats; period: Period }) {
  const { users, listings, reports, plateLookups } = stats;
  const plate = period === "7d" ? plateLookups.last7Days : plateLookups.last30Days;
  const plateOther = period === "7d" ? plateLookups.last30Days : plateLookups.last7Days;
  const newInPeriod = period === "7d";

  return (
    <div className="flex flex-col gap-4">
      {/* Indicadores principais */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={UsersRound} label="Usuários" value={users.total} description={newInPeriod ? `+${formatNumber(users.newLast7Days)} em 7 dias` : "cadastrados no total"} />
        <Kpi icon={Megaphone} label="Anúncios ativos" value={listings.active} description={newInPeriod ? `+${formatNumber(listings.newLast7Days)} novos em 7 dias` : "ativos no total"} />
        <Kpi icon={Eye} label="Visitas" value={listings.views} description="Aberturas de anúncios" />
        <Kpi icon={MessageCircle} label="Contatos" value={listings.contacts} description="Toques no WhatsApp" />
      </div>

      {/* Distribuições */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Usuários por tipo" subtitle={`Distribuição dos ${formatNumber(users.total)} ${users.total === 1 ? "usuário cadastrado" : "usuários cadastrados"}.`}>
          <UsersDonut lojista={users.lojista} corretor={users.corretor} particular={users.particular} total={users.total} />
        </Panel>
        <Panel title="Situação dos anúncios" subtitle="Status dos anúncios no marketplace.">
          <StatusBars
            rows={[
              { label: "Ativos", value: listings.active },
              { label: "Vendidos", value: listings.sold },
              { label: "Pausados", value: listings.paused },
              { label: "Vencidos", value: listings.expired },
            ]}
          />
        </Panel>
      </div>

      {/* Indicadores secundários */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SecondaryCard icon={Heart} label="Favoritos" value={stats.favorites} description="Carros salvos pelos visitantes" />
        <SecondaryCard
          icon={Flag}
          label="Denúncias abertas"
          value={reports.open}
          description={`${formatNumber(reports.newLast7Days)} recebidas em 7 dias`}
          href="/admin/denuncias"
        />
        <SecondaryCard
          icon={ScanLine}
          label="Consultas de placa"
          value={plate}
          description={`${formatNumber(plateOther)} em ${period === "7d" ? "30 dias" : "7 dias"}`}
        />
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, description }: { icon: LucideIcon; label: string; value: number; description: string }) {
  return (
    <div className="rounded-xl border border-[#DFE5EC] bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-lime-soft text-lime-ink">
          <Icon aria-hidden className="size-5" />
        </span>
        <p className="min-w-0 truncate text-sm font-medium text-chrome-muted">{label}</p>
      </div>
      <p className="mt-3 font-display text-3xl font-extrabold tracking-tight text-chrome">{formatNumber(value)}</p>
      <p className="mt-1 text-sm text-chrome-muted">{description}</p>
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-[#DFE5EC] bg-white p-5">
      <h2 className="font-display text-base font-bold text-chrome">{title}</h2>
      <p className="mt-0.5 text-sm text-chrome-muted">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

const DONUT_COLORS = { lojista: "#7ED321", corretor: "#9AA2AD", particular: "#D7DCE3" };

function UsersDonut({ lojista, corretor, particular, total }: { lojista: number; corretor: number; particular: number; total: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const segments: { key: keyof typeof DONUT_COLORS; label: string; value: number }[] = [
    { key: "lojista", label: "Lojistas", value: lojista },
    { key: "corretor", label: "Corretores", value: corretor },
    { key: "particular", label: "Particulares", value: particular },
  ];
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
      <div className="relative size-40 shrink-0">
        <svg viewBox="0 0 140 140" className="size-full -rotate-90">
          <circle cx="70" cy="70" r={r} fill="none" stroke="#EDF0F3" strokeWidth="16" />
          {total > 0 &&
            segments.map((segment) => {
              const fraction = segment.value / total;
              const dash = fraction * circ;
              const node = (
                <circle
                  key={segment.key}
                  cx="70"
                  cy="70"
                  r={r}
                  fill="none"
                  stroke={DONUT_COLORS[segment.key]}
                  strokeWidth="16"
                  strokeDasharray={`${dash} ${circ - dash}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += dash;
              return node;
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-medium text-chrome-muted">Total</span>
          <span className="font-display text-2xl font-extrabold text-chrome">{formatNumber(total)}</span>
          <span className="text-xs text-chrome-muted">{total > 0 ? "100%" : "0%"}</span>
        </div>
      </div>
      <ul className="w-full flex-1 space-y-3">
        {segments.map((segment) => {
          const pct = total > 0 ? Math.round((segment.value / total) * 100) : 0;
          return (
            <li key={segment.key} className="flex items-center gap-3 text-sm">
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: DONUT_COLORS[segment.key] }} />
              <span className="text-chrome-muted">{segment.label}</span>
              <span className="ml-auto font-semibold tabular-nums text-chrome">{formatNumber(segment.value)}</span>
              <span className="w-12 text-right text-chrome-muted tabular-nums">({pct}%)</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StatusBars({ rows }: { rows: { label: string; value: number }[] }) {
  const total = Math.max(rows.reduce((sum, row) => sum + row.value, 0), 0);
  return (
    <div className="space-y-4">
      {rows.map((row) => {
        const pct = total > 0 ? Math.round((row.value / total) * 100) : 0;
        return (
          <div key={row.label} className="flex items-center gap-3 text-sm">
            <span className="w-16 shrink-0 text-chrome-muted">{row.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#EDF0F3]">
              <div className="h-full rounded-full bg-lime" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-8 text-right font-semibold tabular-nums text-chrome">{formatNumber(row.value)}</span>
            <span className="w-12 text-right text-chrome-muted tabular-nums">({pct}%)</span>
          </div>
        );
      })}
    </div>
  );
}

function SecondaryCard({
  icon: Icon,
  label,
  value,
  description,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  description: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-lime-soft text-lime-ink">
        <Icon aria-hidden className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-chrome-muted">{label}</p>
        <p className="font-display text-2xl font-extrabold tracking-tight text-chrome">{formatNumber(value)}</p>
        <p className="truncate text-xs text-chrome-muted">{description}</p>
      </div>
    </>
  );
  const className = "flex items-center gap-4 rounded-xl border border-[#DFE5EC] bg-white p-5";
  return href ? (
    <Link href={href} className={cn(className, "transition hover:border-lime-ink")}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
