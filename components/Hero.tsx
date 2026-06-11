import Link from "next/link";
import type { HeroSlot } from "@/types/database.types";
import FadingImage from "@/components/ui/FadingImage";

interface Props {
  heroImages: HeroSlot[];
}

export default function Hero({ heroImages }: Props) {
  // Sort by slot ascending and take up to 3
  const collageItems = [...heroImages].sort((a, b) => a.slot - b.slot).slice(0, 3);

  return (
    <section className="min-h-screen md:h-hero-desktop bg-bg flex flex-col md:flex-row overflow-hidden">
      {/* ─── Text column ─── */}
      <div className="flex-1 flex flex-col justify-center pt-nav-mobile md:pt-0 px-6 md:pl-20 lg:pl-28 pb-10 md:pb-0 md:w-[55%] md:flex-none">
        <p className="font-body text-xs tracking-widest uppercase text-brand mb-5">
          homes and plates
        </p>

        <h1 className="font-display text-5xl sm:text-6xl md:text-display text-hap-text leading-[1.1] tracking-tight md:tracking-[0.02em] mb-6">
          Beautiful things
          <br />
          for everyday living.
        </h1>

        <p className="font-body text-body text-muted max-w-[34ch] mb-10 leading-relaxed">
          Curated tableware and home pieces — chosen for the way they feel in
          use. Warm, unhurried, and worth coming home to.
        </p>

        <Link
          href="/catalog"
          className="self-start inline-flex items-center justify-center bg-brand text-surface font-body text-small font-semibold tracking-[0.12em] uppercase py-4 px-8 rounded-btn hover:bg-accent transition-colors duration-200"
        >
          Explore the Catalog
        </Link>
      </div>

      {/* ─── Image column ─── */}
      <div className="flex-none md:flex-1 relative md:overflow-hidden">
        {/* Mobile: asymmetric stacked collage */}
        <div className="md:hidden pb-10">
          {collageItems.length > 0 ? (
            <MobileCollage items={collageItems} />
          ) : (
            <MobileCollagePlaceholder />
          )}
        </div>

        {/* Desktop: asymmetric collage — top-nav-desktop pushes it below fixed nav */}
        <div className="hidden md:block absolute inset-0 md:top-nav-desktop overflow-hidden">
          {collageItems.length > 0 ? (
            <Collage items={collageItems} />
          ) : (
            <CollagePlaceholder />
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Mobile: stacked overlapping collage ─────────────────────────────────────

function MobileCollage({ items }: { items: HeroSlot[] }) {
  return (
    <div className="relative overflow-visible mx-4 mt-8">
      {items[0] && (
        <div className="relative w-full aspect-[4/3] rotate-1 rounded-2xl overflow-hidden shadow-card-hover">
          <FadingImage
            src={items[0].image_url}
            alt={`Hero image ${items[0].slot}`}
            fill
            sizes="90vw"
            className="object-cover"
          />
        </div>
      )}
      {items[1] && (
        <div className="relative w-3/4 ml-auto aspect-[3/4] -rotate-2 -mt-8 rounded-2xl overflow-hidden shadow-card-rest">
          <FadingImage
            src={items[1].image_url}
            alt={`Hero image ${items[1].slot}`}
            fill
            sizes="70vw"
            className="object-cover"
          />
        </div>
      )}
      {items[2] && (
        <div className="relative w-2/3 aspect-[4/3] rotate-1 -mt-6 rounded-2xl overflow-hidden shadow-card-rest">
          <FadingImage
            src={items[2].image_url}
            alt={`Hero image ${items[2].slot}`}
            fill
            sizes="60vw"
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}

function MobileCollagePlaceholder() {
  return (
    <div className="relative overflow-visible mx-4 mt-8">
      <div className="relative w-full aspect-[4/3] rotate-1 rounded-2xl overflow-hidden shadow-card-hover bg-gradient-to-br from-[#E8D5C4] to-[#C4967A]" />
      <div className="relative w-3/4 ml-auto aspect-[3/4] -rotate-2 -mt-8 rounded-2xl overflow-hidden shadow-card-rest bg-gradient-to-br from-[#E8D5C4] to-[#C4967A]" />
      <div className="relative w-2/3 aspect-[4/3] rotate-1 -mt-6 rounded-2xl overflow-hidden shadow-card-rest bg-gradient-to-br from-[#E8D5C4] to-[#C4967A]" />
    </div>
  );
}

// ─── Desktop: asymmetric collage of up to 3 images ───────────────────────────

function Collage({ items }: { items: HeroSlot[] }) {
  return (
    <div className="relative w-full h-full">
      {/* Primary — largest, left-center */}
      {items[0] && (
        <div className="absolute top-[8%] left-[5%] w-[56%] aspect-[3/4] rounded-image overflow-hidden shadow-card-hover z-20">
          <FadingImage
            src={items[0].image_url}
            alt={`Hero image ${items[0].slot}`}
            fill
            sizes="(min-width: 768px) 25vw, 56vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Secondary — bottom-right, slight clockwise tilt */}
      {items[1] && (
        <div className="absolute bottom-[4%] right-[2%] w-[47%] aspect-[3/4] rounded-image overflow-hidden shadow-card-rest rotate-2 z-10">
          <FadingImage
            src={items[1].image_url}
            alt={`Hero image ${items[1].slot}`}
            fill
            sizes="(min-width: 768px) 21vw, 47vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Accent — top-right, slight counter-clockwise tilt, in front */}
      {items[2] && (
        <div className="absolute top-[2%] right-[4%] w-[39%] aspect-[3/4] rounded-image overflow-hidden shadow-card-rest -rotate-2 z-30">
          <FadingImage
            src={items[2].image_url}
            alt={`Hero image ${items[2].slot}`}
            fill
            sizes="(min-width: 768px) 18vw, 39vw"
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}

// ─── Placeholder shapes shown when no hero images are set ────────────────────

function CollagePlaceholder() {
  return (
    <div className="relative w-full h-full">
      <div className="absolute top-[8%] left-[5%] w-[56%] aspect-[3/4] rounded-image bg-border z-20" />
      <div className="absolute bottom-[4%] right-[2%] w-[47%] aspect-[3/4] rounded-image bg-border rotate-2 z-10" />
      <div className="absolute top-[2%] right-[4%] w-[39%] aspect-[3/4] rounded-image bg-border -rotate-2 z-30" />
    </div>
  );
}
