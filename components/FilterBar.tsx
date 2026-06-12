"use client";

import type { CategoryRow } from "@/types/database.types";

export type FilterValue = string;

interface Props {
  active: FilterValue;
  onChange: (value: FilterValue) => void;
  categories: CategoryRow[];
}

export default function FilterBar({ active, onChange, categories = [] }: Props) {
  const filters = [
    { value: "all", label: "Everything" },
    { value: "featured", label: "Featured" },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ];

  return (
    <div className="sticky top-[64px] md:top-[72px] z-40 bg-bg/95 backdrop-blur-sm border-b border-border/70">
      <div className="relative max-w-content mx-auto">
        <div
          role="tablist"
          aria-label="Filter by category"
          className="flex gap-2 px-6 md:px-10 py-3.5 overflow-x-auto no-scrollbar"
        >
          {filters.map(({ value, label }) => {
            const isActive = active === value;
            return (
              <button
                key={value}
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(value)}
                className={[
                  "flex-none rounded-badge font-body text-[13px] font-medium px-[18px] py-2",
                  "transition-all duration-200 cursor-pointer whitespace-nowrap",
                  "active:scale-95",
                  isActive
                    ? "bg-brand text-surface shadow-pill"
                    : "bg-surface text-muted ring-1 ring-border hover:ring-brand/40 hover:text-hap-text",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Right-edge fade hints that the pill row scrolls (mobile only) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-bg to-transparent md:hidden"
        />
      </div>
    </div>
  );
}
