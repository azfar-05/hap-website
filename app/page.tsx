import Link from "next/link";
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
          <section className="py-section-mobile md:py-section-desktop bg-surface">
            <div className="max-w-content mx-auto">
              {/* Section header */}
              <div className="px-6 md:px-10 mb-7 md:mb-12 flex items-end justify-between gap-6">
                <div>
                  <p className="flex items-center gap-3 mb-3">
                    <span aria-hidden="true" className="h-px w-8 bg-brand/60" />
                    <span className="font-body text-eyebrow font-medium uppercase text-brand">
                      From the collection
                    </span>
                  </p>
                  <h2 className="font-display text-h2 text-hap-text tracking-[0.02em]">
                    Our Picks
                  </h2>
                </div>
                <Link
                  href="/catalog"
                  className="hidden md:inline-flex items-center gap-1.5 font-body text-small font-medium text-muted hover:text-accent transition-colors duration-200 pb-1"
                >
                  <span className="link-underline">Browse everything</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              {/* Mobile: horizontally scrollable strip with snap */}
              <div className="md:hidden relative">
                <div className="overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-pl-6">
                  <div className="flex gap-4 pl-6 pr-6 pb-2">
                    {featuredProducts.map((product) => (
                      <div key={product.id} className="flex-none w-48 snap-start">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Edge fade hints there's more to scroll */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-surface to-transparent"
                />
              </div>

              {/* Desktop: 4-column grid */}
              <div className="hidden md:grid grid-cols-4 gap-x-6 gap-y-4 px-6 md:px-10">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Mobile: browse link below the strip */}
              <div className="px-6 mt-7 md:hidden">
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-1.5 font-body text-small font-medium text-muted hover:text-accent transition-colors duration-200"
                >
                  <span className="link-underline">Browse everything</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
