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
    <section className="relative min-h-[100svh] md:min-h-0 md:h-hero-desktop bg-bg flex flex-col md:flex-row overflow-hidden">
      {/* Warm ambient glow behind the collage — gives the cream depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-[22rem] h-[22rem] md:w-[34rem] md:h-[34rem] rounded-full bg-accent/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none hidden md:block absolute -bottom-32 left-1/3 w-[26rem] h-[26rem] rounded-full bg-brand/10 blur-3xl"
      />

      {/* ─── Text column ─── */}
      <div className="relative flex-1 flex flex-col justify-center pt-[calc(64px+2rem)] md:pt-0 px-6 md:pl-20 lg:pl-28 pb-12 md:pb-0 md:w-[55%] md:flex-none">
        <p className="flex items-center gap-3 mb-6 md:mb-7">
          <span aria-hidden="true" className="h-px w-10 bg-brand/60" />
          <span className="font-body text-eyebrow font-medium uppercase text-brand">
            Homes &amp; Plates
          </span>
        </p>

        <h1 className="font-display text-[clamp(3rem,11.5vw,3.9rem)] md:text-display text-hap-text leading-[1.05] tracking-[0.01em] mb-7">
          Beautiful things
          <br />
          for <em className="italic text-brand">everyday</em> living.
        </h1>

        <p className="font-body text-body font-light text-muted max-w-[36ch] mb-10 md:mb-12 leading-relaxed">
          Curated tableware and home pieces — chosen for the way they feel in
          use. Warm, unhurried, and worth coming home to.
        </p>

        <Link
          href="/catalog"
          className="group self-start inline-flex items-center gap-2.5 bg-brand text-surface font-body text-small font-semibold tracking-[0.14em] uppercase py-4 px-8 rounded-btn shadow-btn hover:bg-accent active:scale-[0.98] transition-all duration-200"
        >
          Explore the catalog
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>

      {/* ─── Image column ─── */}
      <div className="flex-none md:flex-1 relative">
        {/* Mobile: asymmetric stacked collage */}
        <div className="md:hidden pb-14">
          {collageItems.length > 0 ? (
            <MobileCollage items={collageItems} />
          ) : (
            <MobileCollagePlaceholder />
          )}
        </div>

        {/* Desktop: asymmetric collage — top-nav-desktop pushes it below fixed nav */}
        <div className="hidden md:block absolute inset-0 md:top-nav-desktop">
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

/* Shared "mounted print" frame — a thick surface border reads like a matted
   photograph and is the cheapest, most reliable premium signal we have. */
const printFrame =
  "border-[6px] border-surface rounded-2xl overflow-hidden bg-surface";

// ─── Mobile: stacked overlapping collage ─────────────────────────────────────

function MobileCollage({ items }: { items: HeroSlot[] }) {
  return (
    <div className="relative overflow-visible mx-5 mt-6">
      {items[0] && (
        <div className={`relative w-full aspect-[4/3] rotate-1 shadow-print ${printFrame}`}>
          <FadingImage
            src={items[0].image_url}
            alt={`Hero image ${items[0].slot}`}
            fill
            sizes="90vw"
            className="object-cover"
            priority
          />
        </div>
      )}
      {items[1] && (
        <div className={`relative w-[72%] ml-auto aspect-[3/4] -rotate-2 -mt-10 shadow-card-hover ${printFrame}`}>
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
        <div className={`relative w-[62%] aspect-[4/3] rotate-2 -mt-8 shadow-card-hover ${printFrame}`}>
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
    <div className="relative overflow-visible mx-5 mt-6">
      <div className={`relative w-full aspect-[4/3] rotate-1 shadow-print bg-gradient-to-br from-[#E8D5C4] to-[#C4967A] ${printFrame}`} />
      <div className={`relative w-[72%] ml-auto aspect-[3/4] -rotate-2 -mt-10 shadow-card-hover bg-gradient-to-br from-[#E8D5C4] to-[#C4967A] ${printFrame}`} />
      <div className={`relative w-[62%] aspect-[4/3] rotate-2 -mt-8 shadow-card-hover bg-gradient-to-br from-[#E8D5C4] to-[#C4967A] ${printFrame}`} />
    </div>
  );
}

// ─── Desktop: asymmetric collage of up to 3 images ───────────────────────────

function Collage({ items }: { items: HeroSlot[] }) {
  return (
    <div className="relative w-full h-full">
      {/* Primary — large, left of column, tall portrait */}
      {items[0] && (
        <div className={`absolute top-[8%] left-[4%] w-[52%] aspect-[3/4] -rotate-1 shadow-print z-20 ${printFrame}`}>
          <FadingImage
            src={items[0].image_url}
            alt={`Hero image ${items[0].slot}`}
            fill
            sizes="(min-width: 768px) 24vw, 52vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Secondary — top-right, clearly separate from primary */}
      {items[1] && (
        <div className={`absolute top-[4%] right-[4%] w-[40%] aspect-[3/4] rotate-2 shadow-card-hover z-10 ${printFrame}`}>
          <FadingImage
            src={items[1].image_url}
            alt={`Hero image ${items[1].slot}`}
            fill
            sizes="(min-width: 768px) 18vw, 40vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Accent — bottom-center, overlaps both, in front */}
      {items[2] && (
        <div className={`absolute bottom-[5%] left-[28%] w-[44%] aspect-[3/4] -rotate-2 shadow-print z-30 ${printFrame}`}>
          <FadingImage
            src={items[2].image_url}
            alt={`Hero image ${items[2].slot}`}
            fill
            sizes="(min-width: 768px) 20vw, 44vw"
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
      <div className={`absolute top-[8%] left-[4%] w-[52%] aspect-[3/4] -rotate-1 bg-border z-20 ${printFrame}`} />
      <div className={`absolute top-[4%] right-[4%] w-[40%] aspect-[3/4] rotate-2 bg-border z-10 ${printFrame}`} />
      <div className={`absolute bottom-[5%] left-[28%] w-[44%] aspect-[3/4] -rotate-2 bg-border z-30 ${printFrame}`} />
    </div>
  );
}
