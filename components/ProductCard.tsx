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
        "group block",
        "hover:-translate-y-1 transition-transform duration-200",
        !product.in_stock ? "opacity-70" : "",
        isLead ? "col-span-2 md:col-span-2" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Image — the card itself */}
      <div
        className={[
          "relative overflow-hidden rounded-image bg-border",
          "shadow-card-rest group-hover:shadow-card-hover transition-shadow duration-200",
          isLead ? "aspect-[4/3]" : "aspect-[3/4]",
        ].join(" ")}
      >
        <FadingImage
          src={product.images[0]}
          alt={product.name}
          fill
          sizes={
            isLead
              ? "(min-width: 768px) 50vw, 100vw"
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

      {/* Text below the image, on page background */}
      <div className="px-1 pt-2 pb-4">
        <h3
          className={[
            "font-display text-hap-text leading-snug",
            isLead ? "text-h2" : "text-h3",
          ].join(" ")}
        >
          {product.name}
        </h3>
        <p className="font-body text-price text-brand font-semibold mt-1">
          {price}
        </p>
        <span className="inline-block font-body text-small text-muted font-medium rounded-badge border border-border px-3 py-0.5 mt-1.5">
          {label}
        </span>
      </div>
    </Link>
  );
}
