import type { BodyType } from "@/types/listing";

// Imagens ilustrativas dos anúncios de demonstração: SVG de "estúdio" com a
// silhueta lateral do carro na cor do anúncio. Nada de foto de terceiros.

export const ILLUSTRATION_COLORS = {
  branco: "#E6E7E9",
  prata: "#B4B9C0",
  cinza: "#6B7079",
  preto: "#24272C",
  vermelho: "#B0261F",
  azul: "#1F4F8F",
} as const;

export type IllustrationColor = keyof typeof ILLUSTRATION_COLORS;
export const ILLUSTRATION_VIEWS = [1, 2, 3, 4] as const;
export type IllustrationView = (typeof ILLUSTRATION_VIEWS)[number];
export const BODY_TYPES: BodyType[] = ["hatch", "sedan", "suv", "picape"];

interface BodyShape {
  body: string;
  glass: string;
  /** x do pilar B / divisão das portas. */
  pillarX: number;
  wheels: [number, number];
  wheelRadius: number;
  headlight: string;
  taillight: string;
  extra?: string;
}

// Silhuetas voltadas para a direita, chão em y≈462.
const SHAPES: Record<BodyType, BodyShape> = {
  hatch: {
    body: "M128 400 L124 360 Q122 318 146 298 L192 246 Q202 234 224 232 L408 226 Q438 226 460 244 L540 300 Q560 306 640 316 Q668 322 674 346 L676 392 Q674 404 660 406 L628 406 A58 58 0 0 0 512 406 L288 406 A58 58 0 0 0 172 406 L140 406 Q128 404 128 400 Z",
    glass: "M190 296 L216 250 Q221 242 232 242 L406 236 Q430 236 448 250 L514 298 Z",
    pillarX: 336,
    wheels: [230, 570],
    wheelRadius: 48,
    headlight: "M640 322 Q662 326 668 342 L646 340 Z",
    taillight: "M128 318 L150 312 L146 332 L126 334 Z",
  },
  sedan: {
    body: "M112 398 L110 356 Q110 330 128 322 L200 312 Q222 306 240 290 L290 244 Q300 236 318 234 L430 232 Q452 232 470 246 L546 302 Q566 308 640 318 Q670 324 676 348 L678 392 Q676 404 662 406 L622 406 A56 56 0 0 0 510 406 L290 406 A56 56 0 0 0 178 406 L126 406 Q112 404 112 398 Z",
    glass: "M252 298 L298 250 Q304 244 318 244 L428 242 Q446 242 460 252 L522 300 Z",
    pillarX: 398,
    wheels: [234, 566],
    wheelRadius: 47,
    headlight: "M642 324 Q664 328 670 344 L648 342 Z",
    taillight: "M112 334 L136 326 L134 344 L111 346 Z",
  },
  suv: {
    body: "M122 396 L120 330 Q120 296 138 280 L160 212 Q166 198 186 196 L440 192 Q462 192 478 206 L540 272 Q560 280 640 292 Q672 300 678 328 L680 390 Q678 404 664 406 L630 406 A66 66 0 0 0 498 406 L302 406 A66 66 0 0 0 170 406 L136 406 Q122 404 122 396 Z",
    glass: "M172 272 L186 214 Q190 206 202 206 L436 202 Q452 202 464 214 L518 270 Z",
    pillarX: 330,
    wheels: [236, 564],
    wheelRadius: 54,
    headlight: "M644 298 Q668 304 674 322 L650 320 Z",
    taillight: "M121 296 L142 288 L140 316 L120 318 Z",
    extra: "M190 190 L430 186",
  },
  picape: {
    body: "M98 396 L96 314 Q96 304 106 302 L290 300 L292 214 Q296 200 314 198 L452 196 Q472 196 486 210 L546 272 Q566 280 650 292 Q690 300 694 330 L696 392 Q694 404 680 406 L650 406 A68 68 0 0 0 514 406 L294 406 A68 68 0 0 0 158 406 L114 406 Q98 404 98 396 Z",
    glass: "M302 270 L304 216 Q306 208 318 208 L448 206 Q462 206 472 218 L522 270 Z",
    pillarX: 410,
    wheels: [226, 582],
    wheelRadius: 56,
    headlight: "M656 298 Q682 304 688 324 L664 322 Z",
    taillight: "M96 316 L114 312 L112 340 L96 342 Z",
    extra: "M290 300 L290 400",
  },
};

function shade(hex: string, amount: number): string {
  // amount > 0 clareia (mistura com branco); < 0 escurece (mistura com preto).
  const n = parseInt(hex.slice(1), 16);
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    Math.round(amount >= 0 ? c + (255 - c) * amount : c * (1 + amount)),
  );
  return `#${channels.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

function wheel(cx: number, cy: number, r: number): string {
  const spokes = [0, 72, 144, 216, 288]
    .map(
      (angle) =>
        `<rect x="${cx - 3}" y="${cy - r * 0.58}" width="6" height="${r * 0.46}" rx="2" fill="#3a3f45" transform="rotate(${angle} ${cx} ${cy})"/>`,
    )
    .join("");
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0b0b0c"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.66}" fill="url(#rim)"/>
    ${spokes}
    <circle cx="${cx}" cy="${cy}" r="${r * 0.16}" fill="#1c1f23" stroke="#8d949b" stroke-width="2"/>
  </g>`;
}

const VIEW_TRANSFORMS: Record<IllustrationView, string> = {
  1: "translate(-88 -97) scale(1.22)",
  2: "translate(888 -97) scale(-1.22 1.22)",
  3: "translate(-540 -250) scale(1.75)",
  4: "translate(30 -250) scale(1.75)",
};

export function renderCarSvg(bodyType: BodyType, color: IllustrationColor, view: IllustrationView): string {
  const shape = SHAPES[bodyType];
  const base = ILLUSTRATION_COLORS[color];
  const [rearX, frontX] = shape.wheels;
  const wheelY = 462 - shape.wheelRadius;
  const isDark = color === "preto" || color === "cinza" || color === "azul";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <radialGradient id="studio" cx="50%" cy="38%" r="75%">
      <stop offset="0" stop-color="#2a2c2f"/>
      <stop offset="0.55" stop-color="#151617"/>
      <stop offset="1" stop-color="#0b0b0b"/>
    </radialGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b1c1e"/>
      <stop offset="1" stop-color="#0a0a0a"/>
    </linearGradient>
    <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#000" stop-opacity="0.85"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="paint" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${shade(base, isDark ? 0.35 : 0.3)}"/>
      <stop offset="0.45" stop-color="${base}"/>
      <stop offset="1" stop-color="${shade(base, -0.45)}"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3d4a55"/>
      <stop offset="0.5" stop-color="#161c22"/>
      <stop offset="1" stop-color="#0d1115"/>
    </linearGradient>
    <radialGradient id="rim" cx="40%" cy="35%" r="70%">
      <stop offset="0" stop-color="#c9ced3"/>
      <stop offset="1" stop-color="#4b5157"/>
    </radialGradient>
    <clipPath id="glass-clip"><path d="${shape.glass}"/></clipPath>
  </defs>
  <rect width="800" height="600" fill="url(#studio)"/>
  <rect y="440" width="800" height="160" fill="url(#floor)"/>
  <g transform="${VIEW_TRANSFORMS[view]}">
    <ellipse cx="400" cy="462" rx="320" ry="18" fill="url(#shadow)"/>
    <path d="${shape.body}" fill="url(#paint)" stroke="${isDark ? "#ffffff33" : "#00000040"}" stroke-width="1.5"/>
    <path d="${shape.glass}" fill="url(#glass)"/>
    <rect x="${shape.pillarX - 5}" y="180" width="10" height="130" fill="${shade(base, -0.25)}" clip-path="url(#glass-clip)"/>
    <path d="M${rearX + 40} 332 L${frontX - 30} 336" stroke="${shade(base, 0.45)}" stroke-opacity="0.5" stroke-width="2" fill="none"/>
    <path d="M${shape.pillarX} 300 L${shape.pillarX} 400" stroke="#00000055" stroke-width="2"/>
    ${shape.extra ? `<path d="${shape.extra}" stroke="#00000066" stroke-width="3" fill="none"/>` : ""}
    <path d="${shape.headlight}" fill="#f2f4f5"/>
    <path d="${shape.taillight}" fill="#c1121f"/>
    ${wheel(rearX, wheelY, shape.wheelRadius)}
    ${wheel(frontX, wheelY, shape.wheelRadius)}
  </g>
  <text x="24" y="578" font-family="Arial, sans-serif" font-size="15" fill="#6f6f6f">Imagem ilustrativa</text>
</svg>`;
}

export function illustrationPath(bodyType: BodyType, color: IllustrationColor, view: IllustrationView): string {
  return `/placeholders/${bodyType}-${color}-${view}.svg`;
}

/** Lista de fotos ilustrativas para um anúncio de demonstração. */
export function illustrationPhotos(bodyType: BodyType, color: IllustrationColor, count: number): string[] {
  return ILLUSTRATION_VIEWS.slice(0, Math.max(1, Math.min(count, 4))).map((view) =>
    illustrationPath(bodyType, color, view),
  );
}

/** "Prata" → "prata"; cores sem ilustração caem em "prata". */
export function illustrationColorFor(colorName: string): IllustrationColor {
  const key = colorName.toLowerCase() as IllustrationColor;
  return key in ILLUSTRATION_COLORS ? key : "prata";
}
