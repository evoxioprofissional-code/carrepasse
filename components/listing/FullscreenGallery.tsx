"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ListingPhoto } from "./ListingPhoto";

interface FullscreenGalleryProps {
  open: boolean;
  onClose: () => void;
  photos: string[];
  title: string;
  startIndex: number;
  /** Sincroniza a galeria da página com a foto vista aqui. */
  onIndexChange: (index: number) => void;
}

export function FullscreenGallery({
  open,
  onClose,
  photos,
  title,
  startIndex,
  onIndexChange,
}: FullscreenGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: photos.length > 1, startIndex });
  const [selected, setSelected] = useState(startIndex);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      emblaApi?.reInit({ startIndex });
      emblaApi?.scrollTo(startIndex, true);
    }
    if (!open && dialog.open) dialog.close();
  }, [open, emblaApi, startIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      setSelected(index);
      onIndexChange(index);
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onIndexChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") emblaApi?.scrollPrev();
      if (event.key === "ArrowRight") emblaApi?.scrollNext();
    };
    window.addEventListener("keydown", onKey);
    const html = document.documentElement;
    html.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = "";
    };
  }, [open, emblaApi]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-label={`Fotos do ${title} em tela cheia`}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-black p-0 text-white backdrop:bg-black"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between gap-4 px-4 py-3">
          <p className="truncate text-sm font-semibold">
            {title} · {selected + 1}/{photos.length}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar tela cheia"
            className="flex size-10 items-center justify-center rounded-full bg-white/10 transition duration-150 hover:bg-white/20"
          >
            <X aria-hidden className="size-5" />
          </button>
        </header>
        <div className="relative flex-1">
          <div ref={emblaRef} className="h-full overflow-hidden">
            <div className="flex h-full touch-pan-y">
              {photos.map((photo, index) => (
                <div key={`${photo}-full-${index}`} className="relative h-full min-w-0 flex-[0_0_100%]">
                  <ListingPhoto
                    src={photo}
                    alt={`${title} — foto ${index + 1}`}
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                aria-label="Foto anterior"
                className="absolute left-4 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition duration-150 hover:bg-white/20 md:flex"
              >
                <ChevronLeft aria-hidden className="size-6" />
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                aria-label="Próxima foto"
                className="absolute right-4 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition duration-150 hover:bg-white/20 md:flex"
              >
                <ChevronRight aria-hidden className="size-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
