"use client";

import {
  Ban,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  History,
  MoreVertical,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Store,
  User,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { formatPhone } from "@/lib/format";
import { SELLER_TYPE_LABEL } from "@/lib/labels";
import { adminRepository } from "@/repositories/adminRepository";
import type { AdminUser } from "@/types/admin";
import type { SellerType } from "@/types/user";
import { AdminStatCard } from "./AdminCards";
import { AdminPageHeader } from "./AdminPageHeader";

const PAGE_SIZE = 10;
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function shortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function AdminUsers() {
  return <UsersContent />;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "?";
}

function pageItems(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

function UsersContent() {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [type, setType] = useState<"todos" | SellerType>("todos");
  const [status, setStatus] = useState<"todos" | "ativo" | "banido">("todos");
  const [page, setPage] = useState(1);
  const [confirming, setConfirming] = useState<AdminUser | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminRepository
      .listUsers()
      .then((list) => !cancelled && (setUsers(list), setError(null)))
      .catch(() => !cancelled && setError("Não foi possível carregar os usuários."));
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const base = { total: 0, lojista: 0, corretor: 0, particular: 0 };
    for (const user of users ?? []) {
      base.total++;
      base[user.sellerType]++;
    }
    return base;
  }, [users]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (users ?? []).filter((user) => {
      if (type !== "todos" && user.sellerType !== type) return false;
      if (status === "ativo" && user.bannedAt) return false;
      if (status === "banido" && !user.bannedAt) return false;
      if (!term) return true;
      return (
        user.name.toLowerCase().includes(term) ||
        (user.storeName?.toLowerCase().includes(term) ?? false) ||
        (user.phone?.includes(term) ?? false)
      );
    });
  }, [users, query, type, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const resetPage = () => setPage(1);
  const clearFilters = () => {
    setQuery("");
    setType("todos");
    setStatus("todos");
    setPage(1);
  };

  const setBan = async (user: AdminUser, banned: boolean) => {
    setBusyId(user.id);
    setConfirming(null);
    try {
      await adminRepository.setBan(user.id, banned);
      setUsers((current) =>
        (current ?? []).map((item) =>
          item.id === user.id ? { ...item, bannedAt: banned ? new Date().toISOString() : null } : item,
        ),
      );
    } catch {
      setError("Não foi possível concluir a ação. Tente de novo.");
    } finally {
      setBusyId(null);
    }
  };

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["Nome", "Tipo", "Cadastro", "Anúncios", "Status"],
      ...filtered.map((user) => [
        user.name,
        SELLER_TYPE_LABEL[user.sellerType],
        shortDate(user.createdAt),
        user.listingsCount,
        user.bannedAt ? "Banido" : "Ativo",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "usuarios.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const actions = (
    <button
      type="button"
      onClick={exportCsv}
      disabled={!users}
      className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#DFE5EC] bg-white px-4 text-sm font-medium text-chrome transition hover:bg-surface-2 disabled:opacity-50"
    >
      <Download aria-hidden className="size-4" />
      Exportar
    </button>
  );

  return (
    <>
      <AdminPageHeader title="Usuários" subtitle="Gerencie lojistas, corretores e particulares." actions={actions} />

      <div className="flex flex-col gap-4">
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard icon={<UsersRound aria-hidden />} label="Total de usuários" value={users ? counts.total : "—"} />
          <AdminStatCard icon={<Store aria-hidden />} label="Lojistas" value={users ? counts.lojista : "—"} />
          <AdminStatCard icon={<Briefcase aria-hidden />} label="Corretores" value={users ? counts.corretor : "—"} />
          <AdminStatCard icon={<User aria-hidden />} label="Particulares" value={users ? counts.particular : "—"} />
        </div>

        <section className="rounded-xl border border-[#DFE5EC] bg-white">
          <div className="border-b border-[#DFE5EC] p-5">
            <h2 className="font-display text-base font-bold text-chrome">
              Todos os usuários <span className="text-chrome-muted">({users ? counts.total : 0})</span>
            </h2>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="relative flex-1">
                <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-chrome-muted" />
                <span className="sr-only">Buscar usuário</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    resetPage();
                  }}
                  placeholder="Buscar por nome, e-mail ou telefone..."
                  className="h-10 w-full rounded-lg border border-[#DFE5EC] bg-surface pl-9 pr-3 text-sm text-chrome outline-none transition focus:border-lime-ink"
                />
              </label>
              <select
                aria-label="Tipo"
                value={type}
                onChange={(event) => {
                  setType(event.target.value as typeof type);
                  resetPage();
                }}
                className="h-10 rounded-lg border border-[#DFE5EC] bg-white px-3 text-sm text-chrome outline-none focus:border-lime-ink"
              >
                <option value="todos">Todos os tipos</option>
                <option value="lojista">Lojistas</option>
                <option value="corretor">Corretores</option>
                <option value="particular">Particulares</option>
              </select>
              <select
                aria-label="Status"
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as typeof status);
                  resetPage();
                }}
                className="h-10 rounded-lg border border-[#DFE5EC] bg-white px-3 text-sm text-chrome outline-none focus:border-lime-ink"
              >
                <option value="todos">Todos os status</option>
                <option value="ativo">Ativos</option>
                <option value="banido">Banidos</option>
              </select>
              <button
                type="button"
                onClick={clearFilters}
                aria-label="Limpar filtros"
                className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#DFE5EC] bg-white text-chrome-muted transition hover:bg-surface-2 hover:text-chrome"
              >
                <SlidersHorizontal aria-hidden className="size-4" />
              </button>
            </div>
          </div>

          {!users && !error ? (
            <div className="flex flex-col gap-2 p-5">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<UsersRound aria-hidden />}
              title="Nenhum usuário"
              description={counts.total > 0 ? "Nada bate com os filtros." : "Ainda não há contas reais no site."}
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#DFE5EC] text-xs uppercase tracking-wide text-chrome-muted">
                      <th className="px-5 py-3 font-medium">Usuário</th>
                      <th className="px-5 py-3 font-medium">Tipo</th>
                      <th className="px-5 py-3 font-medium">Cadastro</th>
                      <th className="px-5 py-3 font-medium">Anúncios</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 text-right font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFE5EC]">
                    {visible.map((user) => (
                      <tr key={user.id} className={cn("transition-colors hover:bg-surface-2/50", busyId === user.id && "opacity-60")}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-lime-soft text-xs font-bold text-lime-ink">
                              {initials(user.name)}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-chrome">{user.name}</p>
                              <p className="truncate text-xs text-chrome-muted">
                                {user.phone ? formatPhone(user.phone) : user.storeName ?? "—"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-flex rounded-full border border-[#DFE5EC] px-2.5 py-0.5 text-xs font-medium text-chrome">
                            {SELLER_TYPE_LABEL[user.sellerType]}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-chrome-muted">{shortDate(user.createdAt)}</td>
                        <td className="px-5 py-3 tabular-nums text-chrome">{user.listingsCount}</td>
                        <td className="px-5 py-3">
                          <StatusPill banned={Boolean(user.bannedAt)} />
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/vendedor/${user.id}`}
                              target="_blank"
                              aria-label={`Ver perfil de ${user.name}`}
                              className="flex size-8 items-center justify-center rounded-lg text-chrome-muted transition hover:bg-surface-2 hover:text-chrome"
                            >
                              <Eye aria-hidden className="size-4" />
                            </Link>
                            <RowMenu
                              user={user}
                              busy={busyId === user.id}
                              onBan={() => setConfirming(user)}
                              onUnban={() => void setBan(user, false)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col items-center justify-between gap-3 border-t border-[#DFE5EC] p-5 sm:flex-row">
                <p className="text-sm text-chrome-muted">
                  Mostrando {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} de {filtered.length} usuários
                </p>
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Anterior"
                      disabled={safePage === 1}
                      onClick={() => setPage(safePage - 1)}
                      className="flex size-9 items-center justify-center rounded-lg border border-[#DFE5EC] bg-white text-chrome-muted transition hover:bg-surface-2 disabled:opacity-40"
                    >
                      <ChevronLeft aria-hidden className="size-4" />
                    </button>
                    {pageItems(safePage, totalPages).map((item, index) =>
                      item === "…" ? (
                        <span key={`gap-${index}`} className="px-1.5 text-chrome-muted">
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setPage(item)}
                          aria-current={item === safePage ? "page" : undefined}
                          className={cn(
                            "flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition",
                            item === safePage
                              ? "border-lime-ink bg-lime-soft text-lime-ink"
                              : "border-[#DFE5EC] bg-white text-chrome hover:bg-surface-2",
                          )}
                        >
                          {item}
                        </button>
                      ),
                    )}
                    <button
                      type="button"
                      aria-label="Próxima"
                      disabled={safePage === totalPages}
                      onClick={() => setPage(safePage + 1)}
                      className="flex size-9 items-center justify-center rounded-lg border border-[#DFE5EC] bg-white text-chrome-muted transition hover:bg-surface-2 disabled:opacity-40"
                    >
                      <ChevronRight aria-hidden className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      <Modal
        open={Boolean(confirming)}
        onClose={() => setConfirming(null)}
        title={confirming ? `Banir ${confirming.name}?` : "Banir"}
        description="Os anúncios da pessoa somem da vitrine na hora e ela não poderá publicar nem editar. Você pode desfazer depois."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirming(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => confirming && void setBan(confirming, true)}>
              <Ban aria-hidden className="size-4" />
              Banir conta
            </Button>
          </>
        }
      />
    </>
  );
}

function StatusPill({ banned }: { banned: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        banned ? "bg-danger/10 text-danger-ink" : "bg-lime-soft text-lime-ink",
      )}
    >
      <span className={cn("size-1.5 rounded-full", banned ? "bg-danger" : "bg-lime")} />
      {banned ? "Banido" : "Ativo"}
    </span>
  );
}

function RowMenu({
  user,
  busy,
  onBan,
  onUnban,
}: {
  user: AdminUser;
  busy: boolean;
  onBan: () => void;
  onUnban: () => void;
}) {
  const [open, setOpen] = useState(false);
  const banned = Boolean(user.bannedAt);
  const close = () => setOpen(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={busy}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Ações de ${user.name}`}
        className="flex size-8 items-center justify-center rounded-lg text-chrome-muted transition hover:bg-surface-2 hover:text-chrome disabled:opacity-40"
      >
        <MoreVertical aria-hidden className="size-4" />
      </button>
      {open && (
        <>
          <button aria-hidden tabIndex={-1} className="fixed inset-0 z-40 cursor-default" onClick={close} />
          <div role="menu" className="absolute right-0 z-50 mt-1 w-52 overflow-hidden rounded-lg border border-[#DFE5EC] bg-white py-1 shadow-lg">
            <Link
              role="menuitem"
              href={`/vendedor/${user.id}`}
              target="_blank"
              onClick={close}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-chrome transition hover:bg-surface-2"
            >
              <Eye aria-hidden className="size-4 text-chrome-muted" />
              Ver perfil
            </Link>
            <span
              role="menuitem"
              aria-disabled
              title="Em breve"
              className="flex cursor-not-allowed items-center gap-2.5 px-3 py-2 text-sm text-chrome-muted/60"
            >
              <History aria-hidden className="size-4" />
              Histórico da conta
            </span>
            {banned ? (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  close();
                  onUnban();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-chrome transition hover:bg-surface-2"
              >
                <RotateCcw aria-hidden className="size-4 text-chrome-muted" />
                Desbanir usuário
              </button>
            ) : (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  close();
                  onBan();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-danger-ink transition hover:bg-danger/10"
              >
                <Ban aria-hidden className="size-4" />
                Banir usuário
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
