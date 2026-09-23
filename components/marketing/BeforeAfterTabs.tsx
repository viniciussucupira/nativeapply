"use client";

import { useId, useState } from "react";
import ExamplePair from "./ExamplePair";
import { EXAMPLES } from "@/lib/examples";

export default function BeforeAfterTabs() {
  const [active, setActive] = useState(0);
  const id = useId();

  return (
    <div>
      <div
        role="tablist"
        aria-label="Example rewrites"
        className="mx-auto flex max-w-full flex-wrap justify-center gap-2"
      >
        {EXAMPLES.map((example, index) => {
          const selected = index === active;
          return (
            <button
              key={example.context}
              id={`${id}-tab-${index}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${id}-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") setActive((active + 1) % EXAMPLES.length);
                if (event.key === "ArrowLeft") setActive((active - 1 + EXAMPLES.length) % EXAMPLES.length);
              }}
              className={
                "min-h-11 rounded-full border px-4 text-[0.875rem] font-medium transition-colors duration-200 " +
                (selected
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-white text-muted hover:border-brand-300 hover:text-navy")
              }
            >
              {example.tab}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {EXAMPLES.map((example, index) => (
          <div
            key={example.context}
            id={`${id}-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${index}`}
            hidden={index !== active}
          >
            {index === active && <ExamplePair example={example} />}
          </div>
        ))}
      </div>
    </div>
  );
}
