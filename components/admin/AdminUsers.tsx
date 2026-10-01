"use client";

import { Ban, RotateCcw, Search, ShieldOff, Store, User, UsersRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { formatRelativeDate } from "@/lib/format";
import { SELLER_TYPE_LABEL } from "@/lib/labels";
import { adminRepository } from "@/repositories/adminRepository";
import type { AdminUser } from "@/types/admin";
import type { SellerType } from "@/types/user";
import { AdminOnly } from "./AdminOnly";
import { AdminShell } from "./AdminShell";

const TYPE_FILTERS: { value: "todos" | SellerType; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "lojista", label: "Lojistas" },
  { value: "corretor", label: "Corretores" },
  { value: "particular", label: "Particulares" },
];

/** Gestão de usuários: listar, buscar e banir/desbanir contas. */
export function AdminUsers() {
  return <AdminOnly>{() => <UsersContent />}</AdminOnly>;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "?";
}

function UsersContent() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"todos" | SellerType>("todos");
  const [confirming, setConfirming] = useState<AdminUser | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminRepository
      .listUsers()
      .then((list) => {
        if (cancelled) return;
        setUsers(list);
        setError(null);
      })
      .catch(() => !cancelled && setError("Não foi possível carregar os usuários."));
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!users) return null;
    const term = query.trim().toLowerCase();
    return users.filter((user) => {
      if (type !== "todos" && user.sellerType !== type) return false;
      if (!term) return true;
      return (
        user.name.toLowerCase().includes(term) ||
        (user.storeName?.toLowerCase().includes(term) ?? false) ||
        (user.city?.toLowerCase().includes(term) ?? false)
      );
    });
  }, [users, query, type]);

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

  return (
    <AdminShell
      title="Usuários"
      subtitle="Contas reais do site. Banir esconde os anúncios da pessoa e a impede de publicar — dá para desfazer."
    >
      <div className="flex flex-col gap-4">
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative flex-1 sm:max-w-xs">
            <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-chrome-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nome, loja ou cidade"
              className="h-10 w-full rounded-full border border-border bg-surface pl-9 pr-4 text-sm text-chrome outline-none transition focus:border-lime-ink"
            />
          </label>
          <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {TYPE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setType(filter.value)}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center rounded-full border px-3 text-sm font-medium transition",
                  type === filter.value
                    ? "border-lime-ink bg-lime-soft text-lime-ink"
                    : "border-border text-chrome-muted hover:text-chrome",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {!filtered && !error && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {filtered && filtered.length === 0 && (
          <EmptyState
            icon={<UsersRound aria-hidden />}
            title="Nenhum usuário"
            description={users && users.length > 0 ? "Nada bate com a busca." : "Ainda não há contas reais no site."}
          />
        )}

        {filtered && filtered.length > 0 && (
          <ul className="flex flex-col gap-2">
            {filtered.map((user) => {
              const banned = Boolean(user.bannedAt);
              const place = [user.city, user.state].filter(Boolean).join("/");
              return (
                <li
                  key={user.id}
                  className={cn(
                    "flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-3 sm:p-4",
                    banned && "opacity-70",
                  )}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lime-soft text-sm font-bold text-lime-ink">
                    {initials(user.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/vendedor/${user.id}`} target="_blank" className="truncate font-semibold text-chrome hover:text-lime-ink">
                        {user.name}
                      </Link>
                      <Badge variant={user.sellerType === "lojista" ? "brand" : "neutral"} icon={user.sellerType === "lojista" ? <Store aria-hidden /> : <User aria-hidden />}>
                        {SELLER_TYPE_LABEL[user.sellerType]}
                      </Badge>
                      {banned && <Badge variant="danger" icon={<ShieldOff aria-hidden />}>Banido</Badge>}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-chrome-muted">
                      {user.storeName ? `${user.storeName} · ` : ""}
                      {place ? `${place} · ` : ""}
                      no site {formatRelativeDate(user.createdAt)}
                    </p>
                  </div>
                  {banned ? (
                    <Button size="sm" variant="secondary" disabled={busyId === user.id} onClick={() => void setBan(user, false)}>
                      <RotateCcw aria-hidden className="size-4" />
                      Desbanir
                    </Button>
                  ) : (
                    <Button size="sm" variant="danger" disabled={busyId === user.id} onClick={() => setConfirming(user)}>
                      <Ban aria-hidden className="size-4" />
                      Banir
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
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
    </AdminShell>
  );
}
