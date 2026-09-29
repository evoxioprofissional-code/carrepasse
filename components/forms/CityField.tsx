"use client";

import { useEffect, useId, useState, type ComponentProps } from "react";
import { Input } from "@/components/ui/Input";
import { getCities } from "@/services/ibge";

type CityFieldProps = Omit<ComponentProps<typeof Input>, "label" | "list"> & {
  /** UF escolhida; as sugestões vêm dos municípios do IBGE desse estado. */
  uf: string;
};

/** Cidade com sugestões oficiais (continua aceitando texto livre). */
export function CityField({ uf, ...props }: CityFieldProps) {
  const listId = useId();
  const [loaded, setLoaded] = useState<{ uf: string; cities: string[] }>({ uf: "", cities: [] });

  useEffect(() => {
    if (!uf) return;
    let cancelled = false;
    void getCities(uf).then((cities) => {
      if (!cancelled) setLoaded({ uf, cities });
    });
    return () => {
      cancelled = true;
    };
  }, [uf]);

  const cities = loaded.uf === uf ? loaded.cities : [];

  return (
    <>
      <Input
        label="Cidade"
        list={listId}
        autoComplete="address-level2"
        placeholder={uf ? "Comece a digitar" : "Escolha o estado primeiro"}
        disabled={!uf}
        {...props}
      />
      <datalist id={listId}>
        {cities.map((city) => (
          <option key={city} value={city} />
        ))}
      </datalist>
    </>
  );
}
