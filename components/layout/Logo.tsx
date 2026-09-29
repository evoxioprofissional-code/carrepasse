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
      className={cn("flex items-center gap-2 rounded-lg", className)}
    >
      <Image src={logoMark} alt="" priority className="h-7 w-auto sm:h-8" />
      <span
        aria-hidden
        className="flex flex-col font-display text-[0.8rem] font-extrabold italic leading-[0.9] tracking-tight sm:text-sm"
      >
        <span className="text-chrome-gradient">CAR</span>
        <span className="text-brand">REPASSE</span>
      </span>
    </Link>
  );
}
