import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { illustrationColorFor, renderCarSvg } from "@/lib/car-illustration";
import { compareWithFipe, mainPrice } from "@/lib/fipe-math";
import { formatBRL, formatKm, formatYears } from "@/lib/format";
import { loadExo2 } from "@/lib/og-font";
import { LISTING_PHOTOS_BUCKET, SUPABASE_URL } from "@/lib/supabase/config";
import { getPublicListing, getPublicListingIds } from "@/repositories/serverData";
import type { BodyType } from "@/types/listing";

export const alt = "Anúncio no Car Repasse";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getPublicListingIds()).map((id) => ({ id }));
}

const BG = "#0A0A0A";

const STORAGE_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${LISTING_PHOTOS_BUCKET}/`;

/** Foto enviada pelo vendedor (só do nosso Storage; o gerador lê JPEG e PNG). */
async function storagePhotoDataUrl(photo: string): Promise<string | null> {
  try {
    const response = await fetch(photo, { signal: AbortSignal.timeout(5000) });
    const type = response.headers.get("content-type") ?? "";
    if (!response.ok || !/^image\/(jpeg|png)/.test(type)) return null;
    const data = Buffer.from(await response.arrayBuffer());
    return `data:${type.split(";")[0]};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Foto do anúncio embutida na imagem; sem foto utilizável, usa a ilustração.
 * `illustrative` liga o selo "Imagem ilustrativa" (demonstração ou desenho).
 */
async function coverImage(
  photo: string | undefined,
  bodyType: BodyType,
  color: string,
): Promise<{ src: string; illustrative: boolean }> {
  if (photo?.startsWith("/demo/")) {
    try {
      const file = await readFile(join(process.cwd(), "public", photo));
      return { src: `data:image/jpeg;base64,${file.toString("base64")}`, illustrative: true };
    } catch {
      // cai na ilustração abaixo
    }
  }
  if (photo?.startsWith(STORAGE_PREFIX)) {
    const uploaded = await storagePhotoDataUrl(photo);
    if (uploaded) return { src: uploaded, illustrative: false };
  }
  const svg = renderCarSvg(bodyType, illustrationColorFor(color), 1);
  return { src: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`, illustrative: true };
}
const BRAND = "#7ED321";

// Imagem que aparece quando o link do anúncio é colado no WhatsApp/Instagram.
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getPublicListing(id).catch(() => null);
  const logo = await readFile(join(process.cwd(), "public/brand/logo-mark.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  if (!listing) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: BG, color: "#E5E5E5", gap: 24 }}>
          <img src={logoSrc} width={320} height={116} alt="" />
          <div style={{ fontSize: 56, fontWeight: 800 }}>Carros abaixo da FIPE</div>
          <div style={{ fontSize: 30, color: BRAND }}>Preço baixo. Verdade sempre.</div>
        </div>
      ),
      size,
    );
  }

  const price = mainPrice(listing);
  const comparison = compareWithFipe(listing.fipePrice, price);
  const title = `${listing.brand} ${listing.model}`;
  const badge = comparison.kind === "below" ? `-${comparison.percent}% FIPE` : "";
  const [bold, medium] = await Promise.all([loadExo2(800), loadExo2(500)]);
  const fonts = [
    ...(bold ? [{ name: "Exo 2", data: bold, weight: 800 as const, style: "normal" as const }] : []),
    ...(medium ? [{ name: "Exo 2", data: medium, weight: 500 as const, style: "normal" as const }] : []),
  ];
  const cover = await coverImage(listing.photos[0], listing.bodyType, listing.color);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: BG, color: "#E5E5E5", fontFamily: "Exo 2", fontWeight: 500 }}>
        <div style={{ width: 620, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 0 56px 64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src={logoSrc} width={110} height={40} alt="" />
            <div style={{ fontSize: 26, fontWeight: 800, color: BRAND, letterSpacing: 1 }}>CAR REPASSE</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, textTransform: "uppercase" }}>
              {title}
            </div>
            <div style={{ fontSize: 28, color: "#A3A3A3" }}>
              {listing.version}
            </div>
            <div style={{ fontSize: 26, color: "#A3A3A3" }}>
              {`${formatYears(listing.manufactureYear, listing.modelYear)} · ${formatKm(listing.km)} · ${listing.city}/${listing.state}`}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 26, color: "#A3A3A3", textDecoration: comparison.kind === "below" ? "line-through" : "none" }}>
                {`FIPE ${formatBRL(listing.fipePrice)}`}
              </div>
              <div style={{ fontSize: 72, fontWeight: 800, color: BRAND, lineHeight: 1 }}>{formatBRL(price)}</div>
            </div>
            {comparison.kind === "below" && (
              <div style={{ display: "flex", flexShrink: 0, whiteSpace: "nowrap", fontSize: 32, fontWeight: 800, color: BG, background: `linear-gradient(135deg, ${BRAND}, #4CAF1A)`, padding: "8px 16px", borderRadius: 12, marginBottom: 8 }}>
                {badge}
              </div>
            )}
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", position: "relative" }}>
            <img src={cover.src} width={540} height={405} alt="" style={{ borderRadius: 24, objectFit: "cover" }} />
            {cover.illustrative && (
              <div style={{ position: "absolute", left: 16, bottom: 16, display: "flex", fontSize: 18, color: "#FFFFFF", background: "rgba(0,0,0,0.6)", padding: "4px 10px", borderRadius: 6 }}>
                Imagem ilustrativa
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
