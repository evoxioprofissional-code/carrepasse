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

  it("carro diesel: escolhe a versão diesel da FIPE, não a flex", () => {
    const base = doc.fipe?.dados?.[0];
    const parsed = parseApiPlacas("ABC1D23", {
      ...doc,
      MARCA: "JEEP",
      MODELO: "COMPASS",
      extra: { ...doc.extra, combustivel: "Oleo Diesel", tipo_veiculo: "Automovel", sub_segmento: "AU - SUV" },
      fipe: {
        dados: [
          { ...base, score: 90, sigla_combustivel: "G", combustivel: "Gasolina", texto_marca: "Jeep", texto_modelo: "COMPASS LIMITED 2.0 4x2 Flex 16V Aut.", ano_modelo: "2019", codigo_fipe: "022001-0", texto_valor: "R$ 90.000,00" },
          { ...base, score: 50, sigla_combustivel: "D", combustivel: "Diesel", texto_marca: "Jeep", texto_modelo: "COMPASS LIMITED 2.0 TD380 4x4 Diesel Aut.", ano_modelo: "2019", codigo_fipe: "022002-9", texto_valor: "R$ 120.000,00" },
        ],
      },
    });
    expect(parsed.kind).toBe("ok");
    if (parsed.kind !== "ok") return;
    expect(parsed.result.fuel).toBe("diesel");
    expect(parsed.result.version.toLowerCase()).toContain("4x4");
    expect(parsed.result.fipeCode).toBe("022002-9");
  });

  it("sem marca/modelo/ano, trata como não encontrada", () => {
    expect(parseApiPlacas("ABC1D23", {}).kind).toBe("not-found");
  });
});
