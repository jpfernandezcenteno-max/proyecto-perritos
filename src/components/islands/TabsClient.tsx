import { useState } from "react";

export interface TabDef {
  id: string;
  label: string;
}

interface Panel {
  id: string;
  html: string;
}

interface Props {
  tabs: TabDef[];
  panels: Panel[];
  defaultTab: string;
}

export default function TabsClient({ tabs, panels, defaultTab }: Props) {
  const [active, setActive] = useState(defaultTab);

  return (
    <div>
      <div role="tablist" className="flex gap-1 overflow-x-auto rounded-pill bg-chip-bg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={`shrink-0 rounded-pill px-4 py-2 text-sm font-semibold transition ${
              active === tab.id ? "bg-surface text-text-primary shadow-sm" : "text-text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {panels.map((panel) => (
          <div key={panel.id} role="tabpanel" hidden={active !== panel.id} dangerouslySetInnerHTML={{ __html: panel.html }} />
        ))}
      </div>
    </div>
  );
}
