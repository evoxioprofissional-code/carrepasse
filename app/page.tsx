import Image from "next/image";
import logo from "@/public/brand/logo.png";

// Página provisória da Fase 1: valida logo, cores e fontes.
// A home de verdade entra na Fase 4.

const swatches = [
  { name: "bg", className: "bg-bg" },
  { name: "surface", className: "bg-surface" },
  { name: "surface-2", className: "bg-surface-2" },
  { name: "border", className: "bg-border" },
  { name: "brand", className: "bg-brand" },
  { name: "brand-dark", className: "bg-brand-dark" },
  { name: "chrome", className: "bg-chrome" },
  { name: "chrome-muted", className: "bg-chrome-muted" },
  { name: "danger", className: "bg-danger" },
  { name: "warning", className: "bg-warning" },
];

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center gap-10 px-4 py-12">
      <Image
        src={logo}
        alt="Car Repasse — Preço baixo. Verdade sempre."
        priority
        className="h-auto w-64 sm:w-80"
      />

      <section className="text-center">
        <h1 className="text-chrome-gradient text-4xl font-extrabold sm:text-5xl">
          Carros abaixo da FIPE. Sem enrolação.
        </h1>
        <p className="mt-3 text-chrome-muted">
          Estamos montando a vitrine. Em breve, os primeiros anúncios.
        </p>
      </section>

      <div className="w-full rounded-xl border border-border bg-surface p-5">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="font-display text-lg font-bold text-chrome">
              Chevrolet Onix 1.0 LT
            </p>
            <p className="text-sm text-chrome-muted">2021 · 48.000 km · Recife/PE</p>
          </div>
          <span className="rounded-lg bg-brand-gradient px-2 py-1 text-xs font-semibold text-bg">
            -18% FIPE
          </span>
        </div>
        <p className="mt-4 font-display text-3xl font-bold text-brand">R$ 58.900</p>
        <p className="text-sm text-chrome-muted line-through">FIPE R$ 71.830</p>
        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-brand-gradient px-4 py-3 font-semibold text-bg transition hover:brightness-110"
        >
          Anunciar grátis
        </button>
      </div>

      <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-5" aria-label="Paleta de cores">
        {swatches.map((swatch) => (
          <li key={swatch.name} className="text-center text-xs text-chrome-muted">
            <span
              className={`mb-1 block h-12 rounded-lg border border-border ${swatch.className}`}
            />
            {swatch.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
