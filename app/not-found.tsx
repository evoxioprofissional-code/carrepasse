import { Car, SearchX } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <Container className="py-16">
      <EmptyState
        icon={<SearchX aria-hidden />}
        title="Página não encontrada"
        description="O link pode estar errado ou o anúncio já saiu do ar."
        action={
          <ButtonLink href="/carros">
            <Car aria-hidden className="size-4" />
            Ver carros à venda
          </ButtonLink>
        }
      />
    </Container>
  );
}
