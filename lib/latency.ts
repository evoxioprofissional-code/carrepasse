/** Atraso artificial para exercitar os estados de carregamento sem backend. */
export function simulateLatency(minMs = 300, maxMs = 900): Promise<void> {
  const ms = minMs + Math.random() * (maxMs - minMs);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
