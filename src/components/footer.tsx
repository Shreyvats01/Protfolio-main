import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#0B0D0F]">
      <div className="mx-auto flex max-w-4xl flex-col sm:flex-row items-start sm:items-center justify-between gap-5 px-4 sm:px-6 py-8 font-mono text-xs text-[#788391]">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-foreground font-medium hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            {siteConfig.name}
          </Link>
          <span aria-hidden="true">·</span>
          <span>© {new Date().getFullYear()}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 w-full sm:w-auto">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/projects"
              className="py-0.5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              Projects
            </Link>
            <Link
              href="/about"
              className="py-0.5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              About
            </Link>
            <Link
              href="/activity"
              className="py-0.5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              Activity
            </Link>
            <Link
              href="/contact"
              className="py-0.5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              Contact
            </Link>
          </div>

          <span aria-hidden="true" className="hidden sm:inline text-border">
            |
          </span>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="py-0.5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              GitHub
            </a>
            <a
              href={siteConfig.socials.x}
              target="_blank"
              rel="noopener noreferrer"
              className="py-0.5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              X
            </a>
            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="py-0.5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
