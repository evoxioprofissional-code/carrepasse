"use client";

import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Container } from "@/components/ui/Container";
import {
  emptyListingForm,
  fromListing,
  toListingFields,
  validateStep,
  WIZARD_STEPS,
  type ListingFormErrors,
  type ListingFormValues,
} from "@/lib/listing-form";
import { draftRepository, type ListingDraft } from "@/repositories/draftRepository";
import { listingRepository } from "@/repositories/listingRepository";
import { photoRepository } from "@/repositories/photoRepository";
import type { Listing } from "@/types/listing";
import type { User } from "@/types/user";
import { PublishSuccess } from "./PublishSuccess";
import { StepDetails } from "./StepDetails";
import { StepPhotos } from "./StepPhotos";
import { StepPrice } from "./StepPrice";
import { StepReview } from "./StepReview";
import { StepVehicle } from "./StepVehicle";
import { WizardActions } from "./WizardActions";
import { WizardProgress } from "./WizardProgress";

type WizardProps = { user: User } & ({ mode: "create" } | { mode: "edit"; listing: Listing });

const LAST_STEP = WIZARD_STEPS.length - 1;

function newDraftId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
}

function freshDraft(user: User): ListingDraft {
  return {
    id: newDraftId(),
    step: 0,
    values: emptyListingForm({ city: user.city, state: user.state }),
    vehicleConfirmed: false,
    updatedAt: new Date().toISOString(),
  };
}

/** Anúncio em etapas: criar (com rascunho automático) ou editar um anúncio. */
export function ListingWizard(props: WizardProps) {
  const { user } = props;
  const router = useRouter();
  const isEdit = props.mode === "edit";
  const firstStep = isEdit ? 1 : 0;

  const [draft, setDraft] = useState<ListingDraft>(() => {
    if (props.mode === "edit") {
      return { id: props.listing.id, step: 1, values: fromListing(props.listing), vehicleConfirmed: true, updatedAt: "" };
    }
    return draftRepository.get(user.id) ?? freshDraft(user);
  });
  // Etapa em que um rascunho antigo foi recuperado (-1 = começou agora).
  const [restoredStep, setRestoredStep] = useState(() =>
    !isEdit && draft.updatedAt !== "" && (draft.step > 0 || draft.values.brand !== "") ? draft.step : -1,
  );
  const [errors, setErrors] = useState<ListingFormErrors>({});
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [published, setPublished] = useState<Listing | null>(null);

  const { step, values } = draft;

  // Rascunho salvo a cada mudança (só ao criar).
  useEffect(() => {
    if (!isEdit && !published) draftRepository.save(user.id, draft);
  }, [draft, isEdit, published, user.id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const change = useCallback((patch: Partial<ListingFormValues>) => {
    setDraft((current) => ({ ...current, values: { ...current.values, ...patch }, updatedAt: new Date().toISOString() }));
    setErrors((current) => {
      const next = { ...current };
      (Object.keys(patch) as (keyof ListingFormValues)[]).forEach((key) => delete next[key]);
      return next;
    });
  }, []);

  const goTo = (target: number) => {
    setErrors({});
    setDraft((current) => ({ ...current, step: Math.max(firstStep, Math.min(LAST_STEP, target)) }));
  };

  const validate = (target: number) => {
    const found = validateStep(target, values);
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const next = (): boolean => {
    if (!validate(step)) return false;
    goTo(step + 1);
    return true;
  };

  const submit = async () => {
    // Revalida tudo: o rascunho pode ter vindo de outra sessão.
    for (let index = firstStep; index <= LAST_STEP; index += 1) {
      if (!validate(index)) {
        goTo(index);
        setErrors(validateStep(index, values));
        return;
      }
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const fields = toListingFields(values);
      if (props.mode === "edit") {
        // A placa não muda na edição (o repositório só grava colunas do anúncio).
        await listingRepository.update(props.listing.id, fields);
        // Fotos tiradas na edição só saem do Storage depois de salvar.
        const removed = props.listing.photos.filter((photo) => !fields.photos.includes(photo));
        if (removed.length > 0) void photoRepository.remove(removed).catch(() => {});
        router.push("/minha-conta/anuncios?salvo=1");
        return;
      }
      const listing = await listingRepository.create({ ...fields, sellerId: user.id });
      draftRepository.clear(user.id);
      setPublished(listing);
    } catch {
      setSubmitError("Não foi possível salvar agora. Confira sua conexão e tente de novo — nada foi perdido.");
    } finally {
      setSubmitting(false);
    }
  };

  const discardDraft = () => {
    // As fotos do rascunho não estão em nenhum anúncio publicado.
    if (draft.values.photos.length > 0) void photoRepository.remove(draft.values.photos).catch(() => {});
    draftRepository.clear(user.id);
    setErrors({});
    setRestoredStep(-1);
    setDraft(freshDraft(user));
  };

  if (published) {
    return (
      <Container className="py-8">
        <PublishSuccess
          listing={published}
          onNewListing={() => {
            setPublished(null);
            setDraft(freshDraft(user));
          }}
        />
      </Container>
    );
  }

  return (
    <Container className="max-w-3xl py-5 sm:py-8">
      <div className="mb-6">
        <WizardProgress step={step} firstStep={firstStep} />
      </div>

      {restoredStep === step && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-chrome-muted">
          <span>Continuando o anúncio que você começou.</span>
          <button type="button" onClick={discardDraft} className="inline-flex min-h-11 items-center gap-1 font-semibold text-chrome hover:text-lime-ink">
            <RotateCcw aria-hidden className="size-4" />
            Começar do zero
          </button>
        </div>
      )}

      {isEdit && (
        <p className="mb-5 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-chrome-muted">
          Editando: <strong className="text-chrome">{values.brand} {values.model} {values.version}</strong>
        </p>
      )}

      {step === 0 && <StepVehicle values={values} errors={errors} onChange={change} onNext={next} />}
      {step === 1 && <StepDetails values={values} errors={errors} onChange={change} />}
      {step === 2 && (
        <StepPhotos
            values={values}
            errors={errors}
            onChange={change}
            userId={user.id}
            folder={draft.id}
            onBusyChange={setUploading}
            deleteOnRemove={!isEdit}
          />
      )}
      {step === 3 && <StepPrice values={values} errors={errors} onChange={change} />}
      {step === 4 && (
        <StepReview values={values} errors={errors} onChange={change} onGoTo={goTo} user={user} canEditVehicle={!isEdit} />
      )}

      {submitError && (
        <Alert variant="danger" className="mt-5">
          {submitError}
        </Alert>
      )}

      {step > 0 && (
        <WizardActions
          onBack={step > firstStep ? () => goTo(step - 1) : undefined}
          onNext={step === LAST_STEP ? () => void submit() : () => void next()}
          nextLabel={step === LAST_STEP ? (isEdit ? "Salvar alterações" : "Publicar anúncio") : "Continuar"}
          loading={submitting}
          disabled={uploading}
          hint={uploading ? "Aguarde as fotos terminarem de enviar." : undefined}
        />
      )}
    </Container>
  );
}
