import { createClient } from "@/lib/supabase/server";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CatalogShell from "@/components/CatalogShell";
import type { Product, CategoryRow } from "@/types/database.types";

export const metadata = {
  title: "The Collection – HAP",
  description:
    "Browse our full range of tableware, kitchenware, crockery, cutlery, and home decor.",
};

export default async function CatalogPage() {
  const supabase = await createClient();

  const [{ data, error }, { data: categoriesData }] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("display_order", { ascending: true }),
  ]);

  const products: Product[] = data ?? [];
  const categories: CategoryRow[] = (categoriesData ?? []) as CategoryRow[];

  return (
    <>
      <Navigation />

      <main className="pt-nav-mobile md:pt-nav-desktop min-h-screen bg-bg">
        {/* Page header — sits on surface for contrast */}
        <div className="bg-surface border-b border-border/60">
          <div className="max-w-content mx-auto px-6 md:px-10 pt-10 pb-10 md:pt-16 md:pb-14">
            <p className="flex items-center gap-3 mb-4">
              <span aria-hidden="true" className="h-px w-8 bg-brand/60" />
              <span className="font-body text-eyebrow font-medium uppercase text-brand">
                Catalog
              </span>
            </p>
            <h1 className="font-display text-h1 text-hap-text tracking-[0.02em]">
              The Collection
            </h1>
            <p className="font-body text-body font-light text-muted mt-3 max-w-[42ch] leading-relaxed">
              Tableware and home pieces, curated for everyday beauty.
            </p>
          </div>
        </div>

        <CatalogShell products={products} categories={categories} hasError={!!error} />
      </main>

      <Footer />
    </>
  );
}
