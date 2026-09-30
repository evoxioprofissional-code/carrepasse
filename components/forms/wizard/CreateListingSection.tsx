"use client";

import { SignInRequired } from "@/components/auth/SignInRequired";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { ListingWizard } from "./ListingWizard";

export function CreateListingSection() {
  const { state } = useAuth();
  if (state.status === "anonymous") {
    return (
      <Container className="max-w-3xl py-16">
        <SignInRequired />
      </Container>
    );
  }
  if (state.status !== "authenticated") {
    return (
      <Container className="max-w-3xl py-8" aria-busy>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-6 h-72 w-full rounded-2xl" />
      </Container>
    );
  }
  return <ListingWizard mode="create" user={state.user} />;
}
