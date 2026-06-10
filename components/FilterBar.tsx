"use client";

import type { Category } from "@/types/database.types";

export type FilterValue = "all" | Category;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "tableware", label: "Tableware" },
  { value: "kitchenware", label: "Kitchenware" },
  { value: "crockery", label: "Crockery" },
  { value: "cutlery", label: "Cutlery" },
  { value: "home_decor", label: "Home Decor" },
];

interface Props {
  active: FilterValue;
  onChange: (value: FilterValue) => void;
}

export default function FilterBar({ active, onChange }: Props) {
  return (
    /* Outer div owns the scroll; inner div is content-width centered so
       pills align with the page grid on wide screens. */
    <div className="overflow-x-auto no-scrollbar border-b border-border">
      <div
        role="tablist"
        aria-label="Filter by category"
        className="max-w-content mx-auto flex gap-2 px-6 md:px-10 py-4"
      >
        {FILTERS.map(({ value, label }) => {
          const isActive = active === value;
          return (
            <button
              key={value}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(value)}
              className={[
                "flex-none rounded-badge font-body text-small font-medium px-5 py-2",
                "transition-colors duration-200 cursor-pointer whitespace-nowrap",
                isActive
                  ? "bg-brand text-surface"
                  : "bg-surface text-muted border border-border hover:border-brand hover:text-hap-text",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
