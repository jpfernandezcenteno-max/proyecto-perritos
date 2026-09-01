import { useMemo, useState } from "react";
import MapView, { type MapPin } from "./MapView";
import { tagLabel } from "../../lib/format";

export type ShelterTag = "Urgente" | "Comida" | "Veterinaria" | "Adopcion";
type SortOrder = "cercania" | "urgencia";

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
  const [activeDistritos, setActiveDistritos] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOrder>("cercania");
  const [view, setView] = useState<"lista" | "mapa">("lista");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const distritos = useMemo(
    () => Array.from(new Set(shelters.map((s) => s.distrito))).sort(),
    [shelters],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = shelters.filter((shelter) => {
      const matchesQuery =
        !q || shelter.nombre.toLowerCase().includes(q) || shelter.distrito.toLowerCase().includes(q);
      const matchesTags = activeTags.length === 0 || activeTags.some((tag) => shelter.tags.includes(tag));
      const matchesDistrito = activeDistritos.length === 0 || activeDistritos.includes(shelter.distrito);
      return matchesQuery && matchesTags && matchesDistrito;
    });

    if (sort === "urgencia") {
      return [...filtered].sort((a, b) => {
        const aUrgent = a.tags.includes("Urgente") ? 0 : 1;
        const bUrgent = b.tags.includes("Urgente") ? 0 : 1;
        if (aUrgent !== bUrgent) return aUrgent - bUrgent;
        return percent(a.montoRecaudado, a.montoMeta) - percent(b.montoRecaudado, b.montoMeta);
      });
    }
    return filtered;
  }, [shelters, query, activeTags, activeDistritos, sort]);

  function toggleTag(tag: ShelterTag) {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function toggleDistrito(distrito: string) {
    setActiveDistritos((prev) =>
      prev.includes(distrito) ? prev.filter((d) => d !== distrito) : [...prev, distrito],
    );
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

  const activeFilterCount = activeTags.length + activeDistritos.length;

  const filterGroups = (
    <>
      <div>
        <h3 className="font-heading text-sm font-bold text-text-primary">Necesidad</h3>
        <div className="mt-3 flex flex-col gap-2.5">
          {ALL_TAGS.map((tag) => (
            <label key={tag} className="flex cursor-pointer items-center gap-2.5 rounded-input px-1.5 py-1 text-sm text-text-primary transition hover:bg-chip-bg/60">
              <input
                type="checkbox"
                checked={activeTags.includes(tag)}
                onChange={() => toggleTag(tag)}
                className="h-4 w-4 rounded border-chip-bg text-accent-cta focus:ring-accent-cta"
              />
              {tagLabel(tag)}
            </label>
          ))}
        </div>
      </div>

      {distritos.length > 1 && (
        <div className="mt-6">
          <h3 className="font-heading text-sm font-bold text-text-primary">Distrito</h3>
          <div className="mt-3 flex flex-col gap-2.5">
            {distritos.map((distrito) => (
              <label key={distrito} className="flex cursor-pointer items-center gap-2.5 rounded-input px-1.5 py-1 text-sm text-text-primary transition hover:bg-chip-bg/60">
                <input
                  type="checkbox"
                  checked={activeDistritos.includes(distrito)}
                  onChange={() => toggleDistrito(distrito)}
                  className="h-4 w-4 rounded border-chip-bg text-accent-cta focus:ring-accent-cta"
                />
                {distrito}
              </label>
            ))}
          </div>
        </div>
      )}

      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={() => {
            setActiveTags([]);
            setActiveDistritos([]);
          }}
          className="mt-6 text-sm font-semibold text-accent-cta"
        >
          Limpiar filtros
        </button>
      )}
    </>
  );

  return (
    <div className="lg:grid lg:grid-cols-[13rem_1fr_22rem] lg:items-start lg:gap-6">
      <aside className="hidden lg:block lg:sticky lg:top-20">
        <div className="rounded-card bg-surface p-4 shadow-sm">{filterGroups}</div>
      </aside>

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
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            className="flex shrink-0 items-center gap-1.5 rounded-pill bg-chip-bg px-4 py-3 text-sm font-semibold text-text-primary transition hover:bg-accent-cta hover:text-white lg:hidden"
          >
            Filtros
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-pill bg-accent-cta text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {filtersOpen && (
          <div className="mt-3 rounded-card bg-surface p-4 shadow-sm lg:hidden">{filterGroups}</div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-text-secondary">
            {results.length} {results.length === 1 ? "albergue" : "albergues"} · ordenados por{" "}
            {sort === "cercania" ? "cercanía" : "urgencia"}
          </p>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOrder)}
              aria-label="Ordenar por"
              className="rounded-pill bg-chip-bg px-3 py-1.5 text-xs font-semibold text-text-primary focus:outline-none"
            >
              <option value="cercania">Cercanía</option>
              <option value="urgencia">Más urgentes</option>
            </select>
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
        </div>

        {results.length === 0 ? (
          <p className="mt-8 rounded-card bg-surface p-6 text-center text-sm text-text-secondary">
            No encontramos albergues con esos filtros. Prueba con otra búsqueda.
          </p>
        ) : (
          <ul className={`mt-4 flex flex-col gap-3 ${view === "mapa" ? "hidden lg:flex" : ""}`}>
            {results.map((shelter) => (
              <li
                key={shelter.slug}
                className="flex items-center gap-3 rounded-card bg-surface p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <a href={`/albergues/${shelter.slug}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <img
                    src={shelter.foto}
                    alt={`Foto de ${shelter.nombre}`}
                    width={80}
                    height={80}
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded-input object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate font-semibold text-text-primary">{shelter.nombre}</h3>
                      {shelter.verificado && <span className="text-success" aria-label="Verificado">✓</span>}
                    </div>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {shelter.distrito} · {shelter.totalPerritos} mascotas
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {shelter.tags.map((tag) => (
                        <span key={tag} className="rounded-pill bg-chip-bg px-2 py-0.5 text-xs text-text-secondary">
                          {tagLabel(tag)}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 h-2 w-full max-w-xs overflow-hidden rounded-pill bg-chip-bg">
                      <div
                        className="h-full rounded-pill bg-accent-urgent"
                        style={{ width: `${percent(shelter.montoRecaudado, shelter.montoMeta)}%` }}
                      />
                    </div>
                  </div>
                </a>
                <a
                  href={`/albergues/${shelter.slug}/qr`}
                  className="shrink-0 rounded-pill bg-accent-cta px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Yapear
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={`${view === "lista" ? "hidden lg:block" : ""} lg:sticky lg:top-20`}>
        <MapView
          pins={pins}
          zoneLabel={`Arequipa · ${pins.length} pines`}
          heightClassName="mt-4 h-[28rem] lg:h-[36rem]"
        />
      </div>
    </div>
  );
}
