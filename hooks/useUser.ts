"use client";

import { useEffect, useState } from "react";
import { userRepository } from "@/repositories/userRepository";
import type { User } from "@/types/user";

type State =
  | { status: "loading" }
  | { status: "ready"; user: User }
  | { status: "not-found" }
  | { status: "error" };

export function useUser(id: string): State {
  const [loaded, setLoaded] = useState<{ id: string; state: State }>({ id: "", state: { status: "loading" } });

  useEffect(() => {
    let cancelled = false;
    userRepository
      .getById(id)
      .then((user) => {
        if (!cancelled) setLoaded({ id, state: user ? { status: "ready", user } : { status: "not-found" } });
      })
      .catch(() => {
        if (!cancelled) setLoaded({ id, state: { status: "error" } });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return loaded.id === id ? loaded.state : { status: "loading" };
}
