import { CarFront } from "lucide-react";
import Image from "next/image";
import { isIllustrativePhoto } from "@/lib/car-illustration";
import { cn } from "@/lib/cn";

interface ListingPhotoProps {
  src: string | undefined;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Selo "Imagem ilustrativa" em fotos de demonstração (desligar em miniaturas). */
  showIllustrativeLabel?: boolean;
  /** Fundo do espaço quando o anúncio não tem foto. */
  tone?: "dark" | "light";
}

/**
 * Foto de anúncio. As fotos são data URLs (upload no navegador), SVGs
 * ilustrativos ou fotos de demonstração, por isso não passam pelo otimizador.
 */
export function ListingPhoto({
  src,
  alt,
  sizes,
  priority,
  className,
  showIllustrativeLabel = true,
  tone = "dark",
}: ListingPhotoProps) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={`${alt} (sem foto)`}
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          tone === "dark" ? "bg-surface-2 text-chrome-muted" : "bg-paper text-ink-muted",
        )}
      >
        <CarFront aria-hidden className="size-10 opacity-60" />
      </div>
    );
  }

  return (
    <>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized className={cn("object-cover", className)} />
      {showIllustrativeLabel && isIllustrativePhoto(src) && (
        <span className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/55 px-1.5 py-0.5 text-[11px] font-medium leading-tight text-white/90">
          Imagem ilustrativa
        </span>
      )}
    </>
  );
}
