import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Shrey Vats — Systems, Rust & Solana Developer",
    template: "%s | Shrey Vats",
  },
  description:
    "Engineering portfolio of Shrey Vats, focusing on Rust, low-level backend systems, and on-chain protocol development on Solana.",
  keywords: [
    "Shrey Vats",
    "shreyvats01",
    "Rust Developer",
    "Solana Developer",
    "Systems Programming",
    "Backend Engineering",
    "On-chain Programs",
    "Anchor",
    "PostgreSQL",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.socials.github }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: "Shrey Vats — Systems, Rust & Solana Developer",
    description:
      "Exploring Rust, backend systems, and Solana protocol development beneath abstractions.",
    siteName: "Shrey Vats",
    images: [
      {
        url: "https://github.com/shreyvats01.png",
        width: 1200,
        height: 630,
        alt: "Shrey Vats — Rust & Solana Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shrey Vats — Systems, Rust & Solana Developer",
    description:
      "Exploring Rust, backend systems, and Solana protocol development beneath abstractions.",
    creator: "@shreyvats01",
    images: ["https://github.com/shreyvats01.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    image: "https://github.com/shreyvats01.png",
    email: siteConfig.contact.email,
    sameAs: [
      siteConfig.socials.github,
      siteConfig.socials.x,
      siteConfig.socials.linkedin,
    ],
    jobTitle: "Software Developer (Rust & Solana)",
    knowsAbout: [
      "Rust",
      "Solana",
      "Systems Programming",
      "Backend Engineering",
      "On-chain Programs",
      "PostgreSQL",
      "TypeScript",
      "WebSockets",
    ],
    nationality: {
      "@type": "Country",
      "name": "India",
    },
    description:
      "Developer exploring Rust, backend systems, and Solana on-chain programs.",
  };

  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-semibold focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
