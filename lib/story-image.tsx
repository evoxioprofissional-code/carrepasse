import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { compareWithFipe, mainPrice } from "@/lib/fipe-math";
import { formatBRL, formatKm, formatYears } from "@/lib/format";
import { PRICE_MODE_LABEL } from "@/lib/labels";
import { coverImage } from "@/lib/og-cover";
import { loadExo2 } from "@/lib/og-font";
import { recentPriceDrop } from "@/lib/price-drop";
import { SITE } from "@/lib/site";
import type { Listing } from "@/types/listing";

// SÓ NO SERVIDOR: story do anúncio para o Instagram (1080×1920), com foto,
// preço, FIPE e os alertas que o vendedor declarou (verdade sempre).

export const STORY_SIZE = { width: 1080, height: 1920 };

const BG = "#0F1113";
const LIME = "#7ED321";
const MUTED = "#A3A9B1";
const WARNING = "#F59E0B";

export async function renderStory(listing: Listing, siteHost: string): Promise<ImageResponse> {
  const price = mainPrice(listing);
  const comparison = compareWithFipe(listing.fipePrice, price);
  const priceDrop = recentPriceDrop(listing);
  const [logo, cover, bold, medium] = await Promise.all([
    readFile(join(process.cwd(), "public/brand/logo-mark.png")),
    coverImage(listing.photos[0], listing.bodyType, listing.color),
    loadExo2(800),
    loadExo2(500),
  ]);
  const fonts = [
    ...(bold ? [{ name: "Exo 2", data: bold, weight: 800 as const, style: "normal" as const }] : []),
    ...(medium ? [{ name: "Exo 2", data: medium, weight: 500 as const, style: "normal" as const }] : []),
  ];
  const alerts = [
    listing.condition.hasAuctionHistory && "Passou por leilão",
    listing.condition.hasAccidentHistory && "Histórico de sinistro",
  ].filter((alert): alert is string => Boolean(alert));

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: BG, color: "#FFFFFF", fontFamily: "Exo 2", fontWeight: 500, padding: "96px 72px 88px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/png;base64,${logo.toString("base64")}`} width={132} height={48} alt="" />
          <div style={{ fontSize: 40, fontWeight: 800, color: LIME, letterSpacing: 2 }}>CAR REPASSE</div>
        </div>

        <div style={{ display: "flex", position: "relative", marginTop: 56 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover.src} width={936} height={702} alt="" style={{ borderRadius: 32, objectFit: "cover" }} />
          <div style={{ position: "absolute", left: 24, top: 24, display: "flex", fontSize: 32, fontWeight: 800, color: BG, background: LIME, padding: "10px 22px", borderRadius: 14 }}>
            {PRICE_MODE_LABEL[listing.priceMode]}
          </div>
          {cover.illustrative && (
            <div style={{ position: "absolute", left: 24, bottom: 24, display: "flex", fontSize: 26, background: "rgba(0,0,0,0.65)", padding: "6px 14px", borderRadius: 10 }}>
              Imagem ilustrativa
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 52, gap: 10 }}>
          <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1, textTransform: "uppercase" }}>{`${listing.brand} ${listing.model}`}</div>
          <div style={{ fontSize: 40, color: MUTED }}>{listing.version}</div>
          <div style={{ fontSize: 38, color: MUTED }}>
            {`${formatYears(listing.manufactureYear, listing.modelYear)} · ${formatKm(listing.km)} · ${listing.city}/${listing.state}`}
          </div>
        </div>

        {alerts.length > 0 && (
          <div style={{ display: "flex", gap: 16, marginTop: 28 }}>
            {alerts.map((alert) => (
              <div key={alert} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 30, color: WARNING, border: `3px solid ${WARNING}`, padding: "8px 18px", borderRadius: 12 }}>
                {/* Triângulo de alerta desenhado: a fonte não tem o símbolo ⚠ */}
                <svg width="30" height="28" viewBox="0 0 30 28">
                  <path d="M15 2 L28 26 L2 26 Z" fill="none" stroke={WARNING} strokeWidth="3" strokeLinejoin="round" />
                  <path d="M15 10 L15 18" stroke={WARNING} strokeWidth="3" strokeLinecap="round" />
                  <circle cx="15" cy="22" r="1.8" fill={WARNING} />
                </svg>
                {alert}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ fontSize: 40, color: MUTED, textDecoration: comparison.kind === "below" ? "line-through" : "none" }}>
              {`FIPE ${formatBRL(listing.fipePrice)}`}
            </div>
            {priceDrop && (
              <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: LIME, border: `3px solid ${LIME}`, padding: "4px 16px", borderRadius: 12 }}>
                {`Baixou ${formatBRL(priceDrop)}`}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div style={{ fontSize: 128, fontWeight: 800, color: LIME, lineHeight: 1 }}>{formatBRL(price)}</div>
            {comparison.kind === "below" && (
              <div style={{ display: "flex", fontSize: 48, fontWeight: 800, color: BG, background: LIME, padding: "10px 22px", borderRadius: 16 }}>
                {`-${comparison.percent}% FIPE`}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 56, paddingTop: 36, borderTop: "2px solid rgba(255,255,255,0.15)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 30, color: MUTED }}>Veja o anúncio completo em</div>
            <div style={{ fontSize: 40, fontWeight: 800 }}>{siteHost}</div>
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, color: LIME }}>{SITE.instagramHandle}</div>
        </div>
      </div>
    ),
    { ...STORY_SIZE, fonts, headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } },
  );
}
