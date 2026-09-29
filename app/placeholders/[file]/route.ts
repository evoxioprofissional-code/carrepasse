import {
  BODY_TYPES,
  ILLUSTRATION_COLORS,
  ILLUSTRATION_VIEWS,
  renderCarSvg,
  type IllustrationColor,
  type IllustrationView,
} from "@/lib/car-illustration";
import type { BodyType } from "@/types/listing";

// /placeholders/suv-prata-1.svg → ilustração gerada no build (estática).
export const dynamicParams = false;

export function generateStaticParams() {
  return BODY_TYPES.flatMap((body) =>
    Object.keys(ILLUSTRATION_COLORS).flatMap((color) =>
      ILLUSTRATION_VIEWS.map((view) => ({ file: `${body}-${color}-${view}.svg` })),
    ),
  );
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const match = /^([a-z]+)-([a-z]+)-(\d)\.svg$/.exec(file);
  const body = match?.[1] as BodyType | undefined;
  const color = match?.[2] as IllustrationColor | undefined;
  const view = Number(match?.[3]) as IllustrationView;

  if (
    !body ||
    !color ||
    !BODY_TYPES.includes(body) ||
    !(color in ILLUSTRATION_COLORS) ||
    !ILLUSTRATION_VIEWS.includes(view)
  ) {
    return new Response("Imagem não encontrada", { status: 404 });
  }

  return new Response(renderCarSvg(body, color, view), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
