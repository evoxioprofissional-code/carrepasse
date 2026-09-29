import Image from "next/image";
import Link from "next/link";
import logoMark from "@/public/brand/logo-mark.png";
import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
}

/**
 * Versão horizontal para o header: escudo com o carro + nome.
 * A logo completa (quadrada) fica ilegível nessa altura.
 */
export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Car Repasse — página inicial"
      className={cn("flex min-h-11 shrink-0 items-center gap-2.5 rounded-lg", className)}
    >
      <Image src={logoMark} alt="" priority className="h-8 w-auto lg:h-10" />
      <span
        aria-hidden
        className="flex flex-col font-display text-sm font-extrabold italic leading-[0.9] tracking-tight lg:text-base"
      >
        <span className="text-chrome-gradient">CAR</span>
        <span className="text-brand">REPASSE</span>
      </span>
    </Link>
  );
}
