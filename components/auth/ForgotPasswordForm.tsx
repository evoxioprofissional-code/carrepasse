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
import { Captcha, captchaEnabled } from "./Captcha";

export function ForgotPasswordForm() {
  const invalidLink = useSearchParams().get("link") === "invalido";
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // O token do captcha vale uma vez: depois de um erro, o widget é recriado.
  const [captchaKey, setCaptchaKey] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const waitingCaptcha = captchaEnabled && !captchaToken;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = handleSubmit(async ({ email }) => {
    setError(null);
    try {
      await authRepository.requestPasswordReset(email, captchaToken ?? undefined);
      setSentTo(email);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível enviar agora. Tente de novo.");
      setCaptchaToken(null);
      setCaptchaKey((key) => key + 1);
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
        <Captcha key={captchaKey} onToken={setCaptchaToken} />
        <Button type="submit" size="lg" fullWidth loading={isSubmitting} disabled={waitingCaptcha} className="mt-2">
          Enviar link
        </Button>
      </form>
    </AuthCard>
  );
}
