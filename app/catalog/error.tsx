"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CatalogError({ reset }: Props) {
  return (
    <>
      <Navigation />

      <main className="pt-nav-mobile md:pt-nav-desktop min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-section-mobile md:py-section-desktop text-center">
          <div className="w-12 h-px bg-border mb-8" />

          <p className="font-display text-h1 text-hap-text tracking-[0.03em] mb-4">
            Something went wrong
          </p>
          <p className="font-body text-body text-muted max-w-[36ch] mb-10 leading-relaxed">
            We had trouble loading the collection. Please try again.
          </p>

          <button
            onClick={reset}
            className="inline-flex items-center justify-center bg-brand text-surface font-body text-small font-semibold tracking-[0.12em] uppercase py-3 px-7 rounded-btn hover:bg-accent transition-colors duration-200"
          >
            Try again
          </button>
        </div>

        <Footer />
      </main>
    </>
  );
}
