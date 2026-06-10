import Link from "next/link";
import type { Product } from "@/types/database.types";
import FadingImage from "@/components/ui/FadingImage";

const CATEGORY_LABELS: Record<string, string> = {
  tableware: "Tableware",
  kitchenware: "Kitchenware",
  crockery: "Crockery",
  cutlery: "Cutlery",
  home_decor: "Home Decor",
};

interface Props {
  product: Product;
  /** On mobile: spans full grid width (col-span-2) with 4:3 image.
   *  On desktop: reverts to standard 1-column 3:4 card. */
  isLead?: boolean;
}

export default function ProductCard({ product, isLead = false }: Props) {
  const label = CATEGORY_LABELS[product.category] ?? product.category;
  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <Link
      href={`/product/${product.id}`}
      className={[
        "group block bg-surface rounded-card shadow-card-rest",
        "hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 overflow-hidden",
        !product.in_stock ? "opacity-70" : "",
        isLead ? "col-span-2 md:col-span-1" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Image */}
      <div
        className={[
          "relative overflow-hidden rounded-t-card bg-border",
          isLead ? "aspect-[4/3] md:aspect-[3/4]" : "aspect-[3/4]",
        ].join(" ")}
      >
        <FadingImage
          src={product.images[0]}
          alt={product.name}
          fill
          sizes={
            isLead
              ? "(min-width: 768px) 25vw, 100vw"
              : "(min-width: 768px) 25vw, 50vw"
          }
          className="object-cover"
        />
        {!product.in_stock && (
          <div className="absolute inset-0 bg-hap-text/50 flex items-center justify-center">
            <span className="font-body text-small font-medium tracking-[0.08em] uppercase text-surface bg-hap-text/60 px-3 py-1 rounded-badge">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <span className="inline-block font-body text-small text-muted font-medium rounded-badge border border-border px-3 py-0.5 mb-3">
          {label}
        </span>
        <h3 className="font-display text-h3 text-hap-text leading-snug mb-2">
          {product.name}
        </h3>
        <p className="font-body text-price text-brand font-semibold">
          {price}
        </p>
      </div>
    </Link>
  );
}
