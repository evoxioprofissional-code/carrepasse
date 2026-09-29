"use client";

import { Building2, Flag, Handshake, SlidersHorizontal, UserRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { RadioGroup } from "@/components/ui/RadioGroup";

type ReportReason = "golpe" | "informacao_falsa" | "carro_vendido" | "outro";
type SellerTypeOption = "lojista" | "corretor" | "particular";

export function ModalDemo() {
  const [reportOpen, setReportOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>();
  const [sellerType, setSellerType] = useState<SellerTypeOption>("lojista");

  return (
    <div className="flex flex-col gap-6">
      <RadioGroup
        legend="Você é"
        variant="cards"
        value={sellerType}
        onChange={setSellerType}
        options={[
          {
            value: "lojista",
            label: "Lojista",
            description: "Revenda com estoque, quer girar carro rápido.",
            icon: <Building2 />,
          },
          {
            value: "corretor",
            label: "Corretor",
            description: "Compra no repasse e revende.",
            icon: <Handshake />,
          },
          {
            value: "particular",
            label: "Particular",
            description: "Vende ou compra o próprio carro.",
            icon: <UserRound />,
          },
        ]}
      />
      <div className="flex flex-wrap gap-3">
        <Button variant="danger" onClick={() => setReportOpen(true)}>
          <Flag aria-hidden className="size-4" />
          Denunciar anúncio
        </Button>
        <Button variant="secondary" onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal aria-hidden className="size-4" />
          Filtros (2)
        </Button>
      </div>

      <Modal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Denunciar anúncio"
        description="Sua denúncia ajuda a tirar golpes do ar."
        footer={
          <>
            <Button variant="ghost" onClick={() => setReportOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => setReportOpen(false)}>
              Enviar denúncia
            </Button>
          </>
        }
      >
        <RadioGroup
          legend="Motivo da denúncia"
          value={reason}
          onChange={setReason}
          options={[
            { value: "golpe", label: "Parece golpe" },
            { value: "informacao_falsa", label: "Informação falsa" },
            { value: "carro_vendido", label: "O carro já foi vendido" },
            { value: "outro", label: "Outro motivo" },
          ]}
        />
      </Modal>

      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        variant="sheet"
        title="Filtros"
        footer={
          <Button fullWidth onClick={() => setFiltersOpen(false)}>
            Ver 128 carros
          </Button>
        }
      >
        <p className="text-sm text-chrome-muted">
          No celular os filtros da busca abrem assim, de baixo para cima.
        </p>
      </Modal>
    </div>
  );
}
