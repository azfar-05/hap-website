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
      {/* Main image */}
      <div className="relative aspect-square rounded-image overflow-hidden bg-border">
        <FadingImage
          key={images[activeIndex]}
          src={images[activeIndex]}
          alt={productName}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails — only when multiple images exist */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-0.5">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={[
                "relative w-16 h-16 flex-shrink-0 rounded-btn overflow-hidden border-2 transition-colors duration-150",
                i === activeIndex ? "border-brand" : "border-border hover:border-accent",
              ].join(" ")}
            >
              <FadingImage
                src={img}
                alt={`${productName} — view ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
