export function formatSoles(amount: number): string {
  return `S/ ${amount.toLocaleString("es-PE")}`;
}

export function progressPercent(current: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100));
}
