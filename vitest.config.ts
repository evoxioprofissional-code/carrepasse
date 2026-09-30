import path from "node:path";
import { defineConfig } from "vitest/config";

// Testes de unidade das regras do app (sem navegador e sem banco).
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname) } },
  test: { include: ["**/*.test.ts"], exclude: ["node_modules", ".next"] },
});
