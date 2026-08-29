import { useState } from "react";

interface Props {
  qrImage: string;
  shelterName: string;
  shareUrl: string;
}

export default function QrActions({ qrImage, shelterName, shareUrl }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Yapea a ${shelterName}`, url: shareUrl });
        return;
      } catch {
        // user cancelled — no-op
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — nothing else we can do here.
    }
  }

  return (
    <div className="flex gap-3">
      <a
        href={qrImage}
        download={`qr-yape-${shelterName.toLowerCase().replace(/\s+/g, "-")}.png`}
        className="flex-1 rounded-pill bg-white/10 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/20"
      >
        Guardar QR
      </a>
      <button
        type="button"
        onClick={handleShare}
        className="flex-1 rounded-pill bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
      >
        {copied ? "¡Enlace copiado!" : "Compartir"}
      </button>
    </div>
  );
}
