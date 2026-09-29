"use client";

import { AccountPage } from "./AccountPage";
import { FavoritesList } from "./FavoritesList";

export function FavoritesSection() {
  return <AccountPage title="Favoritos">{() => <FavoritesList />}</AccountPage>;
}
