import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { cn } from "@/lib/cn";

interface StoryDownloadLinkProps {
  listingId: string;
  className?: string;
  label?: string;
}

/** Baixa a imagem 1080×1920 do anúncio para postar nos stories do Instagram. */
export function StoryDownloadLink({ listingId, className, label = "Imagem para o Instagram" }: StoryDownloadLinkProps) {
  return (
    <a href={`/carros/${listingId}/story`} download={`car-repasse-${listingId}.png`} className={cn(className)}>
      <InstagramIcon className="size-4 shrink-0" />
      {label}
    </a>
  );
}
