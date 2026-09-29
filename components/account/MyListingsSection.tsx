"use client";

import { AccountPage } from "./AccountPage";
import { MyListings } from "./MyListings";

export function MyListingsSection() {
  return <AccountPage title="Meus anúncios">{(user) => <MyListings userId={user.id} />}</AccountPage>;
}
