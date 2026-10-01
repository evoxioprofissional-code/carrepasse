import { describe, expect, it } from "vitest";
import { compareWithFipe, discountPercent, mainPrice } from "./fipe-math";
import { formatBRL, formatKm, formatPhone, formatRelativeDate, formatThousandsInput, formatYears, parseCurrencyInput } from "./format";
import { daysUntilExpiry, isExpired, LISTING_TTL_DAYS } from "./listing-expiry";
import { emptyListingForm, toListingFields, validateStep } from "./listing-form";
import { parseSearchFilters, serializeSearchFilters } from "./listing-query";
import { recentPriceDrop } from "./price-drop";
import { formatPlateInput, isValidPlate, maskPlate, normalizePlate } from "./plate";
import { safeRedirect } from "./redirect";
import { whatsappLink } from "./whatsapp";

const DAY = 24 * 60 * 60 * 1000;

describe("FIPE", () => {
  it("calcula o desconto arredondado", () => {
    expect(discountPercent(59052, 48400)).toBe(18);
    expect(discountPercent(0, 1000)).toBe(0);
  });

  it("usa o repasse como preço principal quando existe", () => {
    expect(mainPrice({ fipePrice: 50000, repassePrice: 40000, finalPrice: 45000 })).toBe(40000);
    expect(mainPrice({ fipePrice: 50000, finalPrice: 45000 })).toBe(45000);
  });

  it("só mostra 'abaixo' a partir de 1% e 'acima' em cinza", () => {
    expect(compareWithFipe(100000, 99000)).toEqual({ kind: "below", percent: 1 });
    expect(compareWithFipe(100000, 99600)).toEqual({ kind: "equal" });
    expect(compareWithFipe(100000, 103000)).toEqual({ kind: "above", percent: 3 });
    expect(compareWithFipe(0, 50000)).toEqual({ kind: "unknown" });
  });
});

describe("formatação", () => {
  it("formata moeda, km, anos e telefone", () => {
    expect(formatBRL(45900)).toBe("R$ 45.900");
    expect(formatKm(87500)).toBe("87.500 km");
    expect(formatYears(2020, 2021)).toBe("2020/2021");
    expect(formatYears(2021, 2021)).toBe("2021");
    expect(formatPhone("81999998888")).toBe("(81) 99999-8888");
  });

  it("converte o valor digitado com máscara", () => {
    expect(parseCurrencyInput("R$ 45.900")).toBe(45900);
    expect(parseCurrencyInput("")).toBeUndefined();
    expect(formatThousandsInput("0045900")).toBe("45.900");
  });

  it("escreve datas relativas", () => {
    const now = new Date("2026-09-30T12:00:00Z");
    expect(formatRelativeDate("2026-09-30T08:00:00Z", now)).toBe("hoje");
    expect(formatRelativeDate("2026-09-27T12:00:00Z", now)).toBe("há 3 dias");
  });
});

describe("placa", () => {
  it("aceita os formatos antigo e Mercosul, normalizados", () => {
    expect(normalizePlate("abc-1d23")).toBe("ABC1D23");
    expect(isValidPlate("ABC-1234")).toBe(true);
    expect(isValidPlate("abc1d23")).toBe(true);
    expect(isValidPlate("AB1234")).toBe(false);
    expect(isValidPlate("ABC12D3")).toBe(false);
  });

  it("mascara a placa pública e formata a digitação", () => {
    expect(maskPlate("PCZ4H21")).toBe("PCZ****");
    expect(formatPlateInput("pcz4h21")).toBe("PCZ-4H21");
  });
});

describe("redirecionamento", () => {
  it("só aceita caminhos internos", () => {
    expect(safeRedirect("/minha-conta/anuncios?x=1")).toBe("/minha-conta/anuncios?x=1");
    expect(safeRedirect("//site-falso.com")).toBe("/");
    expect(safeRedirect("/\\site-falso.com")).toBe("/");
    expect(safeRedirect("/\t/site-falso.com")).toBe("/");
    expect(safeRedirect("https://site-falso.com")).toBe("/");
    expect(safeRedirect(null)).toBe("/");
  });
});

describe("WhatsApp", () => {
  it("sempre põe o DDI 55, inclusive para o DDD 55 (Santa Maria/RS)", () => {
    expect(whatsappLink("81999998888", "oi")).toBe("https://wa.me/5581999998888?text=oi");
    expect(whatsappLink("55999998888", "oi")).toBe("https://wa.me/5555999998888?text=oi");
    expect(whatsappLink("(55) 3222-1234", "oi")).toBe("https://wa.me/555532221234?text=oi");
  });
});

describe("vencimento do anúncio", () => {
  const now = new Date("2026-09-30T12:00:00Z");
  it(`vence ${LISTING_TTL_DAYS} dias após a última confirmação`, () => {
    const confirmedAt = new Date(now.getTime() - 59 * DAY).toISOString();
    expect(daysUntilExpiry({ confirmedAt }, now)).toBe(1);
    expect(isExpired({ status: "ativo", confirmedAt }, now)).toBe(false);
    const old = new Date(now.getTime() - 61 * DAY).toISOString();
    expect(isExpired({ status: "ativo", confirmedAt: old }, now)).toBe(true);
    expect(isExpired({ status: "pausado", confirmedAt: old }, now)).toBe(false);
  });
});

describe("busca pela URL", () => {
  it("lê e escreve os filtros em português, ignorando lixo", () => {
    const filters = parseSearchFilters(new URLSearchParams("marca=Fiat&precoMax=60000&semLeilao=1&cambio=foguete&anoMin=abc"));
    expect(filters).toMatchObject({ brand: "Fiat", priceMax: 60000, noAuction: true });
    expect(filters.transmission).toBeUndefined();
    expect(filters.yearMin).toBeUndefined();
    expect(serializeSearchFilters(filters)).toBe("marca=Fiat&precoMax=60000&semLeilao=1");
    expect(serializeSearchFilters({ sort: "recentes" })).toBe("");
  });
});

describe("formulário do anúncio", () => {
  const vehicle = emptyListingForm({
    brand: "Chevrolet", model: "Onix", version: "1.0", modelYear: "2021", manufactureYear: "2020",
    fuel: "flex", transmission: "manual", bodyType: "hatch", color: "Prata", fipePrice: 59052, plate: "ABC1D23",
  });

  it("aceita o passo 1 completo e exige a placa", () => {
    expect(validateStep(0, vehicle)).toEqual({});
    expect(validateStep(0, { ...vehicle, plate: "" }).plate).toBeDefined();
  });

  it("recusa placa inválida e ano de fabricação fora da regra", () => {
    expect(validateStep(0, { ...vehicle, plate: "ABC12" }).plate).toBeDefined();
    expect(validateStep(0, { ...vehicle, manufactureYear: "2018" }).manufactureYear).toBeDefined();
  });

  it("exige descrição honesta com pelo menos 80 caracteres", () => {
    const details = { ...vehicle, km: "48.000", state: "PE", city: "Recife", description: "curta" };
    expect(validateStep(1, details).description).toBeDefined();
    expect(validateStep(1, { ...details, description: "x".repeat(80) })).toEqual({});
  });

  it("no modo 'os dois', o repasse precisa ser menor que o preço final", () => {
    const price = { ...vehicle, priceMode: "ambos" as const, repassePrice: "50.000", finalPrice: "48.000" };
    expect(validateStep(3, price).repassePrice).toBeDefined();
    expect(validateStep(3, { ...price, finalPrice: "55.000" })).toEqual({});
  });

  it("converte os valores digitados e normaliza a placa ao publicar", () => {
    const fields = toListingFields({ ...vehicle, plate: "abc1d23", km: "48.000", priceMode: "final", repassePrice: "40.000", finalPrice: "55.000" });
    expect(fields.plate).toBe("ABC1D23");
    expect(fields.km).toBe(48000);
    expect(fields.repassePrice).toBeUndefined();
    expect(fields.finalPrice).toBe(55000);
  });
});

describe("baixou o preço", () => {
  const now = new Date("2026-10-01T12:00:00Z");
  const base = { fipePrice: 50000, repassePrice: 46400, previousPrice: 48400 };
  it("mostra a redução por 14 dias", () => {
    expect(recentPriceDrop({ ...base, priceDroppedAt: new Date(now.getTime() - 3 * DAY).toISOString() }, now)).toBe(2000);
    expect(recentPriceDrop({ ...base, priceDroppedAt: new Date(now.getTime() - 15 * DAY).toISOString() }, now)).toBeNull();
  });
  it("sem preço anterior ou se o preço voltou a subir, não mostra", () => {
    expect(recentPriceDrop({ fipePrice: 50000, repassePrice: 46400 }, now)).toBeNull();
    expect(recentPriceDrop({ ...base, repassePrice: 49000, priceDroppedAt: now.toISOString() }, now)).toBeNull();
  });
});
