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

  const filtered: Product[] =
    activeCategory === "all"
      ? products
      : activeCategory === "featured"
      ? products.filter((p) => p.featured)
      : products.filter((p) => p.category === activeCategory);

  function emptyMessage(): string {
    if (activeCategory === "all") return "The collection is being curated.";
    if (activeCategory === "featured") return "No featured pieces yet.";
    return `No ${CATEGORY_NAMES[activeCategory as Category]} pieces yet.`;
  }

  function emptySub(): string {
    if (activeCategory === "all")
      return "Our catalog is being prepared — come back soon to explore the full collection.";
    if (activeCategory === "featured")
      return "Check back soon — featured pieces will appear here when the collection is curated.";
    return `We haven't added any ${CATEGORY_NAMES[activeCategory as Category]} to the collection just yet. Check back soon, or browse everything we have.`;
  }

  return (
    <>
      {/* Editorial header: right-aligned piece count */}
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
            message={emptyMessage()}
            sub={emptySub()}
            action={
              activeCategory !== "all"
                ? { label: "View all pieces", onClick: () => setActiveCategory("all") }
                : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-10">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
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
