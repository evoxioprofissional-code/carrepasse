"use client";

import { Heart, House, Plus, Search, User, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

interface BottomNavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
}

const items: BottomNavItem[] = [
  { href: "/", label: "Início", Icon: House },
  { href: "/carros", label: "Buscar", Icon: Search },
  { href: "/anunciar", label: "Anunciar", Icon: Plus },
  { href: "/minha-conta/favoritos", label: "Favoritos", Icon: Heart },
  { href: "/minha-conta/perfil", label: "Conta", Icon: User },
];

/** Navegação fixa no rodapé, só no celular. */
export function BottomNav() {
  const pathname = usePathname();
  // No anúncio em etapas a barra Voltar/Continuar ocupa o rodapé.
  if (pathname.startsWith("/anunciar") || pathname.endsWith("/editar")) return null;

  return (
    <nav
      aria-label="Navegação rápida"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="grid h-16 grid-cols-5">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          const isCta = href === "/anunciar";

          return (
            <li key={href} className="flex">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 text-[0.7rem] font-medium transition duration-150",
                  active ? "text-brand" : "text-chrome-muted hover:text-chrome",
                )}
              >
                {isCta ? (
                  <span className="-mt-6 flex size-12 items-center justify-center rounded-full bg-brand-gradient text-bg shadow-lg shadow-brand/20 ring-4 ring-bg">
                    <Icon aria-hidden className="size-6" strokeWidth={2.5} />
                  </span>
                ) : (
                  <Icon aria-hidden className="size-5" />
                )}
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
