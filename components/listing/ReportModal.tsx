"use client";

import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Textarea } from "@/components/ui/Textarea";
import { reportRepository } from "@/repositories/reportRepository";
import type { ReportReason } from "@/types/report";

interface ReportModalProps {
  listingId: string;
  open: boolean;
  onClose: () => void;
}

const REASONS: { value: ReportReason; label: string; description: string }[] = [
  { value: "golpe", label: "Parece golpe", description: "Pediu sinal adiantado, preço irreal, conversa estranha." },
  { value: "informacao_falsa", label: "Informação falsa", description: "Fotos, km, estado ou preço não batem com o carro." },
  { value: "carro_vendido", label: "O carro já foi vendido", description: "O vendedor disse que não está mais disponível." },
  { value: "outro", label: "Outro motivo", description: "Conte nos detalhes abaixo." },
];

type Status = "idle" | "sending" | "sent" | "error";

export function ReportModal({ listingId, open, onClose }: ReportModalProps) {
  const [reason, setReason] = useState<ReportReason>();
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [reasonError, setReasonError] = useState<string>();

  const close = () => {
    onClose();
    // Reinicia depois da animação de saída.
    setTimeout(() => {
      setReason(undefined);
      setDetails("");
      setStatus("idle");
      setReasonError(undefined);
    }, 200);
  };

  const submit = async () => {
    if (!reason) {
      setReasonError("Escolha um motivo.");
      return;
    }
    setStatus("sending");
    try {
      await reportRepository.create({ listingId, reason, details: details.trim() || undefined });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={status === "sent" ? "Denúncia enviada" : "Denunciar anúncio"}
      description={status === "sent" ? undefined : "Sua denúncia ajuda a tirar golpes do ar."}
      footer={
        status === "sent" ? (
          <Button onClick={close}>Fechar</Button>
        ) : (
          <>
            <Button variant="ghost" onClick={close}>
              Cancelar
            </Button>
            <Button variant="danger" loading={status === "sending"} onClick={() => void submit()}>
              Enviar denúncia
            </Button>
          </>
        )
      }
    >
      {status === "sent" ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CircleCheck aria-hidden className="size-12 text-brand" />
          <p className="text-chrome">Recebemos sua denúncia. Obrigado por ajudar a manter o Car Repasse seguro.</p>
          <p className="text-sm text-chrome-muted">
            Se você já pagou algo, registre também um boletim de ocorrência.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {status === "error" && <Alert variant="danger">Não foi possível enviar. Tente de novo.</Alert>}
          <RadioGroup
            legend="Motivo"
            options={REASONS}
            value={reason}
            onChange={(value) => {
              setReason(value);
              setReasonError(undefined);
            }}
            error={reasonError}
          />
          <Textarea
            label="Detalhes (opcional)"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder="O que aconteceu?"
            maxLength={500}
            className="min-h-24"
          />
        </div>
      )}
    </Modal>
  );
}
