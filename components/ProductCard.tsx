import Link from "next/link";
import type { Product } from "@/types/database.types";
import FadingImage from "@/components/ui/FadingImage";
import Price from "@/components/ui/Price";
import { slugToLabel } from "@/lib/category";

interface Props {
  product: Product;
  /** Set on above-the-fold cards so the LCP image loads eagerly. */
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: Props) {
  const label = slugToLabel(product.category);

  return (
    <Link
      href={`/product/${product.id}`}
      className={[
        "group block select-none",
        "active:scale-[0.985] transition-transform duration-200",
        !product.in_stock ? "opacity-70" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Square image tile — full image always visible, no crop.
          The tile (not the text) lifts on hover so the type stays settled. */}
      <div
        className={[
          "relative aspect-square overflow-hidden rounded-image bg-surface w-full",
          "ring-1 ring-border/70 shadow-card-rest",
          "group-hover:shadow-card-hover group-hover:-translate-y-1",
          "transition-all duration-300 ease-out",
        ].join(" ")}
      >
        {product.images[0] && (
          <FadingImage
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={600}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            priority={priority}
          />
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-surface/50 flex items-end justify-center pb-3">
            <span className="font-body text-[10px] font-medium tracking-[0.18em] uppercase text-muted bg-surface/95 ring-1 ring-border px-3 py-1.5 rounded-badge">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Editorial text block: category eyebrow → name → price */}
      <div className="px-0.5 pt-3 pb-5">
        <p className="font-body text-[10px] font-medium tracking-[0.2em] uppercase text-muted/80">
          {label}
        </p>
        <h3 className="font-display text-h3 text-hap-text leading-snug mt-1">
          {product.name}
        </h3>
        <p className="font-body text-[0.95rem] text-brand font-semibold mt-1.5">
          <Price value={product.price} />
        </p>
      </div>
    </Link>
  );
}
