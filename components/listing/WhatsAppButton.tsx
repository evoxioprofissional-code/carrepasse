import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { whatsappLink, whatsappMessage } from "@/lib/whatsapp";
import type { ListingWithSeller } from "@/types/listing";

interface WhatsAppButtonProps {
  listing: ListingWithSeller;
  className?: string;
}

export function WhatsAppButton({ listing, className }: WhatsAppButtonProps) {
  return (
    <a
      href={whatsappLink(listing.seller.phone, whatsappMessage(listing))}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 text-base font-bold text-[#062b14] transition duration-150 hover:brightness-110",
        className,
      )}
    >
      <MessageCircle aria-hidden className="size-5" strokeWidth={2.5} />
      Chamar no WhatsApp
    </a>
  );
}
