import { cn } from "@/lib/cn";

interface SellerAvatarProps {
  name: string;
  size?: "md" | "lg";
  className?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function SellerAvatar({ name, size = "md", className }: SellerAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-brand/40 bg-brand/10 font-display font-bold text-brand",
        size === "md" ? "size-12 text-lg" : "size-20 text-3xl",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
