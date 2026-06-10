import { createClient } from "@/lib/supabase/server";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CatalogShell from "@/components/CatalogShell";
import type { Product } from "@/types/database.types";

export const metadata = {
  title: "The Collection – HAP",
  description:
    "Browse our full range of tableware, kitchenware, crockery, cutlery, and home decor.",
};

export default async function CatalogPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const products: Product[] = data ?? [];

  return (
    <>
      <Navigation />

      <main className="pt-nav-mobile md:pt-nav-desktop min-h-screen">
        {/* Page header */}
        <div className="max-w-content mx-auto px-6 md:px-10 pt-8 md:pt-14 pb-4 md:pb-8">
          <h1 className="font-display text-h1 text-hap-text tracking-[0.03em]">
            The Collection
          </h1>
          <p className="font-body text-body text-muted mt-2 max-w-[42ch]">
            Tableware and home pieces, curated for everyday beauty.
          </p>
        </div>

        <CatalogShell products={products} hasError={!!error} />
      </main>

      <Footer />
    </>
  );
}
