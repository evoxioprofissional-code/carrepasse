import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonStyles, type ButtonStyleOptions } from "./buttonStyles";

type ButtonLinkProps = ComponentProps<typeof Link> & Omit<ButtonStyleOptions, "className">;

/** Link com aparência de botão (navegação, não ação). */
export function ButtonLink({ variant, size, fullWidth, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, fullWidth, className })} {...props} />;
}
