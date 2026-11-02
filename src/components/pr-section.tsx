"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CircleDot,
  CircleSlash,
  GitMerge,
  GitPullRequest,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PullRequestNode, RepoMetadata } from "@/lib/github";
import { extractPrNumber, getVisiblePrTabs } from "@/lib/portfolio-helpers";

function formatShortDate(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PrSection({
  openPrs,
  closedPrs,
  mergedPrs,
  discoveredRepos = [],
}: {
  openPrs: PullRequestNode[];
  closedPrs: PullRequestNode[];
  mergedPrs: PullRequestNode[];
  status?: "authenticated" | "public_fallback" | "unavailable";
  discoveredRepos?: RepoMetadata[];
}) {
  const visibleTabs = getVisiblePrTabs({ mergedPrs, openPrs, closedPrs });
  const defaultTab = visibleTabs[0]?.id || "merged";

  const renderStateIndicator = (state: PullRequestNode["state"]) => {
    if (state === "MERGED") {
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-purple-700 dark:text-[#C084FC] whitespace-nowrap shrink-0">
          <GitMerge className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Merged</span>
        </span>
      );
    }
    if (state === "OPEN") {
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-emerald-700 dark:text-[#4ADE80] whitespace-nowrap shrink-0">
          <CircleDot className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Open</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-muted-subtle whitespace-nowrap shrink-0">
        <CircleSlash className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Closed</span>
      </span>
    );
  };

  const renderPrCards = (prs: PullRequestNode[]) => (
    <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      {prs.map((pr) => {
        const formattedDate = formatShortDate(pr.createdAt);
        const prNumber = extractPrNumber(pr.url);
        const showPrNumber = prNumber && prNumber !== "#1" && prNumber !== "#0";

        return (
          <Link
            key={pr.url}
            href={pr.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-[72px] w-full flex-col justify-between gap-1.5 p-4 sm:px-5 sm:py-4 transition-colors duration-150 hover:bg-secondary/60 active:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
          >
            {/* Top Row: Status (+ Repo on desktop) on left, Date + External Arrow on right */}
            <div className="flex items-center justify-between gap-2 font-mono text-xs tabular-nums">
              <div className="flex min-w-0 items-center gap-2">
                {renderStateIndicator(pr.state)}
                <span
                  aria-hidden="true"
                  className="hidden sm:inline text-muted-subtle"
                >
                  ·
                </span>
                <span className="hidden sm:inline truncate text-muted-foreground">
                  {pr.repository.nameWithOwner}
                </span>
                {showPrNumber && (
                  <span className="hidden sm:inline text-muted-subtle shrink-0">
                    {prNumber}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-muted-subtle shrink-0">
                {formattedDate && <span>{formattedDate}</span>}
                <ArrowUpRight
                  className="h-3.5 w-3.5 text-muted-subtle transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Middle Row: Full-width readable PR title */}
            <p className="text-sm sm:text-[15px] font-medium leading-snug text-foreground group-hover:text-primary transition-colors duration-150">
              {pr.title}
            </p>

            {/* Bottom Row (Mobile only): Full-width repository path so it never collides with date */}
            <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground sm:hidden">
              <span className="truncate">{pr.repository.nameWithOwner}</span>
              {showPrNumber && (
                <span className="text-muted-subtle shrink-0">{prNumber}</span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );

  if (visibleTabs.length === 0) {
    const fallbackRepos = discoveredRepos.slice(0, 5);
    return (
      <section aria-labelledby="recent-prs-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GitPullRequest
              className="h-4 w-4 text-muted-subtle"
              aria-hidden="true"
            />
            <h2
              id="recent-prs-heading"
              className="text-base font-semibold tracking-tight text-foreground"
            >
              Recent Repository Updates
            </h2>
          </div>
        </div>

        {fallbackRepos.length > 0 ? (
          <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {fallbackRepos.map((repo) => (
              <Link
                key={repo.nameWithOwner}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[64px] w-full flex-col justify-between gap-1.5 p-4 sm:px-5 transition-colors duration-150 hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
              >
                <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-subtle tabular-nums">
                  <span className="text-foreground font-medium truncate">
                    {repo.nameWithOwner}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {repo.primaryLanguage && (
                      <span>{repo.primaryLanguage.name}</span>
                    )}
                    {repo.pushedAt && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{formatShortDate(repo.pushedAt)}</span>
                      </>
                    )}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                {repo.description && (
                  <p className="text-sm text-muted-foreground leading-snug">
                    {repo.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
            Public pull requests and repository history are synchronized on
            GitHub.
          </div>
        )}
      </section>
    );
  }

  return (
    <section aria-labelledby="recent-prs-heading" className="w-full">
      <Tabs defaultValue={defaultTab} className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GitPullRequest
              className="h-4 w-4 text-muted-subtle shrink-0"
              aria-hidden="true"
            />
            <h2
              id="recent-prs-heading"
              className="text-base font-semibold tracking-tight text-foreground"
            >
              Recent Pull Requests
            </h2>
          </div>

          {visibleTabs.length > 1 && (
            <TabsList className="flex w-full sm:w-auto bg-background border border-border p-1 h-auto">
              {visibleTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="min-h-[42px] sm:min-h-[32px] flex-1 sm:flex-initial px-3 py-1.5 font-mono text-xs tabular-nums whitespace-nowrap data-active:bg-secondary data-active:text-primary"
                >
                  {tab.badgeText
                    ? `${tab.label} (${tab.badgeText})`
                    : tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          )}
        </div>

        {visibleTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0 w-full">
            {renderPrCards(tab.prs)}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
