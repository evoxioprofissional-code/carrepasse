import { ShieldAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/brand/logo.png";
import { Container } from "@/components/ui/Container";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { searchHref } from "@/lib/listing-query";
import { DISCLAIMER, SITE, type NavLink } from "@/lib/site";

const columns: { title: string; links: NavLink[] }[] = [
  {
    title: "Comprar",
    links: [
      { href: searchHref({ sort: "maior-desconto" }), label: "Maiores descontos" },
      { href: searchHref({ priceMax: 50000 }), label: "Carros até R$ 50 mil" },
      { href: searchHref({ bodyType: "suv" }), label: "SUVs" },
      { href: searchHref({ bodyType: "picape" }), label: "Picapes" },
      { href: searchHref({ noAuction: true, noAccident: true }), label: "Sem leilão e sem sinistro" },
    ],
  },
  {
    title: "Vender",
    links: [
      { href: "/anunciar", label: "Anunciar grátis" },
      { href: "/como-funciona", label: "Repasse ou preço final?" },
      { href: "/minha-conta/anuncios", label: "Meus anúncios" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { href: "/seguranca", label: "Negocie com segurança" },
      { href: "/como-funciona", label: "Como funciona" },
      { href: "/termos", label: "Termos de uso" },
      { href: "/privacidade", label: "Política de privacidade" },
      { href: "/creditos", label: "Créditos das imagens" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070707]">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-4">
          <Image src={logo} alt="Car Repasse" className="h-auto w-24" />
          <p className="max-w-xs text-sm leading-relaxed text-white/60">
            Marketplace de carros com FIPE à vista em todo anúncio. Lojistas, corretores e
            particulares anunciam de graça.
          </p>
          <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm text-white transition duration-150 hover:border-lime hover:text-lime"
          >
            <InstagramIcon className="size-4" />
            {SITE.instagramHandle}
          </a>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-white/60">
              {column.title}
            </h2>
            <ul className="flex flex-col gap-0.5 sm:gap-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block rounded py-2.5 text-sm text-white transition duration-150 hover:text-lime sm:py-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-6 py-8">
          <div className="flex gap-3">
            <ShieldAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-warning" />
            <p className="text-xs leading-relaxed text-white/60">
              <strong className="text-white">Aviso importante: </strong>
              {DISCLAIMER}
            </p>
          </div>
          <div className="flex flex-col gap-1 text-xs text-white/60 sm:flex-row sm:justify-between">
            <p>
              © {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.
            </p>
            <p className="font-display font-bold italic text-white">{SITE.slogan}</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
