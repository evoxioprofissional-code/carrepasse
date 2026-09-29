"use client";

import { Heart, LogIn, LogOut, Megaphone, Menu, Plus, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/cn";
import { MAIN_NAV } from "@/lib/site";

const GUEST_LINKS = [
  { href: "/minha-conta/favoritos", label: "Favoritos", Icon: Heart },
  { href: "/entrar", label: "Entrar", Icon: LogIn },
];

const ACCOUNT_LINKS = [
  { href: "/minha-conta/perfil", label: "Minha conta", Icon: UserRound },
  { href: "/minha-conta/anuncios", label: "Meus anúncios", Icon: Megaphone },
  { href: "/minha-conta/favoritos", label: "Favoritos", Icon: Heart },
];

/** Menu do celular: os mesmos links do header num painel que sobe de baixo. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { state, signOut } = useAuth();
  const close = () => setOpen(false);
  const extraLinks = state.status === "authenticated" ? ACCOUNT_LINKS : GUEST_LINKS;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={open}
        className="flex size-10 items-center justify-center rounded-md text-white transition duration-150 hover:bg-white/10 lg:hidden"
      >
        <Menu aria-hidden className="size-6" />
      </button>

      <Modal open={open} onClose={close} variant="sheet" title="Menu">
        <nav aria-label="Menu principal">
          <ul className="flex flex-col">
            {MAIN_NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-3 text-base font-medium transition duration-150 hover:bg-surface-2",
                    pathname === link.href ? "text-brand" : "text-chrome",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {extraLinks.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={close}
                  className="flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-chrome transition duration-150 hover:bg-surface-2"
                >
                  <Icon aria-hidden className="size-5 text-chrome-muted" />
                  {label}
                </Link>
              </li>
            ))}
            {state.status === "authenticated" && (
              <li>
                <button
                  type="button"
                  onClick={async () => {
                    close();
                    await signOut();
                    router.replace("/");
                    router.refresh();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-base font-medium text-chrome transition duration-150 hover:bg-surface-2"
                >
                  <LogOut aria-hidden className="size-5 text-chrome-muted" />
                  Sair
                </button>
              </li>
            )}
          </ul>
          <Link
            href="/anunciar"
            onClick={close}
            className="mt-3 flex h-12 items-center justify-center gap-2 rounded-lg bg-lime font-semibold text-ink transition duration-150 hover:bg-lime-hover"
          >
            <Plus aria-hidden className="size-5" strokeWidth={2.5} />
            Anunciar grátis
          </Link>
        </nav>
      </Modal>
    </>
  );
}
