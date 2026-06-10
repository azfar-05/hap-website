import Link from "next/link";

export default function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp}` : "#";

  return (
    <footer className="bg-hap-text border-t-2 border-brand/30">
      <div className="max-w-content mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          {/* Brand */}
          <div>
            <p className="font-display text-h1 font-normal tracking-[0.05em] text-bg leading-none mb-3">
              HAP
            </p>
            <p className="font-body text-small text-bg/60 max-w-[28ch]">
              Beautiful homes, beautiful tables.
            </p>
          </div>

          {/* Links */}
          <nav className="flex gap-8 items-center">
            <Link
              href="https://www.instagram.com/homesandplates?igsh=MWt1YnM5YW9nd2VkdA=="
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-small font-medium tracking-[0.1em] uppercase text-bg/60 hover:text-bg transition-colors duration-200"
            >
              Instagram
            </Link>
            <Link
              href="https://chat.whatsapp.com/LyP7SwZCdzkJYvh2ljUUmJ?s=cl&p=i&ilr=4"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-small font-medium tracking-[0.1em] uppercase text-bg/60 hover:text-bg transition-colors duration-200"
            >
              Whatsapp
            </Link>
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-small font-medium tracking-[0.1em] uppercase text-bg/60 hover:text-bg transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-bg/10">
          <p className="font-body text-small text-bg/30">
            © {new Date().getFullYear()} Homes and Plates. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
