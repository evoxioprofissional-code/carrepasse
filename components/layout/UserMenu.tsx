"use client";

import { ChevronDown, Heart, LogOut, Megaphone, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const LINKS = [
  { href: "/minha-conta/perfil", label: "Minha conta", Icon: UserRound },
  { href: "/minha-conta/anuncios", label: "Meus anúncios", Icon: Megaphone },
  { href: "/minha-conta/favoritos", label: "Favoritos", Icon: Heart },
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "")).toUpperCase();
}

/** "Entrar" para visitantes; avatar com menu para quem está logado. */
export function UserMenu() {
  const { state, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (state.status === "loading") {
    return <span aria-hidden className="hidden h-10 w-24 animate-pulse rounded-md bg-white/5 sm:block" />;
  }

  if (state.status === "anonymous") {
    return (
      <Link
        href="/entrar"
        className="hidden h-10 items-center gap-2 rounded-md px-3 text-[15px] font-medium text-white transition duration-150 hover:text-lime sm:flex"
      >
        <UserRound aria-hidden className="size-5" />
        Entrar
      </Link>
    );
  }

  const { user } = state;
  const firstName = user.name.split(/\s+/)[0];

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-10 items-center gap-2 rounded-md px-2 text-[15px] font-medium text-white transition duration-150 hover:bg-white/10"
      >
        <span aria-hidden className="flex size-8 items-center justify-center rounded-full bg-lime text-sm font-bold text-ink">
          {initials(user.name)}
        </span>
        <span className="max-w-[120px] truncate">{firstName}</span>
        <ChevronDown aria-hidden className="size-4 text-white/70" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-xl shadow-black/40"
        >
          <p className="truncate border-b border-border px-4 py-2.5 text-xs text-chrome-muted">{user.email}</p>
          {LINKS.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-chrome transition duration-150 hover:bg-surface-2"
            >
              <Icon aria-hidden className="size-4 text-chrome-muted" />
              {label}
            </Link>
          ))}
          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await signOut();
              router.replace("/");
              router.refresh();
            }}
            className="flex w-full items-center gap-2.5 border-t border-border px-4 py-2.5 text-left text-sm text-chrome transition duration-150 hover:bg-surface-2"
          >
            <LogOut aria-hidden className="size-4 text-chrome-muted" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
