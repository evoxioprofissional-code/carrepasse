"use client";

import { Flag, LayoutDashboard, Megaphone, UsersRound, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOpenReports } from "@/hooks/useOpenReports";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/admin", label: "Painel", Icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuários", Icon: UsersRound },
  { href: "/admin/anuncios", label: "Anúncios", Icon: Megaphone },
  { href: "/admin/denuncias", label: "Denúncias", Icon: Flag },
  { href: "/admin/faturamento", label: "Faturamento", Icon: Wallet },
];

/** Abas entre as páginas da equipe. */
export function AdminNav() {
  const pathname = usePathname();
  const openReports = useOpenReports();

  return (
    <nav
      aria-label="Administração"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
    >
      {LINKS.map(({ href, label, Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition duration-150",
              active ? "border-lime-ink bg-lime-soft text-lime-ink" : "border-border text-chrome-muted hover:text-chrome",
            )}
          >
            <Icon aria-hidden className="size-4" />
            {label}
            {href === "/admin/denuncias" && openReports > 0 && (
              <span className="rounded-full bg-danger px-2 py-0.5 text-xs font-bold text-white">{openReports}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
