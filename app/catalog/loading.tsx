import Navigation from "@/components/Navigation";

function Bone({ className = "" }: { className?: string }) {
  return <div className={`bg-border animate-pulse rounded ${className}`} />;
}

function SkeletonCard({ isLead = false }: { isLead?: boolean }) {
  return (
    <div
      className={[
        "bg-surface rounded-card overflow-hidden shadow-card-rest",
        isLead ? "col-span-2 md:col-span-1" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "bg-border animate-pulse",
          isLead ? "aspect-[4/3] md:aspect-[3/4]" : "aspect-[3/4]",
        ].join(" ")}
      />
      <div className="p-4 space-y-3">
        <Bone className="h-5 w-20 rounded-badge" />
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

      <main className="pt-nav-mobile md:pt-nav-desktop min-h-screen">
        {/* Page header skeleton */}
        <div className="max-w-content mx-auto px-6 md:px-10 pt-8 md:pt-14 pb-4 md:pb-8 space-y-3">
          <Bone className="h-10 md:h-12 w-48" />
          <Bone className="h-5 w-72" />
        </div>

        {/* Filter bar skeleton */}
        <div className="border-b border-border">
          <div className="max-w-content mx-auto flex gap-2 px-6 md:px-10 py-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Bone key={i} className="flex-none h-9 w-24 rounded-badge" />
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="max-w-content mx-auto px-6 md:px-10 pb-section-mobile md:pb-section-desktop">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-10">
            <SkeletonCard isLead />
            {Array.from({ length: 7 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
