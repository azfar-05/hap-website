import Link from "next/link";

export default function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp}` : "#";

  return (
    <footer className="bg-hap-text">
      <div className="max-w-content mx-auto px-6 md:px-10 pt-16 pb-10 md:pt-24 md:pb-12">
        {/* Brand statement — the warm line gets the stage */}
        <p className="font-display italic text-[clamp(1.75rem,5.5vw,2.75rem)] leading-[1.3] text-bg/90 max-w-[18ch]">
          Made with care,
          <br />
          for your everyday
        </p>

        <div className="mt-12 md:mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          {/* Brand */}
          <div>
            <p className="font-display text-h1 font-normal tracking-[0.06em] text-bg leading-none">
              HAP
            </p>
            <p className="font-body text-eyebrow font-medium uppercase text-bg/40 mt-3">
              Homes &amp; Plates
            </p>
          </div>

          {/* Links */}
          <nav className="flex gap-8 items-center">
            <Link
              href="https://www.instagram.com/homesandplates?igsh=MWt1YnM5YW9nd2VkdA=="
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-body text-small font-medium tracking-[0.1em] uppercase text-bg/60 hover:text-bg transition-colors duration-200"
            >
              Instagram
            </Link>
            <Link
              href="https://chat.whatsapp.com/LyP7SwZCdzkJYvh2ljUUmJ?s=cl&p=i&ilr=4"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-body text-small font-medium tracking-[0.1em] uppercase text-bg/60 hover:text-bg transition-colors duration-200"
            >
              WhatsApp
            </Link>
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-body text-small font-medium tracking-[0.1em] uppercase text-bg/60 hover:text-bg transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>
        </div>

        <div className="mt-12 pt-6 border-t border-bg/10">
          <p className="font-body text-[13px] font-light text-bg/30">
            © {new Date().getFullYear()} Homes and Plates. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
