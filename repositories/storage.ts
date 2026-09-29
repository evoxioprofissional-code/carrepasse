// Único ponto do app que toca no localStorage. Quando houver backend,
// os repositórios passam a chamar a API e este arquivo deixa de existir.

const PREFIX = "carrepasse:v1:";
export const STORAGE_EVENT = "carrepasse:storage";

export class StorageQuotaError extends Error {
  constructor() {
    super("Sem espaço no armazenamento do navegador.");
    this.name = "StorageQuotaError";
  }
}

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
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      throw new StorageQuotaError();
    }
    throw error;
  }
  // Avisa outros componentes (e hooks) que os dados mudaram.
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
}

export function removeValue(key: string): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(PREFIX + key);
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
}

/** Apaga todos os dados do app (botão "Resetar dados de demonstração"). */
export function resetAllData(): void {
  if (!isBrowser()) return;
  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(PREFIX))
    .forEach((key) => window.localStorage.removeItem(key));
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key: "*" } }));
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

export function createId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}
