import { useEffect, useRef, useState } from "react";

/**
 * Browsers don't expose a real screen-brightness API. This does the two
 * things that actually help while scanning a QR: keeps the screen from
 * sleeping (Screen Wake Lock, where supported) and raises an all-white
 * overlay a few beats, which most panels render brighter than dark UI.
 */
export default function BrightnessBoost() {
  const [boosted, setBoosted] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    return () => {
      wakeLockRef.current?.release().catch(() => {});
    };
  }, []);

  async function toggleBoost() {
    if (boosted) {
      setBoosted(false);
      await wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
      return;
    }

    setBoosted(true);
    if ("wakeLock" in navigator) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      } catch {
        // Ignore — not all browsers/permissions allow it; the overlay still helps.
      }
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={toggleBoost}
        aria-pressed={boosted}
        className="w-full rounded-pill bg-white/15 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
      >
        {boosted ? "Brillo al máximo activado" : "Brillo al máximo"}
      </button>
      {boosted && <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-white/25" />}
    </>
  );
}
