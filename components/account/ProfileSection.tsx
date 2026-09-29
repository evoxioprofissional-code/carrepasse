"use client";

import { useAuth } from "@/hooks/useAuth";
import { AccountPage } from "./AccountPage";
import { ProfileForm } from "./ProfileForm";

export function ProfileSection() {
  const { refresh, signOut } = useAuth();
  return (
    <AccountPage title="Minha conta">
      {(user) => <ProfileForm key={user.id} user={user} onSaved={refresh} onSignOut={signOut} />}
    </AccountPage>
  );
}
