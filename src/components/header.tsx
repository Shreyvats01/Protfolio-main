"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { CommandPalette } from "@/components/command-palette";
import { siteConfig } from "@/lib/site-config";

const NAV_ITEMS = [
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Systems", href: "#systems" },
  { label: "Activity", href: "#activity" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[#0B0D0F]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single-element Brand Wordmark */}
        <Link
          href="#"
          className="font-mono text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm whitespace-nowrap shrink-0"
        >
          {siteConfig.monogram} — {siteConfig.name}
        </Link>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm text-muted-foreground"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm whitespace-nowrap shrink-0"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action & Mobile Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:block">
            <CommandPalette />
          </div>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-3.5 py-1.5 font-mono text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0"
          >
            Get in Touch
          </a>
          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary text-foreground transition-colors hover:border-[#36404B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation-drawer"
          aria-label="Mobile navigation"
          className="md:hidden border-t border-border bg-[#0B0D0F] px-6 py-4 space-y-3"
        >
          <div className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="font-mono text-xs text-[#788391]">
              Quick jump &amp; actions
            </span>
            <CommandPalette />
          </div>
        </nav>
      )}
    </header>
  );
}
