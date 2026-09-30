"use client";

import { ArrowLeft, ArrowRight, Camera, ImagePlus, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/cn";
import { compressImage } from "@/lib/image-compress";
import { MAX_PHOTOS, type ListingFormErrors, type ListingFormValues } from "@/lib/listing-form";
import { photoRepository } from "@/repositories/photoRepository";

interface StepPhotosProps {
  values: ListingFormValues;
  errors: ListingFormErrors;
  onChange: (patch: Partial<ListingFormValues>) => void;
  userId: string;
  /** Pasta das fotos deste anúncio no Storage. */
  folder: string;
  /** Avisa o wizard enquanto há fotos subindo (bloqueia o "Continuar"). */
  onBusyChange: (busy: boolean) => void;
  /**
   * Criando: a foto removida não está em nenhum anúncio e já sai do Storage.
   * Editando: o anúncio publicado ainda usa a foto; ela só sai ao salvar.
   */
  deleteOnRemove: boolean;
}

interface Pending {
  key: string;
  preview: string;
  failed: boolean;
}

const TIPS = ["Frente", "Traseira", "As duas laterais", "Interior e bancos", "Painel com a km", "Motor"];

export function StepPhotos({ values, errors, onChange, userId, folder, onBusyChange, deleteOnRemove }: StepPhotosProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Pending[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  // Lista mais recente de fotos para o laço de envio (que atravessa vários renders).
  const photosRef = useRef(values.photos);
  useEffect(() => {
    photosRef.current = values.photos;
  }, [values.photos]);

  const uploading = pending.some((item) => !item.failed);
  useEffect(() => onBusyChange(uploading), [uploading, onBusyChange]);

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setMessage(null);
    const room = MAX_PHOTOS - values.photos.length - pending.filter((item) => !item.failed).length;
    const selected = [...files].filter((file) => file.type.startsWith("image/")).slice(0, Math.max(0, room));
    if (files.length > selected.length) setMessage(`Cabem até ${MAX_PHOTOS} fotos por anúncio.`);

    const batch = selected.map((file) => ({ file, key: `${file.name}-${file.size}-${Math.random()}`, preview: URL.createObjectURL(file) }));
    setPending((current) => [...current, ...batch.map(({ key, preview }) => ({ key, preview, failed: false }))]);

    // Uma de cada vez: celular com rede fraca não trava.
    for (const item of batch) {
      try {
        const blob = await compressImage(item.file);
        const url = await photoRepository.upload(userId, folder, blob);
        photosRef.current = [...photosRef.current, url];
        onChange({ photos: photosRef.current });
        setPending((current) => current.filter((entry) => entry.key !== item.key));
        URL.revokeObjectURL(item.preview);
      } catch {
        setPending((current) => current.map((entry) => (entry.key === item.key ? { ...entry, failed: true } : entry)));
      }
    }
  };

  const move = (index: number, delta: number) => {
    const next = [...values.photos];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange({ photos: next });
  };

  const makeCover = (index: number) => {
    const next = [...values.photos];
    const [photo] = next.splice(index, 1);
    onChange({ photos: [photo, ...next] });
  };

  const remove = (index: number) => {
    const photo = values.photos[index];
    onChange({ photos: values.photos.filter((_, i) => i !== index) });
    if (deleteOnRemove && photo) void photoRepository.remove([photo]).catch(() => {});
  };

  const total = values.photos.length + pending.filter((item) => !item.failed).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl text-chrome sm:text-3xl">Fotos do carro</h1>
        <p className="mt-1 text-sm text-chrome-muted sm:text-base">
          De 1 a {MAX_PHOTOS} fotos. A primeira é a capa do anúncio.
        </p>
      </div>

      <div className="flex gap-2 rounded-lg bg-surface-2 p-3 text-sm text-chrome-muted">
        <Camera aria-hidden className="mt-0.5 size-4 shrink-0 text-lime-ink" />
        <p>
          Tire com luz do dia, carro limpo: <span className="text-chrome">{TIPS.join(" · ")}</span>.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          void addFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {(errors.photos || message) && <Alert variant="danger">{errors.photos ?? message}</Alert>}

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {values.photos.map((url, index) => (
          <li key={url} className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="relative aspect-[4/3] bg-surface-2">
              <Image src={url} alt={`Foto ${index + 1}`} fill unoptimized sizes="(min-width: 640px) 240px, 50vw" className="object-cover" />
              {index === 0 && (
                <span className="absolute left-2 top-2 rounded bg-brand px-1.5 py-0.5 text-[11px] font-bold text-ink">Capa</span>
              )}
            </div>
            <div className="grid grid-cols-4">
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Mover foto ${index + 1} para a esquerda`} className="flex h-11 items-center justify-center text-chrome-muted hover:text-chrome disabled:opacity-30">
                <ArrowLeft aria-hidden className="size-4" />
              </button>
              <button type="button" onClick={() => makeCover(index)} disabled={index === 0} aria-label={`Usar foto ${index + 1} como capa`} className="flex h-11 items-center justify-center text-chrome-muted hover:text-lime-ink disabled:opacity-30">
                <Star aria-hidden className="size-4" />
              </button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === values.photos.length - 1} aria-label={`Mover foto ${index + 1} para a direita`} className="flex h-11 items-center justify-center text-chrome-muted hover:text-chrome disabled:opacity-30">
                <ArrowRight aria-hidden className="size-4" />
              </button>
              <button type="button" onClick={() => remove(index)} aria-label={`Remover foto ${index + 1}`} className="flex h-11 items-center justify-center text-chrome-muted hover:text-danger-ink">
                <Trash2 aria-hidden className="size-4" />
              </button>
            </div>
          </li>
        ))}

        {pending.map((item) => (
          <li key={item.key} className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="relative aspect-[4/3] bg-surface-2">
              <Image src={item.preview} alt="" fill unoptimized sizes="50vw" className={cn("object-cover", !item.failed && "opacity-50")} />
              <div className="absolute inset-0 flex items-center justify-center">
                {item.failed ? (
                  <span className="rounded bg-danger px-2 py-1 text-xs font-semibold text-white">Falhou</span>
                ) : (
                  <Spinner className="size-6 text-white" label="Enviando foto" />
                )}
              </div>
            </div>
            {item.failed && (
              <button
                type="button"
                onClick={() => setPending((current) => current.filter((entry) => entry.key !== item.key))}
                className="h-11 w-full text-sm text-chrome-muted hover:text-chrome"
              >
                Tirar da lista
              </button>
            )}
          </li>
        ))}

        {total < MAX_PHOTOS && (
          <li>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-chrome-muted transition duration-150 hover:border-lime-ink hover:text-lime-ink"
            >
              <ImagePlus aria-hidden className="size-7" />
              <span className="text-sm font-semibold">{total === 0 ? "Adicionar fotos" : "Mais fotos"}</span>
              <span className="text-xs">
                {total}/{MAX_PHOTOS}
              </span>
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
