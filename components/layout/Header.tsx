import { LogIn, Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";

// "Entrar" vira avatar/menu do usuário na Fase 6 (autenticação).
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-4 md:h-16">
        <Logo />

        <nav aria-label="Principal" className="hidden md:block">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/entrar" variant="ghost" size="sm">
            <LogIn aria-hidden className="size-4" />
            Entrar
          </ButtonLink>
          <ButtonLink href="/anunciar" size="sm" className="hidden md:inline-flex">
            <Plus aria-hidden className="size-4" />
            Anunciar grátis
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
