import Image from "next/image";
import { cn } from "@/lib/cn";

interface SellerAvatarProps {
  name: string;
  /** Foto de perfil ou logo da loja; sem ela, mostra as iniciais. */
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "size-8 text-sm",
  md: "size-12 text-lg",
  lg: "size-20 text-3xl",
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function SellerAvatar({ name, src, size = "md", className }: SellerAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-lime/60 bg-lime-soft font-display font-bold text-lime-ink",
        SIZES[size],
        className,
      )}
    >
      {src ? <Image src={src} alt="" fill unoptimized sizes="80px" className="object-cover" /> : initials(name)}
    </span>
  );
}
