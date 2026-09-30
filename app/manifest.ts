import type { MetadataRoute } from "next";

// Permite "Adicionar à tela inicial": o site abre como app, sem barra do navegador.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Car Repasse",
    short_name: "Car Repasse",
    description: "Carros abaixo da FIPE, com o estado real de cada veículo. Anuncie grátis.",
    lang: "pt-BR",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0A0A0A",
    theme_color: "#0F1113",
    categories: ["shopping", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Buscar carros", url: "/carros", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Anunciar grátis", url: "/anunciar", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
