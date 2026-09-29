"use client";

import { Building2, Handshake, UserRound } from "lucide-react";
import { RadioGroup } from "@/components/ui/RadioGroup";
import type { SellerType } from "@/types/user";

const OPTIONS = [
  { value: "lojista" as const, label: "Lojista", description: "Revenda com estoque, quer girar carro rápido.", icon: <Building2 /> },
  { value: "corretor" as const, label: "Corretor", description: "Compra no repasse e revende.", icon: <Handshake /> },
  { value: "particular" as const, label: "Particular", description: "Vende ou compra o próprio carro.", icon: <UserRound /> },
];

interface SellerTypeFieldProps {
  value: SellerType | undefined;
  onChange: (value: SellerType) => void;
  error?: string;
}

export function SellerTypeField({ value, onChange, error }: SellerTypeFieldProps) {
  return (
    <RadioGroup
      legend="Você é"
      name="sellerType"
      variant="cards"
      options={OPTIONS}
      value={value}
      onChange={onChange}
      error={error}
    />
  );
}
