"use client";

import { useState } from "react";
import type { Product, Category } from "@/types/database.types";
import FilterBar, { type FilterValue } from "@/components/FilterBar";
import ProductCard from "@/components/ProductCard";

const CATEGORY_NAMES: Record<Category, string> = {
  tableware: "tableware",
  kitchenware: "kitchenware",
  crockery: "crockery",
  cutlery: "cutlery",
  home_decor: "home decor",
};

interface Props {
  products: Product[];
  hasError?: boolean;
}

export default function CatalogShell({ products, hasError = false }: Props) {
  const [activeCategory, setActiveCategory] = useState<FilterValue>("all");

  if (hasError) {
    return (
      <EmptyState
        message="We couldn't load the collection right now."
        sub="Please try refreshing the page."
      />
    );
  }

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Editorial header: thin rule + right-aligned piece count — stays on surface with the catalog header */}
      <div className="bg-surface border-t border-border">
        <div className="max-w-content mx-auto px-6 md:px-10 py-2 flex items-center justify-end">
          <span className="font-display text-small italic text-muted whitespace-nowrap">
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
          </span>
        </div>
      </div>

      <FilterBar active={activeCategory} onChange={setActiveCategory} />

      <div className="max-w-content mx-auto px-6 md:px-10 pb-section-mobile md:pb-section-desktop">
        {filtered.length === 0 ? (
          <EmptyState
            message={
              activeCategory === "all"
                ? "The collection is being curated."
                : `No ${CATEGORY_NAMES[activeCategory as Category]} pieces yet.`
            }
            sub={
              activeCategory === "all"
                ? "Our catalog is being prepared — come back soon to explore the full collection."
                : `We haven't added any ${CATEGORY_NAMES[activeCategory as Category]} to the collection just yet. Check back soon, or browse everything we have.`
            }
            action={
              activeCategory !== "all"
                ? { label: "View all pieces", onClick: () => setActiveCategory("all") }
                : undefined
            }
          />
        ) : (
          /*
            Mobile: 2-col grid. Lead card (index 0) spans full width (col-span-2)
            with 4:3 image. Desktop: 4-col grid, lead spans 2 cols, rest are 1 col.
          */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-10">
            {filtered.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isLead={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Empty / error state ─────────────────────────────────────────────────────

interface EmptyStateProps {
  message: string;
  sub: string;
  action?: { label: string; onClick: () => void };
}

function EmptyState({ message, sub, action }: EmptyStateProps) {
  return (
    <div className="max-w-content mx-auto px-6 md:px-10 flex flex-col items-center justify-center py-section-mobile md:py-section-desktop text-center">
      {/* Decorative rule */}
      <div className="w-12 h-px bg-border mb-8" />

      <p className="font-display text-h2 text-hap-text tracking-[0.03em] mb-4">
        {message}
      </p>
      <p className="font-body text-body text-muted max-w-[38ch] mb-8 leading-relaxed">
        {sub}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="font-body text-small font-medium text-accent underline underline-offset-4 decoration-border hover:text-brand hover:decoration-brand transition-colors duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
