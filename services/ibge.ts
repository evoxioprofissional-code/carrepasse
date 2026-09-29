// Municípios oficiais por UF (API pública do IBGE, sem chave). Serve para
// sugerir o nome certo da cidade e evitar "recife", "Recife-PE" etc.
const BASE = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";

const cache = new Map<string, Promise<string[]>>();

export function getCities(uf: string): Promise<string[]> {
  const key = uf.toUpperCase();
  if (!/^[A-Z]{2}$/.test(key)) return Promise.resolve([]);
  if (!cache.has(key)) {
    const request = fetch(`${BASE}/${key}/municipios?orderBy=nome`, { signal: AbortSignal.timeout(8000) })
      .then((response) => (response.ok ? (response.json() as Promise<{ nome: string }[]>) : []))
      .then((items) => items.map((item) => item.nome))
      .catch(() => {
        cache.delete(key); // tenta de novo na próxima vez
        return [];
      });
    cache.set(key, request);
  }
  return cache.get(key) as Promise<string[]>;
}
