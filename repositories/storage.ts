// Único ponto do app que toca no localStorage. Os dados moram na Supabase;
// aqui ficam só preferências locais (hoje: favoritos do visitante, até a Fase 6).

const PREFIX = "carrepasse:v1:";
export const STORAGE_EVENT = "carrepasse:storage";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/** Lê um valor; na primeira leitura grava o seed. No servidor devolve o seed. */
export function readValue<T>(key: string, seed: () => T): T {
  if (!isBrowser()) return seed();
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) {
      const initial = seed();
      window.localStorage.setItem(PREFIX + key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) as T;
  } catch {
    return seed();
  }
}

export function writeValue<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (error) {
    // Sem espaço ou modo privado: a preferência simplesmente não é salva.
    console.warn("Não foi possível salvar no navegador.", error);
    return;
  }
  // Avisa outros componentes (e hooks) que os dados mudaram.
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
}

export function removeValue(key: string): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(PREFIX + key);
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
}

/** Inscreve em mudanças de uma chave (mesma aba e outras abas). */
export function subscribeToKey(key: string, callback: () => void): () => void {
  if (!isBrowser()) return () => {};

  const onLocal = (event: Event) => {
    const changed = (event as CustomEvent<{ key: string }>).detail?.key;
    if (changed === key || changed === "*") callback();
  };
  const onOtherTab = (event: StorageEvent) => {
    if (event.key === null || event.key === PREFIX + key) callback();
  };

  window.addEventListener(STORAGE_EVENT, onLocal);
  window.addEventListener("storage", onOtherTab);
  return () => {
    window.removeEventListener(STORAGE_EVENT, onLocal);
    window.removeEventListener("storage", onOtherTab);
  };
}
