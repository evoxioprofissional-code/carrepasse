import { simulateLatency } from "@/lib/latency";
import { SEED_USERS } from "@/mocks/users";
import type { SellerSummary, User } from "@/types/user";
import { createId, readValue, writeValue } from "./storage";

const KEY = "users";

function readAll(): User[] {
  return readValue<User[]>(KEY, () => SEED_USERS);
}

/** Versão síncrona para montar dados relacionados (anúncio + vendedor). */
export function readUsersSync(): User[] {
  return readAll();
}

export function toSellerSummary(user: User): SellerSummary {
  return {
    id: user.id,
    name: user.name,
    storeName: user.storeName,
    sellerType: user.sellerType,
    city: user.city,
    state: user.state,
    phone: user.phone,
    createdAt: user.createdAt,
  };
}

export const userRepository = {
  async list(): Promise<User[]> {
    await simulateLatency(150, 400);
    return readAll();
  },

  async getById(id: string): Promise<User | null> {
    await simulateLatency(150, 400);
    return readAll().find((user) => user.id === id) ?? null;
  },

  async getByEmail(email: string): Promise<User | null> {
    await simulateLatency(150, 400);
    const normalized = email.trim().toLowerCase();
    return readAll().find((user) => user.email.toLowerCase() === normalized) ?? null;
  },

  async create(input: Omit<User, "id" | "createdAt">): Promise<User> {
    await simulateLatency(300, 700);
    const user: User = { ...input, id: createId("u"), createdAt: new Date().toISOString() };
    writeValue(KEY, [...readAll(), user]);
    return user;
  },

  async update(id: string, patch: Partial<Omit<User, "id" | "createdAt">>): Promise<User> {
    await simulateLatency(300, 700);
    const users = readAll();
    const current = users.find((user) => user.id === id);
    if (!current) throw new Error("Usuário não encontrado.");
    const updated = { ...current, ...patch };
    writeValue(
      KEY,
      users.map((user) => (user.id === id ? updated : user)),
    );
    return updated;
  },
};
