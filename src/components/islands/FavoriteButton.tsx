import { useState } from "react";

export default function FavoriteButton({ shelterName }: { shelterName: string }) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Quitar ${shelterName} de favoritos` : `Guardar ${shelterName} en favoritos`}
      onClick={() => setSaved((prev) => !prev)}
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-pill border transition ${
        saved ? "border-accent-urgent bg-accent-urgent/10 text-accent-urgent" : "border-chip-bg text-text-secondary"
      }`}
    >
      <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path
          d="M12 20.5s-7.5-4.6-10-9.2C.6 8 2 4.5 5.4 3.6c2-.5 4 .3 5.1 2 .3.5.9.5 1.2 0 1.1-1.7 3.1-2.5 5.1-2C20.2 4.5 21.6 8 22 11.3c-2.5 4.6-10 9.2-10 9.2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
