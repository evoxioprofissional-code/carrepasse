import { Heart, LogIn, Plus } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { HeaderSearch } from "./HeaderSearch";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";

// "Entrar" vira avatar/menu do usuário na Fase 6 (autenticação).
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
      <Container className="flex h-16 items-center gap-4 lg:h-[72px] lg:gap-8">
        <Logo />

        <HeaderSearch className="hidden max-w-md flex-1 md:block" />

        <nav aria-label="Principal" className="hidden xl:block">
          <NavLinks />
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            href="/minha-conta/favoritos"
            aria-label="Favoritos"
            className="hidden size-10 items-center justify-center rounded-lg text-chrome-muted transition duration-150 hover:bg-surface-2 hover:text-chrome md:flex"
          >
            <Heart aria-hidden className="size-5" />
          </Link>
          <ButtonLink href="/entrar" variant="ghost" size="sm" className="h-10">
            <LogIn aria-hidden className="size-4" />
            Entrar
          </ButtonLink>
          <ButtonLink href="/anunciar" className="hidden h-10 md:inline-flex">
            <Plus aria-hidden className="size-4" strokeWidth={2.5} />
            Anunciar grátis
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
