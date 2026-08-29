import { useState } from "react";

interface Props {
  label: string;
  description?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Toggle({ label, description, defaultChecked = false, onChange }: Props) {
  const [checked, setChecked] = useState(defaultChecked);

  function toggle() {
    const next = !checked;
    setChecked(next);
    onChange?.(next);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        {description && <p className="text-xs text-text-secondary">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={toggle}
        className={`relative h-7 w-12 shrink-0 rounded-pill transition ${checked ? "bg-success" : "bg-chip-bg"}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-pill bg-white shadow transition ${checked ? "left-[calc(100%-1.625rem)]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}
