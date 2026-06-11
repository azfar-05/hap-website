import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navigation />

      <main className="pt-nav-mobile md:pt-nav-desktop min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-section-mobile md:py-section-desktop text-center">
          <div className="w-12 h-px bg-border mb-8" />

          <h1 className="font-display text-h1 text-hap-text tracking-[0.03em] mb-4">
            This page seems to have wandered off
          </h1>
          <p className="font-body text-body text-muted max-w-[38ch] mb-10 leading-relaxed">
            The piece you were looking for isn&apos;t here — but the collection
            is full of things worth finding.
          </p>

          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 font-body text-small text-muted hover:text-accent transition-colors duration-200"
          >
            <span aria-hidden="true">←</span>
            <span className="link-underline">Keep browsing</span>
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
