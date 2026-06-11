"use client";

import { useState } from "react";
import FadingImage from "@/components/ui/FadingImage";

interface Props {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      {/* Main image — square, full image always visible */}
      <div className="aspect-square rounded-image overflow-hidden bg-surface w-full ring-1 ring-border/70 shadow-card-rest">
        {images[activeIndex] && (
          <FadingImage
            key={images[activeIndex]}
            src={images[activeIndex]}
            alt={productName}
            width={800}
            height={800}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="w-full h-full object-contain"
            priority
          />
        )}
      </div>

      {/* Thumbnails — only when multiple images exist */}
      {images.length > 1 && (
        <div className="flex gap-2.5 mt-4 overflow-x-auto no-scrollbar pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === activeIndex}
              className={[
                "relative w-16 h-16 flex-shrink-0 rounded-[10px] overflow-hidden bg-surface",
                "transition-all duration-200 active:scale-95",
                i === activeIndex
                  ? "ring-2 ring-brand"
                  : "ring-1 ring-border opacity-70 hover:opacity-100 hover:ring-accent/60",
              ].join(" ")}
            >
              <FadingImage
                src={img}
                alt={`${productName} — view ${i + 1}`}
                width={64}
                height={64}
                sizes="64px"
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
