"use client";
import { useId, useState } from "react";
export function StudyTabs({
  tabs,
  label = "Study material",
}: {
  tabs: { id: string; title: string; content: React.ReactNode }[];
  label?: string;
}) {
  const [active, setActive] = useState(tabs[0]?.id),
    id = useId();
  return (
    <div className="study-tabs">
      <div className="study-tab-list" role="tablist" aria-label={label}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`${id}-tab-${tab.id}`}
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`${id}-panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            onKeyDown={(event) => {
              if (
                !["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)
              )
                return;
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? tabs.length - 1
                    : (index +
                        (event.key === "ArrowRight" ? 1 : -1) +
                        tabs.length) %
                      tabs.length;
              setActive(tabs[next].id);
              document.getElementById(`${id}-tab-${tabs[next].id}`)?.focus();
            }}
          >
            {tab.title}
          </button>
        ))}
      </div>
      {tabs
        .filter((tab) => tab.id === active)
        .map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${id}-panel-${tab.id}`}
            aria-labelledby={`${id}-tab-${tab.id}`}
            tabIndex={0}
            className="study-tab-panel"
          >
            {tab.content}
          </div>
        ))}
    </div>
  );
}
