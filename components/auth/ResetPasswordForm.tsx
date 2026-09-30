"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/validation";
import { authRepository } from "@/repositories/authRepository";
import { AuthCard } from "./AuthCard";
import { PasswordField } from "./PasswordField";

/** Nova senha, depois de entrar pelo link de recuperação enviado por e-mail. */
export function ResetPasswordForm() {
  const { state } = useAuth();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = handleSubmit(async ({ password }) => {
    setError(null);
    try {
      await authRepository.updatePassword(password);
      setDone(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível trocar a senha.");
    }
  });

  const footer = (
    <Link href="/" className="inline-block py-2 font-semibold text-lime-ink hover:text-ink">
      Ir para o início
    </Link>
  );

  if (state.status === "loading") {
    return (
      <AuthCard title="Nova senha" description="Carregando…" footer={footer}>
        <Skeleton className="h-32 w-full" />
      </AuthCard>
    );
  }

  if (state.status === "anonymous") {
    return (
      <AuthCard title="Link expirado" description="Não conseguimos confirmar quem é você." footer={footer}>
        <div className="flex flex-col gap-4">
          <Alert variant="warning">
            O link de redefinição vale por 1 hora e só pode ser usado uma vez. Peça um novo para continuar.
          </Alert>
          <ButtonLink href="/esqueci-senha" size="lg" fullWidth>
            Pedir novo link
          </ButtonLink>
        </div>
      </AuthCard>
    );
  }

  if (done) {
    return (
      <AuthCard title="Senha alterada" description="Você já está conectado com a nova senha." footer={footer}>
        <div className="flex flex-col gap-4">
          <Alert variant="success">Pronto! Da próxima vez, entre com a senha nova.</Alert>
          <ButtonLink href="/minha-conta/perfil" size="lg" fullWidth>
            Ir para minha conta
          </ButtonLink>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Nova senha" description={`Crie uma nova senha para ${state.user.email}.`} footer={footer}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {error && <Alert variant="danger">{error}</Alert>}
        <PasswordField
          label="Nova senha"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordField
          label="Repita a nova senha"
          autoComplete="new-password"
          error={errors.confirm?.message}
          {...register("confirm")}
        />
        <Button type="submit" size="lg" fullWidth loading={isSubmitting} className="mt-2">
          Salvar nova senha
        </Button>
      </form>
    </AuthCard>
  );
}
