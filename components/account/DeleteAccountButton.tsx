"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";
import { authRepository } from "@/repositories/authRepository";

const CONFIRM_WORD = "EXCLUIR";

/** Exclusão definitiva da conta, com confirmação digitada. */
export function DeleteAccountButton({ userId }: { userId: string }) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (deleting) return;
    setOpen(false);
    setTyped("");
    setError(null);
  };

  const confirm = async () => {
    setDeleting(true);
    setError(null);
    try {
      await authRepository.deleteAccount(userId);
      await refresh();
      router.replace("/");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível excluir a conta.");
      setDeleting(false);
    }
  };

  return (
    <>
      <Button variant="ghost" className="self-start text-danger-ink hover:text-danger-ink" onClick={() => setOpen(true)}>
        <Trash2 aria-hidden className="size-4" />
        Excluir minha conta
      </Button>

      <Modal
        open={open}
        onClose={close}
        title="Excluir sua conta?"
        description="Isso não pode ser desfeito."
        footer={
          <>
            <Button variant="ghost" onClick={close} disabled={deleting}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              loading={deleting}
              disabled={typed.trim().toUpperCase() !== CONFIRM_WORD}
              onClick={() => void confirm()}
            >
              Excluir de vez
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4 text-sm text-chrome-muted">
          {error && <Alert variant="danger">{error}</Alert>}
          <p>
            Vamos apagar seu perfil, <strong className="text-chrome">todos os seus anúncios</strong> (com as fotos) e seus
            favoritos. Denúncias que você fez continuam, mas sem o seu nome.
          </p>
          <Input
            label={`Para confirmar, digite ${CONFIRM_WORD}`}
            value={typed}
            autoComplete="off"
            autoCapitalize="characters"
            onChange={(event) => setTyped(event.target.value)}
          />
        </div>
      </Modal>
    </>
  );
}
