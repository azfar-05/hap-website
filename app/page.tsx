import { createClient } from "@/lib/supabase/server";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import type { Product, HeroSlot } from "@/types/database.types";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch hero images and featured products in parallel
  const [{ data: heroData }, { data: featuredData }] = await Promise.all([
    supabase
      .from("hero_images")
      .select("*")
      .order("slot", { ascending: true }),
    supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .order("featured_at", { ascending: false, nullsFirst: false })
      .limit(8),
  ]);

  const heroImages: HeroSlot[] = (heroData ?? []) as HeroSlot[];
  const featuredProducts: Product[] = (featuredData ?? []) as Product[];

  return (
    <>
      <Navigation />

      <main>
        <Hero heroImages={heroImages} />

        {/* Our Picks — featured products */}
        {featuredProducts.length > 0 && (
          <section className="py-section-mobile md:py-section-desktop bg-bg">
            <div className="max-w-content mx-auto">
              <h2 className="font-display text-h2 text-hap-text tracking-[0.03em] mb-8 md:mb-10 px-6 md:px-10">
                Our Picks
              </h2>

              {/* Mobile: horizontally scrollable strip */}
              <div className="md:hidden overflow-x-auto no-scrollbar">
                <div className="flex gap-4 pl-6 pr-6 pb-2">
                  {featuredProducts.map((product) => (
                    <div key={product.id} className="flex-none w-44">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop: 4-column grid */}
              <div className="hidden md:grid grid-cols-4 gap-6 px-6 md:px-10">
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
