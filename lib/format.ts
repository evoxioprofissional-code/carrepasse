const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

const relativeFormatter = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

/** 45900 → "R$ 45.900" (espaço normal, não o NBSP do Intl). */
export function formatBRL(value: number): string {
  return brlFormatter.format(value).replace(/ /g, " ");
}

/** 45900 → "R$ 45,9 mil" — para chips e atalhos curtos. */
export function formatBRLShort(value: number): string {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mi`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`;
  return formatBRL(value);
}

/** 87500 → "87.500 km" */
export function formatKm(value: number): string {
  return `${numberFormatter.format(value)} km`;
}

/** 87500 → "87.500" */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** Converte "R$ 45.900" / "45.900" / "45900" em 45900. */
export function parseCurrencyInput(value: string): number | undefined {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : undefined;
}

const DAY = 24 * 60 * 60 * 1000;

/** ISO → "hoje", "ontem", "há 3 dias", "há 2 semanas", "há 4 meses". */
export function formatRelativeDate(iso: string, now: Date = new Date()): string {
  const diff = now.getTime() - new Date(iso).getTime();
  const days = Math.floor(diff / DAY);

  if (days <= 0) return "hoje";
  if (days < 7) return relativeFormatter.format(-days, "day");
  if (days < 30) return relativeFormatter.format(-Math.floor(days / 7), "week");
  if (days < 365) return relativeFormatter.format(-Math.floor(days / 30), "month");
  return relativeFormatter.format(-Math.floor(days / 365), "year");
}

/** ISO → "março de 2024" */
export function formatMonthYear(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

/** "81999998888" → "(81) 99999-8888" */
export function formatPhone(digits: string): string {
  const d = digits.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return digits;
}

/** 2020 / 2021 → "2020/2021"; iguais → "2021". */
export function formatYears(manufactureYear: number, modelYear: number): string {
  return manufactureYear === modelYear ? String(modelYear) : `${manufactureYear}/${modelYear}`;
}
