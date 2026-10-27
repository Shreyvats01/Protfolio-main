import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
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
    default: "Shrey Vats — Rust, Backend & Solana Developer",
    template: "%s | Shrey Vats",
  },
  description:
    "Portfolio of Shrey Vats. Building software with Rust, TypeScript, PostgreSQL, and tools from the Solana ecosystem.",
  keywords: [
    "Shrey Vats",
    "shreyvats01",
    "Rust Developer",
    "Solana Developer",
    "Backend Developer",
    "TypeScript",
    "PostgreSQL",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.socials.github }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: "Shrey Vats — Rust, Backend & Solana Developer",
    description:
      "Building software with Rust, TypeScript, and tools from the Solana ecosystem.",
    siteName: "Shrey Vats",
    images: [
      {
        url: "https://github.com/shreyvats01.png",
        width: 1200,
        height: 630,
        alt: "Shrey Vats",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shrey Vats — Rust, Backend & Solana Developer",
    description:
      "Building software with Rust, TypeScript, and tools from the Solana ecosystem.",
    creator: "@shreyvats01",
    images: ["https://github.com/shreyvats01.png"],
  },
  robots: {
    index: true,
    follow: true,
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
    jobTitle: "Software Developer",
    knowsAbout: [
      "Rust",
      "Solana",
      "Backend Development",
      "PostgreSQL",
      "TypeScript",
      "WebSockets",
    ],
    nationality: {
      "@type": "Country",
      name: "India",
    },
    description: siteConfig.heroIntro,
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
        <Header />
        <main
          id="main-content"
          className="flex-1 mx-auto w-full max-w-4xl px-6 py-14 md:py-20"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
