"use client";

import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { SignInRequired } from "@/components/auth/SignInRequired";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";

interface AdminOnlyProps {
  /** Recebe o id do administrador logado. */
  children: (userId: string) => ReactNode;
}

/** Mostra o conteúdo só para administradores (o banco também confere). */
export function AdminOnly({ children }: AdminOnlyProps) {
  const { state } = useAuth();

  if (state.status === "loading") {
    return (
      <Container className="max-w-4xl py-8">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </Container>
    );
  }
  if (state.status === "anonymous") {
    return (
      <Container className="max-w-4xl py-16">
        <SignInRequired />
      </Container>
    );
  }
  if (!state.isAdmin) {
    return (
      <Container className="max-w-4xl py-16">
        <EmptyState icon={<ShieldCheck aria-hidden />} title="Acesso restrito" description="Esta página é só para a equipe do Car Repasse." />
      </Container>
    );
  }
  return children(state.user.id);
}
