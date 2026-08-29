import { useState } from "react";

interface Props {
  shelterName: string;
  monthlyAmount: number;
  nextReminder: string;
}

export default function MonthlyDonationCard({ shelterName, monthlyAmount, nextReminder }: Props) {
  const [active, setActive] = useState(true);
  const [amount, setAmount] = useState(monthlyAmount);

  return (
    <div className="rounded-card bg-accent-cta p-4 text-white">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white/80">Aporte mensual</p>
        <span
          className={`rounded-pill px-2.5 py-1 text-xs font-semibold ${active ? "bg-success text-white" : "bg-white/20 text-white/80"}`}
        >
          {active ? "Activo" : "Pausado"}
        </span>
      </div>

      <p className="mt-3 text-2xl font-bold">S/ {amount}/mes</p>
      <p className="text-sm text-white/70">a {shelterName}</p>
      {active && <p className="mt-2 text-xs text-white/60">Próximo recordatorio: {nextReminder}</p>}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => {
            const next = window.prompt("Nuevo monto mensual (S/)", String(amount));
            const parsed = Number(next);
            if (next && !Number.isNaN(parsed) && parsed > 0) setAmount(parsed);
          }}
          className="flex-1 rounded-pill bg-white/15 px-3 py-2 text-sm font-semibold transition hover:bg-white/25"
        >
          Cambiar monto
        </button>
        <button
          type="button"
          onClick={() => setActive((prev) => !prev)}
          className="flex-1 rounded-pill bg-white/15 px-3 py-2 text-sm font-semibold transition hover:bg-white/25"
        >
          {active ? "Pausar" : "Reactivar"}
        </button>
      </div>
    </div>
  );
}
