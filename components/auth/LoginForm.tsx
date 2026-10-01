"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { safeRedirect } from "@/lib/redirect";
import { signInSchema, type SignInValues } from "@/lib/validation";
import { authRepository } from "@/repositories/authRepository";
import { AuthCard } from "./AuthCard";
import { Captcha, captchaEnabled } from "./Captcha";
import { PasswordField } from "./PasswordField";


export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = safeRedirect(searchParams.get("redirect"));
  const { refresh } = useAuth();
  const [error, setError] = useState<string | null>(null);
  // O token do captcha vale uma vez: depois de um erro, o widget é recriado.
  const [captchaKey, setCaptchaKey] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const waitingCaptcha = captchaEnabled && !captchaToken;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setError(null);
    try {
      await authRepository.signIn(email, password, captchaToken ?? undefined);
      await refresh();
      router.replace(redirect);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível entrar.");
      setCaptchaToken(null);
      setCaptchaKey((key) => key + 1);
    }
  });

  const signupHref = redirect === "/" ? "/cadastro" : `/cadastro?redirect=${encodeURIComponent(redirect)}`;

  return (
    <AuthCard
      title="Entrar"
      description="Acesse para anunciar, salvar favoritos e falar com vendedores."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link href={signupHref} className="inline-block py-2 font-semibold text-lime-ink hover:text-ink">
            Cadastre-se grátis
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {error && <Alert variant="danger">{error}</Alert>}
        <Input label="E-mail" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <PasswordField label="Senha" autoComplete="current-password" error={errors.password?.message} {...register("password")} />
        <Captcha key={captchaKey} onToken={setCaptchaToken} />
        <Button type="submit" size="lg" fullWidth loading={isSubmitting} disabled={waitingCaptcha} className="mt-2">
          Entrar
        </Button>
        <Link
          href="/esqueci-senha"
          className="mx-auto inline-block py-2 text-sm font-semibold text-lime-ink underline-offset-4 hover:underline"
        >
          Esqueci minha senha
        </Link>
      </form>
    </AuthCard>
  );
}
