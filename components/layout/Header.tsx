import { Heart, Plus, UserRound } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

// "Entrar" vira avatar/menu do usuário na Fase 6 (autenticação).
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-night">
      <Container className="flex h-14 items-center justify-between gap-4 lg:h-[58px]">
        <Logo />

        <nav aria-label="Principal" className="hidden lg:block">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/minha-conta/favoritos"
            aria-label="Favoritos"
            className="flex size-10 items-center justify-center rounded-md text-white transition duration-150 hover:text-lime"
          >
            <Heart aria-hidden className="size-[22px]" />
          </Link>
          <Link
            href="/entrar"
            className="hidden h-10 items-center gap-2 rounded-md px-3 text-[15px] font-medium text-white transition duration-150 hover:text-lime sm:flex"
          >
            <UserRound aria-hidden className="size-5" />
            Entrar
          </Link>
          <Link
            href="/anunciar"
            className="ml-1 hidden h-10 items-center gap-2 rounded-md bg-lime px-4 text-[15px] font-semibold text-ink transition duration-150 hover:bg-lime-hover md:flex"
          >
            <Plus aria-hidden className="size-5" strokeWidth={2.5} />
            Anunciar grátis
          </Link>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
