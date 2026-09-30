"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validation";
import { authRepository } from "@/repositories/authRepository";
import { AuthCard } from "./AuthCard";

export function ForgotPasswordForm() {
  const invalidLink = useSearchParams().get("link") === "invalido";
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = handleSubmit(async ({ email }) => {
    setError(null);
    try {
      await authRepository.requestPasswordReset(email);
      setSentTo(email);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível enviar agora. Tente de novo.");
    }
  });

  const footer = (
    <Link href="/entrar" className="inline-block py-2 font-semibold text-lime-ink hover:text-ink">
      Voltar para o login
    </Link>
  );

  if (sentTo) {
    return (
      <AuthCard title="Confira seu e-mail" description="O link vale por 1 hora." footer={footer}>
        <Alert variant="success">
          Se existir uma conta com <strong className="text-chrome">{sentTo}</strong>, você vai receber um link para criar
          uma nova senha. Confira também a caixa de spam.
        </Alert>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Esqueci minha senha"
      description="Digite o e-mail da sua conta e enviamos um link para criar uma nova senha."
      footer={footer}
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {invalidLink && (
          <Alert variant="warning">O link que você abriu expirou ou já foi usado. Peça um novo abaixo.</Alert>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
        <Input label="E-mail" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <Button type="submit" size="lg" fullWidth loading={isSubmitting} className="mt-2">
          Enviar link
        </Button>
      </form>
    </AuthCard>
  );
}
