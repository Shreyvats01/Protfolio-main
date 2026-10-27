import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getGithubPortfolioData } from "@/lib/github";
import { siteConfig } from "@/lib/site-config";
import { StatsBar } from "@/components/stats-bar";
import { Heatmap } from "@/components/heatmap";
import { PrSection } from "@/components/pr-section";

export const metadata: Metadata = {
  title: "GitHub Activity",
  description:
    "Open-source contributions, repositories, and recent pull requests by Shrey Vats.",
  alternates: {
    canonical: "/activity",
  },
};

export default async function ActivityPage() {
  const githubData = await getGithubPortfolioData(siteConfig.handle);

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            GitHub Activity
          </h1>
          <p className="text-sm text-muted-foreground">
            Public repository totals, contribution history, and pull requests
            from @{siteConfig.handle}.
          </p>
        </div>

        <a
          href={siteConfig.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm shrink-0"
        >
          <span>github.com/{siteConfig.handle}</span>
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </header>

      <StatsBar
        prs={githubData.stats.prs}
        contributions={githubData.stats.contributions}
        repos={githubData.stats.repos}
        stars={githubData.stats.stars}
      />

      <Heatmap weeks={githubData.weeks} status={githubData.status} />

      <PrSection
        openPrs={githubData.openPrs}
        closedPrs={githubData.closedPrs}
        mergedPrs={githubData.mergedPrs}
        status={githubData.status}
      />
    </div>
  );
}
