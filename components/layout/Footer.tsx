import { ShieldAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/brand/logo.png";
import { Container } from "@/components/ui/Container";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { DISCLAIMER, SITE, type NavLink } from "@/lib/site";

const columns: { title: string; links: NavLink[] }[] = [
  {
    title: "Car Repasse",
    links: [
      { href: "/carros", label: "Comprar carro" },
      { href: "/anunciar", label: "Anunciar grátis" },
      { href: "/como-funciona", label: "Como funciona" },
      { href: "/seguranca", label: "Negocie com segurança" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { href: "/termos", label: "Termos de uso" },
      { href: "/privacidade", label: "Política de privacidade" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-bg">
      <Container className="grid gap-10 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-3">
          <Image src={logo} alt="Car Repasse" className="h-auto w-28" />
          <p className="font-display text-lg font-bold text-chrome">{SITE.slogan}</p>
          <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg text-sm text-chrome-muted transition duration-150 hover:text-brand"
          >
            <InstagramIcon className="size-5" />
            {SITE.instagramHandle}
          </a>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-chrome">
              {column.title}
            </h2>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded text-sm text-chrome-muted transition duration-150 hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <Container className="pb-8">
        <div className="flex gap-3 rounded-xl border border-border bg-surface p-4">
          <ShieldAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-warning" />
          <p className="text-xs leading-relaxed text-chrome-muted">
            <strong className="text-chrome">Aviso importante: </strong>
            {DISCLAIMER}
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-chrome-muted">
          © {new Date().getFullYear()} {SITE.name}. Anunciar é grátis.
        </p>
      </Container>
    </footer>
  );
}
