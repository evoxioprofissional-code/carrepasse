import type { ComponentProps } from "react";
import { buttonStyles, type ButtonStyleOptions } from "./buttonStyles";
import { Spinner } from "./Spinner";

type ButtonProps = ComponentProps<"button"> &
  Omit<ButtonStyleOptions, "className"> & {
    loading?: boolean;
  };

export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles({ variant, size, fullWidth, className })}
      {...props}
    >
      {loading && <Spinner label="Aguarde" />}
      {children}
    </button>
  );
}
