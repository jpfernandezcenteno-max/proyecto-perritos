import { useMemo, useState } from "react";
import MapView, { type MapPin } from "./MapView";
import { tagLabel } from "../../lib/format";

export type ShelterTag = "Urgente" | "Comida" | "Veterinaria" | "Adopcion";

export interface SearchableShelter {
  slug: string;
  nombre: string;
  verificado: boolean;
  distrito: string;
  totalPerritos: number;
  tags: ShelterTag[];
  montoRecaudado: number;
  montoMeta: number;
  foto: string;
  lat: number;
  lng: number;
}

interface Props {
  shelters: SearchableShelter[];
  initialQuery?: string;
  initialTags?: ShelterTag[];
}

const ALL_TAGS: ShelterTag[] = ["Urgente", "Comida", "Veterinaria", "Adopcion"];

function percent(current: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100));
}

function urgencyFor(shelter: SearchableShelter): MapPin["urgencia"] {
  const pct = percent(shelter.montoRecaudado, shelter.montoMeta);
  if (shelter.tags.includes("Urgente") || pct < 50) return "alto";
  if (pct < 100) return "medio";
  return "bajo";
}

export default function SearchAndFilter({ shelters, initialQuery = "", initialTags = [] }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [activeTags, setActiveTags] = useState<ShelterTag[]>(initialTags);
  const [view, setView] = useState<"lista" | "mapa">("lista");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shelters.filter((shelter) => {
      const matchesQuery =
        !q || shelter.nombre.toLowerCase().includes(q) || shelter.distrito.toLowerCase().includes(q);
      const matchesTags = activeTags.length === 0 || activeTags.some((tag) => shelter.tags.includes(tag));
      return matchesQuery && matchesTags;
    });
  }, [shelters, query, activeTags]);

  function toggleTag(tag: ShelterTag) {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  // Spread results onto a mock grid so the placeholder map has stable-looking positions.
  const pins: MapPin[] = results.map((shelter, index) => ({
    id: shelter.slug,
    nombre: shelter.nombre,
    slug: shelter.slug,
    x: 20 + ((index * 37) % 60),
    y: 20 + ((index * 53) % 60),
    urgencia: urgencyFor(shelter),
  }));

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-pill bg-surface px-4 py-3 shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 shrink-0 text-text-secondary" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca un albergue o distrito"
            aria-label="Busca un albergue o distrito"
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none"
          />
        </div>
        {query && (
          <button type="button" onClick={() => setQuery("")} className="shrink-0 text-sm font-medium text-text-secondary">
            Cancelar
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {ALL_TAGS.map((tag) => {
          const active = activeTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={active}
              onClick={() => toggleTag(tag)}
              className={`flex shrink-0 items-center gap-1.5 rounded-pill px-4 py-2 text-sm font-medium transition ${
                active ? "bg-accent-urgent text-white" : "bg-chip-bg text-text-primary"
              }`}
            >
              {tagLabel(tag)}
              {active && <span aria-hidden="true">×</span>}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          {results.length} {results.length === 1 ? "albergue" : "albergues"} · ordenados por cercanía
        </p>
        <div className="flex rounded-pill bg-chip-bg p-1 text-xs font-semibold lg:hidden">
          <button
            type="button"
            onClick={() => setView("lista")}
            className={`rounded-pill px-3 py-1 transition ${view === "lista" ? "bg-surface text-text-primary shadow-sm" : "text-text-secondary"}`}
          >
            Lista
          </button>
          <button
            type="button"
            onClick={() => setView("mapa")}
            className={`rounded-pill px-3 py-1 transition ${view === "mapa" ? "bg-surface text-text-primary shadow-sm" : "text-text-secondary"}`}
          >
            Mapa
          </button>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="mt-8 rounded-card bg-surface p-6 text-center text-sm text-text-secondary">
          No encontramos albergues con esos filtros. Prueba con otra búsqueda.
        </p>
      ) : (
        <div className="lg:grid lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-6">
          <ul
            className={`mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 ${view === "mapa" ? "hidden lg:grid" : ""}`}
          >
            {results.map((shelter) => (
              <li key={shelter.slug}>
                <a
                  href={`/albergues/${shelter.slug}`}
                  className="flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-sm transition hover:shadow-md"
                >
                  <img
                    src={shelter.foto}
                    alt={`Foto de ${shelter.nombre}`}
                    width={320}
                    height={180}
                    loading="lazy"
                    className="aspect-video w-full shrink-0 object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between p-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="truncate font-semibold text-text-primary">{shelter.nombre}</h3>
                        {shelter.verificado && <span className="text-success" aria-label="Verificado">✓</span>}
                      </div>
                      <p className="mt-0.5 text-xs text-text-secondary">
                        {shelter.distrito} · {shelter.totalPerritos} mascotas
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {shelter.tags.map((tag) => (
                          <span key={tag} className="rounded-pill bg-chip-bg px-2 py-0.5 text-xs text-text-secondary">
                            {tagLabel(tag)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-pill bg-chip-bg">
                      <div
                        className="h-full rounded-pill bg-accent-urgent"
                        style={{ width: `${percent(shelter.montoRecaudado, shelter.montoMeta)}%` }}
                      />
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          <div className={`${view === "lista" ? "hidden lg:block" : ""} lg:sticky lg:top-20`}>
            <MapView
              pins={pins}
              zoneLabel={`Lima Metropolitana · ${pins.length} pines`}
              heightClassName="mt-4 h-[28rem] lg:h-[36rem]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
