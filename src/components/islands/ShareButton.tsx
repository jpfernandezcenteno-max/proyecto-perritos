import { useState } from "react";

interface Props {
  title: string;
  url: string;
  label?: string;
}

export default function ShareButton({ title, url, label = "Compartir con mis amigos" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — nothing else we can do here.
    }
  }

  return (
    <button type="button" onClick={handleShare} className="w-full rounded-pill bg-accent-cta py-3 text-sm font-semibold text-white">
      {copied ? "¡Enlace copiado!" : label}
    </button>
  );
}
