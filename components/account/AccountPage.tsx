"use client";

import { Heart, Megaphone, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/cn";
import type { User } from "@/types/user";

const TABS = [
  { href: "/minha-conta/perfil", label: "Perfil", Icon: UserRound },
  { href: "/minha-conta/favoritos", label: "Favoritos", Icon: Heart },
  { href: "/minha-conta/anuncios", label: "Meus anúncios", Icon: Megaphone },
];

interface AccountPageProps {
  title: string;
  children: (user: User) => ReactNode;
}

/**
 * Moldura das páginas de conta. O proxy já barra quem não está logado;
 * aqui só esperamos o perfil carregar.
 */
export function AccountPage({ title, children }: AccountPageProps) {
  const { state } = useAuth();
  const pathname = usePathname();

  return (
    <Container className="max-w-5xl py-8 lg:py-12">
      <h1 className="text-3xl text-chrome sm:text-4xl">{title}</h1>
      <nav aria-label="Minha conta" className="mt-5 border-b border-border">
        <ul className="scrollbar-none -mb-px flex gap-1 overflow-x-auto">
          {TABS.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <li key={href} className="shrink-0">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition duration-150",
                    active ? "border-lime-ink text-lime-ink" : "border-transparent text-chrome-muted hover:text-chrome",
                  )}
                >
                  <Icon aria-hidden className="size-4" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-8">
        {state.status === "authenticated" ? (
          children(state.user)
        ) : (
          <div className="flex flex-col gap-4" aria-busy>
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        )}
      </div>
    </Container>
  );
}
