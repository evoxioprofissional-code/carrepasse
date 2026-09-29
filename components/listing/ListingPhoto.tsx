import Image from "next/image";
import { cn } from "@/lib/cn";

interface ListingPhotoProps {
  src: string | undefined;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Foto de anúncio. As fotos são data URLs (upload no navegador) ou SVGs
 * ilustrativos, por isso não passam pelo otimizador do Next.
 */
export function ListingPhoto({ src, alt, sizes, priority, className }: ListingPhotoProps) {
  if (!src) {
    return <div aria-hidden className={cn("bg-surface-2", className)} />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized
      className={cn("object-cover", className)}
    />
  );
}
