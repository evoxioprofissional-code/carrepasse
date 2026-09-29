"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { CityField } from "@/components/forms/CityField";
import { SellerTypeField } from "@/components/forms/SellerTypeField";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/hooks/useAuth";
import { STATE_OPTIONS } from "@/lib/brazil";
import { formatPhoneInput } from "@/lib/format";
import { safeRedirect } from "@/lib/redirect";
import { signUpSchema, type SignUpData, type SignUpValues } from "@/lib/validation";
import { authRepository } from "@/repositories/authRepository";
import { AuthCard } from "./AuthCard";
import { PasswordField } from "./PasswordField";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = safeRedirect(searchParams.get("redirect"));
  const { refresh } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues, unknown, SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", city: "", state: "", storeName: "" },
  });

  const sellerType = useWatch({ control, name: "sellerType" });
  const state = useWatch({ control, name: "state" });

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    try {
      await authRepository.signUp(data);
      await refresh();
      router.replace(redirect === "/" ? "/minha-conta/perfil?bemvindo=1" : redirect);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível criar a conta.");
    }
  });

  const loginHref = redirect === "/" ? "/entrar" : `/entrar?redirect=${encodeURIComponent(redirect)}`;

  return (
    <AuthCard
      wide
      title="Crie sua conta"
      description="Grátis para comprar e anunciar. Leva menos de um minuto."
      footer={
        <>
          Já tem conta?{" "}
          <Link href={loginHref} className="font-semibold text-brand hover:text-brand-dark">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        {error && <Alert variant="danger">{error}</Alert>}

        <Controller
          control={control}
          name="sellerType"
          render={({ field }) => (
            <SellerTypeField value={field.value} onChange={field.onChange} error={errors.sellerType?.message} />
          )}
        />

        {sellerType === "lojista" && (
          <Input label="Nome da loja" required autoComplete="organization" error={errors.storeName?.message} {...register("storeName")} />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Seu nome" required autoComplete="name" error={errors.name?.message} {...register("name")} />
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <Input
                label="WhatsApp"
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="(81) 99999-8888"
                hint="Compradores falam com você por aqui."
                error={errors.phone?.message}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                value={field.value}
                onChange={(event) => field.onChange(formatPhoneInput(event.target.value))}
              />
            )}
          />
          <Input label="E-mail" required type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
          <PasswordField label="Senha" required autoComplete="new-password" error={errors.password?.message} {...register("password")} />
          <Select
            label="Estado"
            required
            placeholder="Escolha"
            options={STATE_OPTIONS}
            error={errors.state?.message}
            {...register("state", { onChange: () => setValue("city", "") })}
          />
          <CityField uf={state} required error={errors.city?.message} {...register("city")} />
        </div>

        <Controller
          control={control}
          name="acceptTerms"
          render={({ field }) => (
            <Checkbox
              label={
                <>
                  Li e aceito os{" "}
                  <Link href="/termos" className="text-brand underline-offset-2 hover:underline" target="_blank">
                    termos de uso
                  </Link>{" "}
                  e a{" "}
                  <Link href="/privacidade" className="text-brand underline-offset-2 hover:underline" target="_blank">
                    política de privacidade
                  </Link>
                  .
                </>
              }
              checked={field.value === true}
              onChange={(event) => field.onChange(event.target.checked)}
              error={errors.acceptTerms?.message}
            />
          )}
        />

        <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
          Criar conta
        </Button>
      </form>
    </AuthCard>
  );
}
