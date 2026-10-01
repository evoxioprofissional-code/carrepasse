"use client";

import { Flag, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOpenReports } from "@/hooks/useOpenReports";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/admin", label: "Painel", Icon: LayoutDashboard },
  { href: "/admin/denuncias", label: "Denúncias", Icon: Flag },
];

/** Abas entre as páginas da equipe. */
export function AdminNav() {
  const pathname = usePathname();
  const openReports = useOpenReports();

  return (
    <nav aria-label="Administração" className="flex gap-2">
      {LINKS.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition duration-150",
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
