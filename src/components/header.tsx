"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { CommandPalette } from "@/components/command-palette";
import { siteConfig } from "@/lib/site-config";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
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

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[#0B0D0F]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Personal Wordmark */}
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm whitespace-nowrap shrink-0"
        >
          {siteConfig.monogram} · {siteConfig.name}
        </Link>

        {/* Zone 2: Primary Route Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`transition-colors whitespace-nowrap shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  active
                    ? "text-foreground font-medium underline decoration-primary decoration-2 underline-offset-8"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Restrained Command Palette Trigger & Mobile Menu Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <CommandPalette />

          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-[#36404B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
          className="md:hidden border-t border-border bg-[#0B0D0F] px-6 py-4"
        >
          <div className="flex flex-col space-y-1">
            {[...NAV_ITEMS, { label: "Activity", href: "/activity" }].map(
              (item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      active
                        ? "bg-secondary text-primary font-medium"
                        : "text-muted-foreground hover:bg-card hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
