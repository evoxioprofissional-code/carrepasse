"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { CityField } from "@/components/forms/CityField";
import { SellerTypeField } from "@/components/forms/SellerTypeField";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { STATE_OPTIONS } from "@/lib/brazil";
import { formatMonthYear, formatPhone, formatPhoneInput } from "@/lib/format";
import { profileSchema, type ProfileData, type ProfileValues } from "@/lib/validation";
import { userRepository } from "@/repositories/userRepository";
import type { User } from "@/types/user";

interface ProfileFormProps {
  user: User;
  onSaved: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

export function ProfileForm({ user, onSaved, onSignOut }: ProfileFormProps) {
  const router = useRouter();
  const welcome = useSearchParams().get("bemvindo") === "1";
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileValues, unknown, ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phone: formatPhone(user.phone),
      sellerType: user.sellerType,
      storeName: user.storeName ?? "",
      city: user.city,
      state: user.state,
    },
  });

  const sellerType = useWatch({ control, name: "sellerType" });
  const state = useWatch({ control, name: "state" });

  const onSubmit = handleSubmit(async (data) => {
    setStatus("idle");
    try {
      await userRepository.update(user.id, {
        ...data,
        storeName: data.sellerType === "lojista" ? data.storeName : undefined,
      });
      await onSaved();
      reset({ ...data, phone: formatPhone(data.phone), storeName: data.storeName ?? "" });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  });

  return (
    <div className="flex flex-col gap-6">
      {welcome && (
        <Alert variant="success" title="Conta criada!">
          Confira seus dados abaixo. Quando quiser, anuncie seu primeiro carro — é grátis.
        </Alert>
      )}

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        {status === "saved" && <Alert variant="success">Perfil atualizado.</Alert>}
        {status === "error" && <Alert variant="danger">Não foi possível salvar. Tente de novo.</Alert>}

        <Controller
          control={control}
          name="sellerType"
          render={({ field }) => (
            <SellerTypeField value={field.value} onChange={field.onChange} error={errors.sellerType?.message} />
          )}
        />
        {sellerType === "lojista" && (
          <Input label="Nome da loja" required error={errors.storeName?.message} {...register("storeName")} />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nome" required autoComplete="name" error={errors.name?.message} {...register("name")} />
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <Input
                label="WhatsApp"
                required
                type="tel"
                inputMode="tel"
                hint="Aparece no botão de contato dos seus anúncios."
                error={errors.phone?.message}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                value={field.value}
                onChange={(event) => field.onChange(formatPhoneInput(event.target.value))}
              />
            )}
          />
          <Select
            label="Estado"
            required
            options={STATE_OPTIONS}
            error={errors.state?.message}
            {...register("state", { onChange: () => setValue("city", "", { shouldDirty: true }) })}
          />
          <CityField uf={state} required error={errors.city?.message} {...register("city")} />
          <Input label="E-mail" value={user.email} disabled readOnly hint="Para trocar o e-mail, fale com a gente." />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-chrome-muted">No Car Repasse desde {formatMonthYear(user.createdAt)}</p>
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
            Salvar alterações
          </Button>
        </div>
      </form>

      <Button
        variant="ghost"
        className="self-start"
        onClick={async () => {
          await onSignOut();
          router.replace("/");
          router.refresh();
        }}
      >
        <LogOut aria-hidden className="size-4" />
        Sair da conta
      </Button>
    </div>
  );
}
