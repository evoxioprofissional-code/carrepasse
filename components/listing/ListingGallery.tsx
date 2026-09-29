"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { FullscreenGallery } from "./FullscreenGallery";
import { ListingPhoto } from "./ListingPhoto";

interface ListingGalleryProps {
  photos: string[];
  title: string;
}

export function ListingGallery({ photos, title }: ListingGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: photos.length > 1 });
  const [selected, setSelected] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const goTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);
  const syncFromFullscreen = useCallback((index: number) => emblaApi?.scrollTo(index, true), [emblaApi]);

  return (
    <div className="flex flex-col gap-3">
      <div
        className="group relative overflow-hidden rounded-xl border border-border bg-surface-2"
        role="region"
        aria-roledescription="carrossel"
        aria-label={`Fotos do ${title}`}
      >
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex touch-pan-y">
            {photos.map((photo, index) => (
              <div
                key={`${photo}-${index}`}
                className="relative aspect-[4/3] min-w-0 flex-[0_0_100%]"
                role="group"
                aria-roledescription="foto"
                aria-label={`${index + 1} de ${photos.length}`}
              >
                <button
                  type="button"
                  onClick={() => setFullscreen(true)}
                  className="absolute inset-0 cursor-zoom-in"
                  aria-label="Ver fotos em tela cheia"
                >
                  <ListingPhoto
                    src={photo}
                    alt={`${title} — foto ${index + 1}`}
                    sizes="(min-width: 1024px) 760px, 100vw"
                    priority={index === 0}
                  />
                </button>
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
              className="absolute left-3 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition duration-150 hover:bg-black/80 focus-visible:opacity-100 group-hover:opacity-100 md:flex"
            >
              <ChevronLeft aria-hidden className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition duration-150 hover:bg-black/80 focus-visible:opacity-100 group-hover:opacity-100 md:flex"
            >
              <ChevronRight aria-hidden className="size-5" />
            </button>
          </>
        )}

        <span className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/65 px-2 py-1 text-xs font-semibold text-white">
          {selected + 1}/{photos.length}
        </span>
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 min-h-10 rounded-md bg-black/65 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition duration-150 hover:bg-black/85"
        >
          <Expand aria-hidden className="size-3.5" />
          Tela cheia
        </button>
      </div>

      {photos.length > 1 && (
        <ul className="hidden grid-cols-6 gap-2 sm:grid" aria-label="Miniaturas">
          {photos.map((photo, index) => (
            <li key={`${photo}-thumb-${index}`}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Ver foto ${index + 1}`}
                aria-current={index === selected}
                className={cn(
                  "relative block aspect-[4/3] w-full overflow-hidden rounded-lg border-2 transition duration-150",
                  index === selected ? "border-brand" : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <ListingPhoto src={photo} alt="" sizes="120px" showIllustrativeLabel={false} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <FullscreenGallery
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        photos={photos}
        title={title}
        startIndex={selected}
        onIndexChange={syncFromFullscreen}
      />
    </div>
  );
}
