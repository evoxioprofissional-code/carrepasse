// Placas: formato antigo (ABC-1234) e Mercosul (ABC1D23).
const OLD_PATTERN = /^[A-Z]{3}[0-9]{4}$/;
const MERCOSUL_PATTERN = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

/** Maiúsculas, sem hífen, espaço ou qualquer outro caractere. */
export function normalizePlate(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isValidPlate(value: string): boolean {
  const plate = normalizePlate(value);
  return OLD_PATTERN.test(plate) || MERCOSUL_PATTERN.test(plate);
}

/** Exibição pública: "ABC1D23" → "ABC****". */
export function maskPlate(value: string): string {
  const plate = normalizePlate(value);
  return `${plate.slice(0, 3)}****`;
}

/** Máscara de digitação: "abc1d23" → "ABC-1D23" (visual; salvar normalizado). */
export function formatPlateInput(value: string): string {
  const plate = normalizePlate(value).slice(0, 7);
  return plate.length > 3 ? `${plate.slice(0, 3)}-${plate.slice(3)}` : plate;
}
