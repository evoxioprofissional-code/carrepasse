import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-lime text-ink hover:brightness-110 active:brightness-95",
  secondary:
    "border border-border bg-surface-2 text-chrome hover:border-lime-ink hover:text-ink",
  ghost: "text-chrome-muted hover:bg-surface-2 hover:text-chrome",
  danger: "border border-danger/40 bg-danger/10 text-danger-ink hover:bg-danger/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 px-3 text-sm",
  md: "h-11 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-6 text-base",
};

/** Classes compartilhadas entre <Button> e <ButtonLink>. */
export function buttonStyles({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}): string {
  return cn(
    "inline-flex select-none items-center justify-center whitespace-nowrap rounded-lg font-semibold transition duration-150",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );
}
