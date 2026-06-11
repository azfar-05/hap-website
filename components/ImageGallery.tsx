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
      <div className="aspect-square rounded-image overflow-hidden bg-surface w-full">
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
                "relative w-14 h-14 flex-shrink-0 rounded-btn overflow-hidden border-2 bg-surface transition-colors duration-150",
                i === activeIndex ? "border-brand" : "border-border hover:border-accent",
              ].join(" ")}
            >
              <FadingImage
                src={img}
                alt={`${productName} — view ${i + 1}`}
                width={56}
                height={56}
                sizes="56px"
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
