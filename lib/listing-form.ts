import type { BodyType, Fuel, Listing, PriceMode, Transmission, VehicleCondition } from "@/types/listing";
import { parseCurrencyInput } from "./format";
import { isValidPlate, normalizePlate } from "./plate";

// Estado do wizard de anúncio. Números digitados ficam como texto (com máscara)
// e só viram número na hora de publicar.

export interface ListingFormValues {
  plate: string;
  /** Placa já conferida pela consulta (normalizada); se mudar, consulta de novo. */
  plateCheckedFor?: string;
  brand: string;
  model: string;
  version: string;
  modelYear: string;
  manufactureYear: string;
  fuel: Fuel | "";
  transmission: Transmission | "";
  bodyType: BodyType | "";
  color: string;
  fipeCode: string;
  fipePrice: number | null;
  fipeReferenceMonth: string;
  km: string;
  city: string;
  state: string;
  condition: VehicleCondition;
  description: string;
  photos: string[];
  priceMode: PriceMode | "";
  repassePrice: string;
  finalPrice: string;
  acceptTerms: boolean;
}

export type ListingFormErrors = Partial<Record<keyof ListingFormValues, string>>;

export const WIZARD_STEPS = ["Carro", "Detalhes", "Fotos", "Preço", "Revisão"] as const;
export const MIN_DESCRIPTION = 80;
export const MAX_PHOTOS = 15;

export const EMPTY_CONDITION: VehicleCondition = {
  hasAuctionHistory: false,
  hasAccidentHistory: false,
  isFinanced: false,
  hasDebts: false,
  singleOwner: false,
  hasServiceRecords: false,
  hasSpareKey: false,
};

export function emptyListingForm(defaults: Partial<ListingFormValues> = {}): ListingFormValues {
  return {
    plate: "",
    brand: "",
    model: "",
    version: "",
    modelYear: "",
    manufactureYear: "",
    fuel: "",
    transmission: "",
    bodyType: "",
    color: "",
    fipeCode: "",
    fipePrice: null,
    fipeReferenceMonth: "",
    km: "",
    city: "",
    state: "",
    condition: EMPTY_CONDITION,
    description: "",
    photos: [],
    priceMode: "",
    repassePrice: "",
    finalPrice: "",
    acceptTerms: false,
    ...defaults,
  };
}

const CURRENT_YEAR = new Date().getFullYear();

export function validateStep(step: number, values: ListingFormValues): ListingFormErrors {
  const errors: ListingFormErrors = {};

  if (step === 0) {
    if (!values.brand.trim()) errors.brand = "Informe a marca.";
    if (!values.model.trim()) errors.model = "Informe o modelo.";
    if (!values.version.trim()) errors.version = "Informe a versão.";
    const modelYear = Number(values.modelYear);
    const manufactureYear = Number(values.manufactureYear);
    if (!modelYear || modelYear < 1950 || modelYear > CURRENT_YEAR + 1) errors.modelYear = "Ano do modelo inválido.";
    if (!manufactureYear || manufactureYear > modelYear || manufactureYear < modelYear - 1) {
      errors.manufactureYear = "O ano de fabricação é o mesmo do modelo ou 1 ano antes.";
    }
    if (!values.fuel) errors.fuel = "Escolha o combustível.";
    if (!values.transmission) errors.transmission = "Escolha o câmbio.";
    if (!values.bodyType) errors.bodyType = "Escolha a carroceria.";
    if (!values.color.trim()) errors.color = "Informe a cor.";
    if (!values.fipePrice) errors.fipePrice = "Não encontramos o valor FIPE. Escolha o carro pela tabela FIPE.";
    // Placa obrigatória: é ela que permite checar roubo/furto e anúncio repetido.
    if (!values.plate.trim()) errors.plate = "Informe a placa. No anúncio ela aparece só como ABC****.";
    else if (!isValidPlate(values.plate)) errors.plate = "Placa inválida. Use ABC1D23 (Mercosul) ou ABC-1234.";
  }

  if (step === 1) {
    const km = parseCurrencyInput(values.km);
    if (km === undefined || km > 2_000_000) errors.km = "Informe a quilometragem.";
    if (!values.state) errors.state = "Escolha o estado.";
    if (values.city.trim().length < 2) errors.city = "Informe a cidade.";
    if (values.description.trim().length < MIN_DESCRIPTION) {
      errors.description = `Escreva pelo menos ${MIN_DESCRIPTION} caracteres sobre o estado do carro.`;
    }
  }

  if (step === 2) {
    if (values.photos.length === 0) errors.photos = "Envie pelo menos 1 foto.";
    if (values.photos.length > MAX_PHOTOS) errors.photos = `No máximo ${MAX_PHOTOS} fotos.`;
  }

  if (step === 3) {
    const repasse = parseCurrencyInput(values.repassePrice);
    const final = parseCurrencyInput(values.finalPrice);
    if (!values.priceMode) errors.priceMode = "Escolha a modalidade.";
    const needsRepasse = values.priceMode === "repasse" || values.priceMode === "ambos";
    const needsFinal = values.priceMode === "final" || values.priceMode === "ambos";
    if (needsRepasse && (!repasse || repasse < 1000)) errors.repassePrice = "Informe o preço de repasse.";
    if (needsFinal && (!final || final < 1000)) errors.finalPrice = "Informe o preço final.";
    if (values.priceMode === "ambos" && repasse && final && repasse >= final) {
      errors.repassePrice = "O preço de repasse precisa ser menor que o preço final.";
    }
  }

  if (step === 4 && !values.acceptTerms) {
    errors.acceptTerms = "Confirme que leu os termos e o aviso para publicar.";
  }

  return errors;
}

/** Valores do formulário → campos do anúncio (sem vendedor/status). */
export function toListingFields(values: ListingFormValues) {
  const mode = values.priceMode as PriceMode;
  return {
    plate: values.plate ? normalizePlate(values.plate) : undefined,
    brand: values.brand.trim(),
    model: values.model.trim(),
    version: values.version.trim(),
    modelYear: Number(values.modelYear),
    manufactureYear: Number(values.manufactureYear),
    fuel: values.fuel as Fuel,
    transmission: values.transmission as Transmission,
    bodyType: values.bodyType as BodyType,
    color: values.color.trim(),
    fipeCode: values.fipeCode || undefined,
    fipePrice: values.fipePrice ?? 0,
    fipeReferenceMonth: values.fipeReferenceMonth || undefined,
    km: parseCurrencyInput(values.km) ?? 0,
    city: values.city.trim(),
    state: values.state,
    condition: values.condition,
    description: values.description.trim(),
    photos: values.photos,
    priceMode: mode,
    repassePrice: mode === "final" ? undefined : parseCurrencyInput(values.repassePrice),
    finalPrice: mode === "repasse" ? undefined : parseCurrencyInput(values.finalPrice),
  };
}

/** Anúncio existente → valores do formulário (edição). */
export function fromListing(listing: Listing): ListingFormValues {
  const thousands = (value?: number) => (value ? value.toLocaleString("pt-BR") : "");
  return emptyListingForm({
    brand: listing.brand,
    model: listing.model,
    version: listing.version,
    modelYear: String(listing.modelYear),
    manufactureYear: String(listing.manufactureYear),
    fuel: listing.fuel,
    transmission: listing.transmission,
    bodyType: listing.bodyType,
    color: listing.color,
    fipeCode: listing.fipeCode ?? "",
    fipePrice: listing.fipePrice,
    fipeReferenceMonth: listing.fipeReferenceMonth ?? "",
    km: thousands(listing.km) || "0",
    city: listing.city,
    state: listing.state,
    condition: listing.condition,
    description: listing.description,
    photos: listing.photos,
    priceMode: listing.priceMode,
    repassePrice: thousands(listing.repassePrice),
    finalPrice: thousands(listing.finalPrice),
    acceptTerms: true,
  });
}
