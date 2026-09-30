"use client";

import { Camera, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { SellerAvatar } from "@/components/seller/SellerAvatar";
import { Button } from "@/components/ui/Button";
import { compressImage } from "@/lib/image-compress";
import { photoRepository } from "@/repositories/photoRepository";
import { userRepository } from "@/repositories/userRepository";
import type { User } from "@/types/user";

interface AvatarPickerProps {
  user: User;
  onChanged: () => Promise<void>;
}

/** Foto de perfil (ou logo, para lojistas) que aparece nos anúncios. */
export function AvatarPicker({ user, onChanged }: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isStore = user.sellerType === "lojista";
  const label = isStore ? "Logo da loja" : "Foto de perfil";

  const replace = async (next: string | null) => {
    const previous = user.avatarUrl;
    await userRepository.updateAvatar(user.id, next);
    if (previous) void photoRepository.remove([previous]).catch(() => {});
    await onChanged();
  };

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await compressImage(file, 512, 0.85);
      const url = await photoRepository.upload(user.id, "perfil", blob);
      await replace(url);
    } catch {
      setError("Não foi possível enviar a foto. Tente outra imagem.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    setError(null);
    try {
      await replace(null);
    } catch {
      setError("Não foi possível remover a foto.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <SellerAvatar name={user.storeName ?? user.name} src={user.avatarUrl} size="lg" className={busy ? "opacity-60" : undefined} />
      <div className="flex min-w-0 flex-col gap-2">
        <div>
          <p className="text-sm font-semibold text-chrome">{label}</p>
          <p className="text-xs text-chrome-muted">
            {isStore ? "Aparece nos seus anúncios e dá mais confiança ao comprador." : "Aparece nos seus anúncios (opcional)."}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(event) => {
            void upload(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" loading={busy} onClick={() => inputRef.current?.click()}>
            {!busy && <Camera aria-hidden className="size-4" />}
            {user.avatarUrl ? "Trocar" : "Enviar"} {isStore ? "logo" : "foto"}
          </Button>
          {user.avatarUrl && (
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => void remove()}>
              <Trash2 aria-hidden className="size-4" />
              Remover
            </Button>
          )}
        </div>
        {error && (
          <p role="alert" className="text-xs text-danger-ink">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
