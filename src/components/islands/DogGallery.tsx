import { useRef, useState } from "react";

interface Props {
  photos: string[];
  alt: string;
}

export default function DogGallery({ photos, alt }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(photos.length - 1, index));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    setActive(clamped);
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex aspect-square snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-card lg:aspect-[4/5] [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {photos.map((photo, index) => (
          <img
            key={photo}
            src={photo}
            alt={`${alt} — foto ${index + 1} de ${photos.length}`}
            loading={index === 0 ? "eager" : "lazy"}
            className="aspect-square w-full shrink-0 snap-start object-cover lg:aspect-[4/5]"
          />
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-pill bg-surface/90 text-text-primary shadow-sm transition disabled:opacity-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === photos.length - 1}
            aria-label="Foto siguiente"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-pill bg-surface/90 text-text-primary shadow-sm transition disabled:opacity-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {photos.map((photo, index) => (
              <button
                key={photo}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Ir a la foto ${index + 1}`}
                aria-current={index === active}
                className={`h-1.5 rounded-pill transition-all ${index === active ? "w-5 bg-white" : "w-1.5 bg-white/60"}`}
              />
            ))}
          </div>

          <span className="absolute right-3 top-3 rounded-pill bg-text-primary/70 px-2.5 py-1 text-xs font-medium text-white">
            {active + 1}/{photos.length}
          </span>
        </>
      )}
    </div>
  );
}
