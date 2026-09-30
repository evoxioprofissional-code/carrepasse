import { Alert } from "@/components/ui/Alert";
import { compareWithFipe } from "@/lib/fipe-math";
import { formatBRL, parseCurrencyInput } from "@/lib/format";

interface PriceFeedbackProps {
  label: string;
  value: string;
  fipePrice: number | null;
}

/** Comparação ao vivo do preço digitado com a FIPE. */
export function PriceFeedback({ label, value, fipePrice }: PriceFeedbackProps) {
  const price = parseCurrencyInput(value);
  if (!price || !fipePrice) return null;
  const comparison = compareWithFipe(fipePrice, price);
  if (comparison.kind === "below") {
    return (
      <Alert variant="success">
        Seu {label} está <strong>{comparison.percent}% abaixo da FIPE</strong> ({formatBRL(fipePrice)})
        {label === "preço de repasse" ? " — ótimo para repasse!" : " — isso chama atenção de quem busca."}
      </Alert>
    );
  }
  if (comparison.kind === "above") {
    return (
      <Alert variant="warning">
        Seu {label} está {comparison.percent}% acima da FIPE ({formatBRL(fipePrice)}). Carros acima da tabela costumam
        demorar mais para vender.
      </Alert>
    );
  }
  return <Alert variant="info">Seu {label} está no valor da FIPE ({formatBRL(fipePrice)}).</Alert>;
}
