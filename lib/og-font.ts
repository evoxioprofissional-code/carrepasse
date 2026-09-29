/**
 * Baixa a Exo 2 (TTF) do Google Fonts para as imagens de compartilhamento.
 * O gerador (next/og) não usa as fontes do next/font. Se falhar, a imagem
 * sai com a fonte padrão — nunca quebra o build.
 */
export async function loadExo2(weight: 500 | 700 | 800): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Exo+2:wght@${weight}`;
    // Sem user-agent de navegador o Google devolve TTF (o gerador não lê woff2).
    const css = await (await fetch(url, { signal: AbortSignal.timeout(5000) })).text();
    const fontUrl = /src: url\((.+?)\) format\('(opentype|truetype)'\)/.exec(css)?.[1];
    if (!fontUrl) return null;
    const response = await fetch(fontUrl, { signal: AbortSignal.timeout(5000) });
    return response.ok ? await response.arrayBuffer() : null;
  } catch {
    return null;
  }
}
