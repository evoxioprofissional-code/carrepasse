"use client";

import {
  Bell,
  Flag,
  LayoutDashboard,
  Megaphone,
  Menu,
  Search,
  ShieldCheck,
  Store,
  UsersRound,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import logoMark from "@/public/brand/logo-mark.png";
import { SignInRequired } from "@/components/auth/SignInRequired";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { useAuth } from "@/hooks/useAuth";
import { useOpenReports } from "@/hooks/useOpenReports";

const NAV = [
  { href: "/admin", label: "Visão geral", Icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuários", Icon: UsersRound },
  { href: "/admin/anuncios", label: "Anúncios", Icon: Megaphone },
  { href: "/admin/denuncias", label: "Denúncias", Icon: Flag },
  { href: "/admin/faturamento", label: "Faturamento", Icon: Wallet },
];

function labelFor(pathname: string): string {
  const match = [...NAV].sort((a, b) => b.href.length - a.href.length).find((item) =>
    item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href),
  );
  return match?.label ?? "Visão geral";
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "?";
}

/** Moldura do painel: sidebar escura, barra superior e área de conteúdo. */
export function AdminLayoutShell({ children }: { children: ReactNode }) {
  const { state } = useAuth();

  if (state.status === "loading") {
    return (
      <Container className="py-16">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </Container>
    );
  }
  if (state.status === "anonymous") {
    return (
      <Container className="py-16">
        <SignInRequired />
      </Container>
    );
  }
  if (!state.isAdmin) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={<ShieldCheck aria-hidden />}
          title="Acesso restrito"
          description="Esta área é só para a equipe do Car Repasse."
        />
      </Container>
    );
  }

  return <Shell userName={state.user.name}>{children}</Shell>;
}

function Shell({ userName, children }: { userName: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const openReports = useOpenReports();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [term, setTerm] = useState("");
  const closeDrawer = () => setMobileOpen(false);

  const toggle = () => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
      setCollapsed((value) => !value);
    } else {
      setMobileOpen((value) => !value);
    }
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const q = term.trim();
    router.push(q ? `/admin/usuarios?q=${encodeURIComponent(q)}` : "/admin/usuarios");
  };

  const sidebar = (
    <nav aria-label="Administração" className="flex h-full flex-col bg-[#101416] text-white">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <Image src={logoMark} alt="" className="h-9 w-auto" />
        <span aria-hidden className="flex flex-col font-display text-base font-extrabold italic leading-[0.9] tracking-tight">
          <span className="text-white">CAR</span>
          <span className="text-lime">REPASSE</span>
        </span>
      </div>
      <p className="px-5 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">Administração</p>

      <div className="flex-1 space-y-1 px-3 py-1">
        {NAV.map(({ href, label, Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={closeDrawer}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-lime/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              {active && <span aria-hidden className="absolute inset-y-1.5 left-0 w-1 rounded-r bg-lime" />}
              <Icon aria-hidden className="size-[18px] shrink-0" />
              {label}
              {href === "/admin/denuncias" && openReports > 0 && (
                <span className="ml-auto rounded-full bg-lime px-1.5 text-xs font-bold text-ink">{openReports}</span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto px-3 pb-4 pt-2">
        <Link
          href="/"
          onClick={closeDrawer}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Store aria-hidden className="size-[18px]" />
          Ver marketplace
        </Link>
        <div className="my-2 border-t border-white/10" />
        <div className="flex items-center gap-3 px-3 py-1.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-lime text-sm font-bold text-ink">
            {initials(userName)}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-semibold text-white">{userName}</span>
            <span className="block text-xs text-white/50">Administrador</span>
          </span>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-svh bg-[#F3F5F7]">
      {/* Sidebar fixa (desktop) */}
      <aside
        className={cn(
          "hidden w-64 shrink-0 lg:block",
          collapsed && "lg:hidden",
        )}
      >
        <div className="sticky top-0 h-svh">{sidebar}</div>
      </aside>

      {/* Drawer (mobile) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 w-64 shadow-xl">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barra superior */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#DFE5EC] bg-white px-4 lg:px-6">
          <button
            type="button"
            onClick={toggle}
            aria-label="Recolher ou expandir o menu"
            className="flex size-9 items-center justify-center rounded-lg text-chrome-muted transition-colors hover:bg-surface-2 hover:text-chrome"
          >
            <Menu aria-hidden className="size-5" />
          </button>
          <nav aria-label="Trilha" className="hidden items-center gap-2 text-sm sm:flex">
            <span className="text-chrome-muted">Administração</span>
            <span className="text-chrome-muted/50" aria-hidden>›</span>
            <span className="font-medium text-chrome">{labelFor(pathname)}</span>
          </nav>

          <form onSubmit={submitSearch} className="relative ml-auto w-full max-w-sm">
            <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-chrome-muted" />
            <input
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Buscar usuários, anúncios, denúncias..."
              className="h-10 w-full rounded-full border border-[#DFE5EC] bg-surface pl-9 pr-4 text-sm text-chrome outline-none transition focus:border-lime-ink"
            />
          </form>

          <Link
            href="/admin/denuncias"
            aria-label={openReports > 0 ? `${openReports} denúncias abertas` : "Notificações"}
            className="relative flex size-9 shrink-0 items-center justify-center rounded-lg text-chrome-muted transition-colors hover:bg-surface-2 hover:text-chrome"
          >
            <Bell aria-hidden className="size-5" />
            {openReports > 0 && (
              <span aria-hidden className="absolute right-2 top-2 size-2 rounded-full bg-lime ring-2 ring-white" />
            )}
          </Link>
        </header>

        <main className="flex-1 p-5 sm:p-6 lg:p-9">{children}</main>
      </div>
    </div>
  );
}
