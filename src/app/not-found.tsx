import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-16 space-y-6 max-w-md">
      <div className="space-y-2">
        <span className="font-mono text-xs text-primary">404</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="text-sm text-muted-foreground">
          The page or project you are looking for does not exist or has moved.
        </p>
      </div>

      <div className="flex items-center gap-4 font-mono text-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back home</span>
        </Link>
        <Link
          href="/projects"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Browse projects
        </Link>
      </div>
    </div>
  );
}
