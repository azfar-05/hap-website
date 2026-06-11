"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 8);
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-nav-mobile md:h-nav-desktop flex items-center transition-all duration-300 ${
        scrolled
          ? "bg-surface/95 backdrop-blur-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="w-full max-w-content mx-auto px-6 md:px-10 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-2xl md:text-3xl font-normal tracking-[0.08em] text-hap-text leading-none hover:opacity-70 transition-opacity duration-200"
        >
          HAP
        </Link>

        <Link
          href="/catalog"
          className="link-underline font-body text-[13px] font-medium tracking-[0.18em] uppercase text-muted hover:text-hap-text transition-colors duration-200"
        >
          Catalog
        </Link>
      </div>
    </nav>
  );
}
