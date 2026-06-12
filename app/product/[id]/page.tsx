import { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/ImageGallery";
import ProductCard from "@/components/ProductCard";
import WhatsAppCTA, { WhatsAppIcon } from "@/components/WhatsAppCTA";
import Price from "@/components/ui/Price";
import type { Metadata } from "next";
import type { Product } from "@/types/database.types";

function slugToLabel(slug: string): string {
  return slug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

interface Props {
  params: Promise<{ id: string }>;
}

// Deduped across generateMetadata and the page render
const getProduct = cache(async (id: string): Promise<Product | null> => {
  const supabase = await createClient();
  const response = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  return response.data as Product | null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) return { title: "Product – HAP" };

  return {
    title: `${product.name} – HAP`,
    description: product.description ?? undefined,
    openGraph: product.images[0]
      ? { images: [{ url: product.images[0] }] }
      : undefined,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const supabase = await createClient();
  const { data: relatedData } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .order("created_at", { ascending: false })
    .limit(3);
  const relatedProducts: Product[] = (relatedData as Product[] | null) ?? [];

  const label = slugToLabel(product.category);

  const details: { term: string; value: string }[] = [
    product.color ? { term: "Colour", value: product.color } : null,
    product.size ? { term: "Size", value: product.size } : null,
    product.material ? { term: "Material", value: product.material } : null,
  ].filter((d): d is { term: string; value: string } => d !== null);

  return (
    <>
      <Navigation />

      <main className="pt-nav-mobile md:pt-nav-desktop min-h-screen">
        <div className="max-w-content mx-auto px-6 md:px-10 py-8 md:py-14">
          {/* Back to catalog */}
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 font-body text-small text-muted hover:text-accent transition-colors duration-200 mb-8 md:mb-12"
          >
            <span aria-hidden="true">←</span>
            <span className="link-underline">Keep browsing</span>
          </Link>

          {/* Two-column layout on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 lg:gap-20">
            {/* Left: image gallery */}
            <ImageGallery images={product.images} productName={product.name} />

            {/* Right: product details, sticky on desktop */}
            <div className="md:sticky md:top-[calc(72px+2rem)] md:self-start">
              {/* Category eyebrow + availability */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                <span className="font-body text-eyebrow font-medium uppercase text-muted">
                  {label}
                </span>
                {!product.in_stock && (
                  <span className="font-body text-[10px] font-medium tracking-[0.18em] uppercase text-muted bg-surface ring-1 ring-border px-3 py-1 rounded-badge">
                    Currently Unavailable
                  </span>
                )}
              </div>

              {/* Product name */}
              <h1 className="font-display text-h1 text-hap-text tracking-[0.02em] leading-tight mb-5">
                {product.name}
              </h1>

              {/* Price */}
              <p className="font-body text-[1.35rem] text-brand font-semibold">
                <Price value={product.price} />
              </p>

              <div aria-hidden="true" className="w-10 h-px bg-border my-7" />

              {/* Description */}
              {product.description && (
                <p className="font-body text-body font-light text-muted leading-relaxed mb-8 whitespace-pre-line max-w-[52ch]">
                  {product.description}
                </p>
              )}

              {/* Details — quiet spec rows, only for values that exist */}
              {details.length > 0 && (
                <dl className="border-t border-border divide-y divide-border mb-10">
                  {details.map(({ term, value }) => (
                    <div key={term} className="flex items-baseline gap-6 py-3">
                      <dt className="w-24 flex-none font-body text-[10px] font-medium tracking-[0.2em] uppercase text-muted/80">
                        {term}
                      </dt>
                      <dd className="font-body text-small text-hap-text">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {/* WhatsApp CTA */}
              {product.in_stock ? (
                <>
                  <WhatsAppCTA productName={product.name} />
                  <p className="font-body text-[13px] font-light text-muted/80 text-center mt-3.5">
                    Opens WhatsApp with your message ready to send
                  </p>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2.5 w-full font-body text-body font-semibold text-muted bg-border/60 ring-1 ring-border py-4 px-6 rounded-btn cursor-not-allowed select-none">
                  <WhatsAppIcon className="opacity-40" />
                  Currently Unavailable
                </div>
              )}
            </div>
          </div>

          {/* More from this category */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 md:mt-24 pt-12 md:pt-16 border-t border-border">
              <p className="flex items-center gap-3 mb-3">
                <span aria-hidden="true" className="h-px w-8 bg-brand/60" />
                <span className="font-body text-eyebrow font-medium uppercase text-brand">
                  Keep exploring
                </span>
              </p>
              <h2 className="font-display text-h2 text-hap-text tracking-[0.02em] mb-8 md:mb-10">
                More {slugToLabel(product.category)}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 md:gap-x-6 md:gap-y-4">
                {relatedProducts.map((related) => (
                  <ProductCard key={related.id} product={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
