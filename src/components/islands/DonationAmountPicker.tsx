import { useState } from "react";

interface Props {
  shelterSlug: string;
  shelterName: string;
}

const QUICK_AMOUNTS = [10, 30, 80];

export default function DonationAmountPicker({ shelterSlug, shelterName }: Props) {
  const [amount, setAmount] = useState<number | "otro">(30);
  const [customAmount, setCustomAmount] = useState("");
  const [wantsMessage, setWantsMessage] = useState(false);
  const [message, setMessage] = useState("");

  const finalAmount = amount === "otro" ? Number(customAmount) || 0 : amount;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      shelter: shelterSlug,
      monto: String(finalAmount),
    });
    if (wantsMessage && message.trim()) params.set("mensaje", message.trim());
    window.location.href = `/gracias?${params.toString()}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="font-semibold text-text-primary">¿Cuánto yapeaste a {shelterName}?</p>
        <p className="mt-1 text-xs text-text-secondary">
          Esto es opcional y autodeclarado — Wasitas no verifica ni procesa el pago.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_AMOUNTS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setAmount(value)}
            className={`rounded-pill px-4 py-2 text-sm font-semibold transition ${
              amount === value ? "bg-accent-cta text-white" : "bg-chip-bg text-text-primary"
            }`}
          >
            S/ {value}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setAmount("otro")}
          className={`rounded-pill px-4 py-2 text-sm font-semibold transition ${
            amount === "otro" ? "bg-accent-cta text-white" : "bg-chip-bg text-text-primary"
          }`}
        >
          Otro
        </button>
      </div>

      {amount === "otro" && (
        <input
          type="number"
          min={1}
          inputMode="numeric"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          placeholder="Monto en soles"
          aria-label="Monto en soles"
          className="w-full rounded-input border border-chip-bg bg-surface px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-cta"
        />
      )}

      <label className="flex items-center gap-2 text-sm text-text-primary">
        <input
          type="checkbox"
          checked={wantsMessage}
          onChange={(e) => setWantsMessage(e.target.checked)}
          className="h-4 w-4 rounded border-chip-bg text-accent-cta focus:ring-accent-cta"
        />
        Dejar un mensaje al albergue
      </label>

      {wantsMessage && (
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje corto..."
          aria-label="Mensaje para el albergue"
          rows={3}
          className="w-full rounded-input border border-chip-bg bg-surface px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-cta"
        />
      )}

      <div className="space-y-2">
        <button
          type="submit"
          disabled={finalAmount <= 0}
          className="w-full rounded-pill bg-accent-cta py-3 text-sm font-semibold text-white transition disabled:opacity-40"
        >
          Guardar mi constancia
        </button>
        <a href={`/albergues/${shelterSlug}`} className="block text-center text-sm font-medium text-text-secondary">
          Ahora no
        </a>
      </div>
    </form>
  );
}
