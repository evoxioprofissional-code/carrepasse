"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";

const brands = [
  { value: "chevrolet", label: "Chevrolet" },
  { value: "fiat", label: "Fiat" },
  { value: "hyundai", label: "Hyundai" },
  { value: "toyota", label: "Toyota" },
  { value: "volkswagen", label: "Volkswagen" },
];

export function FormDemo() {
  const [description, setDescription] = useState("");
  const [noAuction, setNoAuction] = useState(true);
  const [noAccident, setNoAccident] = useState(false);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Input label="Placa" placeholder="ABC1D23" required hint="Antiga ou Mercosul." />
        <Input label="Quilometragem" inputMode="numeric" placeholder="87.500" suffix="km" />
        <Input label="Preço de repasse" inputMode="numeric" placeholder="45.900" prefix="R$" />
        <Input label="E-mail" type="email" defaultValue="joao@" error="Digite um e-mail válido." />
        <Select label="Marca" placeholder="Todas as marcas" options={brands} />
        <Input label="Desabilitado" disabled defaultValue="Não editável" />
      </div>
      <div className="flex flex-col gap-4">
        <Textarea
          label="Descrição do veículo"
          required
          minChars={80}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Conte como está a lataria, a mecânica, os pneus e a documentação."
          hint="Seja honesto: anúncio claro vende mais rápido."
        />
        <Checkbox label="Único dono" description="O carro nunca foi transferido." defaultChecked />
        <Checkbox label="Tem chave reserva" />
        <Checkbox
          label="Li e aceito os termos de uso"
          error="Você precisa aceitar os termos para publicar."
        />
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
          <Switch label="Sem leilão" checked={noAuction} onCheckedChange={setNoAuction} />
          <Switch
            label="Sem sinistro"
            description="Esconde carros com batida de monta."
            checked={noAccident}
            onCheckedChange={setNoAccident}
          />
        </div>
      </div>
    </div>
  );
}
