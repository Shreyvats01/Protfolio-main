import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#0B0D0F]">
      <div className="mx-auto flex max-w-4xl flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-8 font-mono text-xs text-[#788391]">
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

        <div className="flex flex-wrap items-center gap-5">
          <Link
            href="/projects"
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            Projects
          </Link>
          <Link
            href="/about"
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            About
          </Link>
          <Link
            href="/activity"
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            Activity
          </Link>
          <Link
            href="/contact"
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            Contact
          </Link>
          <span aria-hidden="true" className="text-border">
            |
          </span>
          <a
            href={siteConfig.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            GitHub
          </a>
          <a
            href={siteConfig.socials.x}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            X
          </a>
          <a
            href={siteConfig.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
