import type { ListingFormValues } from "@/lib/listing-form";
import { readValue, removeValue, writeValue } from "./storage";

// Rascunho do anúncio: fica neste aparelho até publicar ou descartar.
// As fotos já estão no Storage; aqui guardamos só as URLs.

export interface ListingDraft {
  /** Pasta das fotos no Storage (estável durante o rascunho). */
  id: string;
  step: number;
  values: ListingFormValues;
  vehicleConfirmed: boolean;
  updatedAt: string;
}

const key = (userId: string) => `listing-draft:${userId}`;

export const draftRepository = {
  get(userId: string): ListingDraft | null {
    return readValue<ListingDraft | null>(key(userId), () => null);
  },

  save(userId: string, draft: ListingDraft): void {
    writeValue(key(userId), draft);
  },

  clear(userId: string): void {
    removeValue(key(userId));
  },
};
