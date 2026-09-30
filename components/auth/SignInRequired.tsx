"use client";

import { LogIn } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuth } from "@/hooks/useAuth";

/**
 * Página que exige login, mas a sessão caiu (saiu em outra aba) ou o perfil
 * não carregou. Sem isso, o esqueleto de carregamento ficaria na tela para sempre.
 */
export function SignInRequired() {
  const pathname = usePathname();
  const router = useRouter();
  const { refresh, signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  // Sai antes de ir para /entrar: com sessão ativa o proxy mandaria de volta para cá.
  const signInAgain = async () => {
    setBusy(true);
    await signOut();
    router.push(`/entrar?redirect=${encodeURIComponent(pathname)}`);
  };

  return (
    <EmptyState
      icon={<LogIn aria-hidden />}
      title="Não foi possível carregar sua conta"
      description="Verifique sua internet. Se a sessão expirou, entre de novo para continuar."
      action={
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" disabled={busy} onClick={() => void refresh()}>
            Tentar de novo
          </Button>
          <Button loading={busy} onClick={() => void signInAgain()}>
            Entrar de novo
          </Button>
        </div>
      }
    />
  );
}
