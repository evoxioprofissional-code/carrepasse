import { describe, expect, it } from "vitest";
import sample from "./__fixtures__/apiplacas-doc.json";
import { parseApiPlacas, type ApiPlacasResponse } from "./apiPlacas";

// Exemplo de resposta da documentação oficial (apiplacas.com.br/doc.php).
const doc = sample as ApiPlacasResponse;

describe("API Placas: leitura da resposta", () => {
  it("transforma o exemplo da documentação nos dados do anúncio", () => {
    const parsed = parseApiPlacas("INT8C36", doc);
    expect(parsed.kind).toBe("ok");
    if (parsed.kind !== "ok") return;
    expect(parsed.result).toMatchObject({
      brand: "Volkswagen",
      model: "Crossfox",
      version: "1.6 Mi Total Flex 8V 5p",
      modelYear: 2007,
      manufactureYear: 2007,
      fuel: "flex",
      bodyType: "hatch",
      color: "Prata",
      fipeCode: "005225-6",
      fipeYearCode: "2007-1",
      fipe: { price: 28799, referenceMonth: "maio de 2022" },
      source: "api",
    });
  });

  it("nunca repassa dados do proprietário", () => {
    const parsed = parseApiPlacas("INT8C36", doc);
    const text = JSON.stringify(parsed);
    expect(text).not.toMatch(/tipo_doc|faturado|chassi|municipio/i);
  });

  it("recusa moto e barra registro de roubo/furto", () => {
    expect(parseApiPlacas("INT8C36", { ...doc, extra: { ...doc.extra, tipo_veiculo: "Motocicleta" } }).kind).toBe("not-car");
    expect(parseApiPlacas("INT8C36", { ...doc, codigoSituacao: "1", situacao: "Roubo/Furto" }).kind).toBe("stolen");
  });

  it("lê carroceria e câmbio do campo extra", () => {
    const parsed = parseApiPlacas("ABC1D23", {
      ...doc,
      extra: { ...doc.extra, sub_segmento: "AU - SEDAN MEDIO", caixa_cambio: "AUTOMATICA", combustivel: "Gasolina" },
      fipe: { dados: [{ ...doc.fipe?.dados?.[0], texto_modelo: "COROLLA XEi 2.0 16V Aut." }] },
    });
    expect(parsed.kind === "ok" && [parsed.result.bodyType, parsed.result.transmission, parsed.result.fuel]).toEqual([
      "sedan",
      "automatico",
      "gasolina",
    ]);
  });

  it("sem marca/modelo/ano, trata como não encontrada", () => {
    expect(parseApiPlacas("ABC1D23", {}).kind).toBe("not-found");
  });
});
