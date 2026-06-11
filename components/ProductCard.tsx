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
}

export default function ProductCard({ product }: Props) {
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
        !product.in_stock ? "opacity-70" : "",
        "hover:-translate-y-1 transition-transform duration-200",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Square image container — full image always visible, no crop */}
      <div
        className={[
          "relative aspect-square overflow-hidden rounded-image bg-surface w-full",
          "shadow-card-rest group-hover:shadow-card-hover transition-shadow duration-200",
        ].join(" ")}
      >
        <FadingImage
          src={product.images[0]}
          alt={product.name}
          width={600}
          height={600}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="w-full h-full object-contain"
        />
        {!product.in_stock && (
          <div className="absolute inset-0 bg-hap-text/50 flex items-center justify-center">
            <span className="font-body text-small font-medium tracking-[0.08em] uppercase text-surface bg-hap-text/60 px-3 py-1 rounded-badge">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Text below the image */}
      <div className="px-1 pt-2 pb-4">
        <h3 className="font-display text-h3 text-hap-text leading-snug">
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
