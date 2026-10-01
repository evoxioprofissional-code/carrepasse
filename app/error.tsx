"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

/** Falha ao montar uma página (ex.: banco fora do ar): mensagem em português e "tentar de novo". */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-16">
      <EmptyState
        icon={<TriangleAlert aria-hidden />}
        title="Não foi possível abrir esta página"
        description="Pode ser uma instabilidade rápida. Verifique sua internet e tente de novo."
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => retry()}>
              <RefreshCw aria-hidden className="size-4" />
              Tentar de novo
            </Button>
            <ButtonLink href="/" variant="secondary">
              Ir para o início
            </ButtonLink>
          </div>
        }
      />
    </Container>
  );
}
