import Navigation from "@/components/Navigation";

function Bone({ className = "" }: { className?: string }) {
  return <div className={`bg-border animate-pulse rounded ${className}`} />;
}

function SkeletonCard() {
  return (
    <div>
      {/* Mirrors ProductCard: square tile, then eyebrow / name / price below */}
      <div className="aspect-square rounded-image bg-border animate-pulse" />
      <div className="px-0.5 pt-3 pb-5 space-y-2">
        <Bone className="h-2.5 w-16" />
        <Bone className="h-5 w-3/4" />
        <Bone className="h-4 w-1/3" />
      </div>
    </div>
  );
}

export default function CatalogLoading() {
  return (
    <>
      <Navigation />

      <main className="pt-nav-mobile md:pt-nav-desktop min-h-screen bg-bg">
        {/* Page header skeleton — matches the surface header band */}
        <div className="bg-surface border-b border-border/60">
          <div className="max-w-content mx-auto px-6 md:px-10 pt-10 pb-10 md:pt-16 md:pb-14 space-y-4">
            <Bone className="h-3 w-24" />
            <Bone className="h-10 md:h-12 w-48" />
            <Bone className="h-5 w-72 max-w-full" />
          </div>
        </div>

        {/* Filter bar skeleton */}
        <div className="border-b border-border/70 overflow-hidden">
          <div className="max-w-content mx-auto flex gap-2 px-6 md:px-10 py-3.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <Bone key={i} className="flex-none h-9 w-24 rounded-badge" />
            ))}
          </div>
        </div>

        {/* Grid skeleton — same columns as the real product grid */}
        <div className="max-w-content mx-auto px-6 md:px-10 pb-section-mobile md:pb-section-desktop">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 md:gap-x-6 md:gap-y-4 mt-8 md:mt-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
