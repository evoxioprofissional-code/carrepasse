import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { loadExo2 } from "@/lib/og-font";

export const alt = "Car Repasse — carros abaixo da FIPE, com o estado real de cada veículo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagem padrão quando alguém compartilha o site (Instagram, WhatsApp).
export default async function Image() {
  const [logo, hero, bold, medium] = await Promise.all([
    readFile(join(process.cwd(), "public/brand/logo.png")),
    readFile(join(process.cwd(), "public/demo/hero.jpg")).catch(() => null),
    loadExo2(800),
    loadExo2(500),
  ]);
  const fonts = [
    ...(bold ? [{ name: "Exo 2", data: bold, weight: 800 as const, style: "normal" as const }] : []),
    ...(medium ? [{ name: "Exo 2", data: medium, weight: 500 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0F1113", fontFamily: "Exo 2", color: "#FFFFFF" }}>
        {hero && (
          <img
            src={`data:image/jpeg;base64,${hero.toString("base64")}`}
            width={720}
            height={630}
            alt=""
            style={{ position: "absolute", right: 0, top: 0, objectFit: "cover" }}
          />
        )}
        {/* O gerador não entende "inset": posição e tamanho explícitos */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage: "linear-gradient(90deg, #0F1113 0%, #0F1113 42%, rgba(15,17,19,0.55) 70%, rgba(15,17,19,0.2) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px", gap: 20, width: 760 }}>
          <img src={`data:image/png;base64,${logo.toString("base64")}`} width={170} height={153} alt="" />
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05 }}>Carros abaixo da FIPE. Sem enrolação.</div>
          <div style={{ fontSize: 30, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>
            FIPE e estado real em todo anúncio. Anuncie grátis.
          </div>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 800, color: "#7ED321" }}>Preço baixo. Verdade sempre.</div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
