import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HAP – Homes And Plates",
  description:
    "A curated collection of tableware and home decor. Beautiful pieces for everyday living.",
  openGraph: {
    title: "HAP – Homes And Plates",
    description:
      "A curated collection of tableware and home decor. Beautiful pieces for everyday living.",
    type: "website",
  },
};

export const viewport: Viewport = {
  // Blends the browser chrome into the cream background on mobile
  themeColor: "#F5EFE6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-body text-hap-text bg-bg antialiased">{children}</body>
    </html>
  );
}
