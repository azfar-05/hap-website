import { createClient } from "@/lib/supabase/server";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/database.types";

export default async function HomePage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(8);

  const featuredProducts: Product[] = data ?? [];

  return (
    <>
      <Navigation />

      <main>
        <Hero featuredProducts={featuredProducts} />

        {featuredProducts.length > 0 && (
          <section className="py-section-mobile md:py-section-desktop bg-bg">
            <div className="max-w-content mx-auto px-6 md:px-10">
              <h2 className="font-display text-h2 text-hap-text tracking-[0.03em] mb-10 md:mb-14">
                Featured Pieces
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
