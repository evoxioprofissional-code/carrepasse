import { simulateLatency } from "@/lib/latency";
import type { Report } from "@/types/report";
import { createId, readValue, writeValue } from "./storage";

const KEY = "reports";

export const reportRepository = {
  async create(input: Omit<Report, "id" | "createdAt">): Promise<Report> {
    await simulateLatency(400, 800);
    const report: Report = { ...input, id: createId("r"), createdAt: new Date().toISOString() };
    writeValue(KEY, [...readValue<Report[]>(KEY, () => []), report]);
    return report;
  },
};
