"use client";

import { Eye, Flag, Heart, Megaphone, MessageCircle, RefreshCw, ScanLine, UsersRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { adminRepository } from "@/repositories/adminRepository";
import type { AdminStats } from "@/types/admin";
import { AdminNav } from "./AdminNav";
import { AdminOnly } from "./AdminOnly";

/** Painel da equipe: números do site para acompanhar o crescimento. */
export function AdminDashboard() {
  return (
    <AdminOnly>
      {() => (
        <Container className="max-w-4xl py-8 lg:py-12">
          <AdminNav />
          <h1 className="mt-6 text-3xl text-chrome sm:text-4xl">Painel</h1>
          <p className="mt-1 text-sm text-chrome-muted">Contas reais do site; os dados de demonstração ficam de fora.</p>
          <DashboardContent />
        </Container>
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
    return (
      <div className="mt-6 flex flex-col gap-4">
        {error ? (
          <Alert variant="danger">
            {error}{" "}
            <button type="button" onClick={refresh} className="font-semibold underline">
              Recarregar
            </button>
          </Alert>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <Skeleton key={index} className="h-32 rounded-xl" />
            ))}
          </div>
        )}
      </div>
    );
  }

  const { users, listings, reports, plateLookups, demo } = stats;
  const contactRate = listings.views > 0 ? Math.round((listings.contacts / listings.views) * 1000) / 10 : null;

  return (
    <div className="mt-6 flex flex-col gap-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {demo.listings > 0 && (
        <Alert variant="warning">
          O site ainda tem {formatNumber(demo.listings)} anúncios e {formatNumber(demo.users)} usuários de demonstração.
          Remova-os antes do lançamento.
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={<UsersRound />}
          label="Usuários"
          value={users.total}
          hint={`+${formatNumber(users.newLast7Days)} em 7 dias`}
          detail={`${formatNumber(users.lojista)} lojistas · ${formatNumber(users.corretor)} corretores · ${formatNumber(users.particular)} particulares`}
        />
        <StatCard
          icon={<Megaphone />}
          label="Anúncios ativos"
          value={listings.active}
          hint={`+${formatNumber(listings.newLast7Days)} novos em 7 dias`}
          detail={`${formatNumber(listings.sold)} vendidos · ${formatNumber(listings.paused)} pausados · ${formatNumber(listings.expired)} vencidos`}
        />
        <StatCard icon={<Eye />} label="Visitas" value={listings.views} hint="Aberturas de anúncios, somadas" />
        <StatCard
          icon={<MessageCircle />}
          label="Contatos"
          value={listings.contacts}
          hint={`Toques no WhatsApp${contactRate === null ? "" : ` · ${String(contactRate).replace(".", ",")}% das visitas`}`}
        />
        <StatCard icon={<Heart />} label="Favoritos" value={stats.favorites} hint="Carros salvos pelos visitantes" />
        <StatCard
          icon={<Flag />}
          label="Denúncias abertas"
          value={reports.open}
          tone={reports.open > 0 ? "danger" : "default"}
          hint={`${formatNumber(reports.newLast7Days)} recebidas em 7 dias`}
          href="/admin/denuncias"
        />
        <StatCard
          icon={<ScanLine />}
          label="Consultas de placa"
          value={plateLookups.last7Days}
          hint={`Em 7 dias · ${formatNumber(plateLookups.last30Days)} em 30 dias`}
          detail="Consultas pagas na API Placas (as repetidas saem do cache)."
          className="col-span-2"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-chrome-muted">
        <span>
          Atualizado às{" "}
          {new Date(stats.generatedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" })}
        </span>
        <Button size="sm" variant="secondary" onClick={refresh} disabled={loading}>
          <RefreshCw aria-hidden className={cn("size-4", loading && "animate-spin motion-reduce:animate-none")} />
          Atualizar
        </Button>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  hint: string;
  detail?: string;
  tone?: "default" | "danger";
  href?: string;
  className?: string;
}

function StatCard({ icon, label, value, hint, detail, tone = "default", href, className }: StatCardProps) {
  const content = (
    <>
      <p className="flex items-start gap-2 text-sm font-medium text-chrome-muted [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0">
        {icon}
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl",
          tone === "danger" ? "text-danger-ink" : "text-chrome",
        )}
      >
        {formatNumber(value)}
      </p>
      <p className="mt-1 text-xs text-chrome-muted">{hint}</p>
      {detail && <p className="mt-2 border-t border-border pt-2 text-xs text-chrome-muted">{detail}</p>}
    </>
  );

  return (
    <Card interactive={Boolean(href)} className={cn("min-w-0 p-4", className)}>
      {href ? (
        <Link href={href} className="block rounded-lg">
          {content}
        </Link>
      ) : (
        content
      )}
    </Card>
  );
}
