import type { ShelterTag } from "./types";

export function formatSoles(amount: number): string {
  return `S/ ${amount.toLocaleString("es-PE")}`;
}

const TAG_LABELS: Record<ShelterTag, string> = {
  Urgente: "Urgente",
  Comida: "Comida",
  Veterinaria: "Veterinaria",
  Adopcion: "Adopción",
};

export function tagLabel(tag: ShelterTag): string {
  return TAG_LABELS[tag];
}

export function progressPercent(current: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100));
}
