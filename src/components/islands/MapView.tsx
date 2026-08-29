import { useState } from "react";

export interface MapPin {
  id: string;
  nombre: string;
  slug: string;
  x: number; // 0-100, percent position within the map canvas
  y: number; // 0-100
  urgencia: "alto" | "medio" | "bajo";
  label?: string; // e.g. "64%" shown on a floating pill for the top pin
}

interface Props {
  pins: MapPin[];
  zoneLabel?: string;
  heightClassName?: string;
}

const urgencyColor: Record<MapPin["urgencia"], string> = {
  alto: "bg-accent-urgent",
  medio: "bg-amber-500",
  bajo: "bg-success",
};

/**
 * TODO: replace with a real Mapbox GL / Leaflet map (see "Pendiente de
 * definir" in the spec — provider not chosen yet). This placeholder keeps
 * the pin/urgency-color/label contract so swapping the renderer later
 * doesn't change any calling page.
 */
export default function MapView({ pins, zoneLabel, heightClassName = "h-64" }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const featured = pins.find((p) => p.label);

  return (
    <div className={`relative w-full overflow-hidden rounded-card bg-chip-bg ${heightClassName}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.04),transparent_60%)]" />

      {zoneLabel && (
        <span className="absolute left-3 top-3 rounded-pill bg-surface px-3 py-1 text-xs font-medium text-text-secondary shadow-sm">
          {zoneLabel}
        </span>
      )}

      {featured && (
        <span className="absolute right-3 top-3 rounded-pill bg-text-primary px-3 py-1 text-xs font-semibold text-white shadow-sm">
          {featured.nombre} · {featured.label}
        </span>
      )}

      {pins.map((pin) => (
        <a
          key={pin.id}
          href={`/albergues/${pin.slug}`}
          onMouseEnter={() => setHovered(pin.id)}
          onMouseLeave={() => setHovered(null)}
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          aria-label={pin.nombre}
        >
          <span className={`block h-3.5 w-3.5 rounded-full border-2 border-white shadow ${urgencyColor[pin.urgencia]}`} />
          {hovered === pin.id && (
            <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-input bg-text-primary px-2 py-1 text-xs text-white">
              {pin.nombre}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
