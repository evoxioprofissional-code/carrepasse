// Aviso local de "dados mudaram" depois de uma escrita feita neste navegador,
// para as listas recarregarem sem precisar de realtime.

const EVENT = "carrepasse:data-changed";

export type DataTopic = "listings" | "profiles";

export function emitDataChanged(topic: DataTopic): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { topic } }));
}

export function subscribeToData(topic: DataTopic, callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const listener = (event: Event) => {
    if ((event as CustomEvent<{ topic: DataTopic }>).detail?.topic === topic) callback();
  };
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
