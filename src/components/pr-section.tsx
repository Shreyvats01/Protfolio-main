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
import type { PullRequestNode } from "@/lib/github";

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
  status,
}: {
  openPrs: PullRequestNode[];
  closedPrs: PullRequestNode[];
  mergedPrs: PullRequestNode[];
  status?: "authenticated" | "public_fallback" | "unavailable";
}) {
  const renderStateIndicator = (state: PullRequestNode["state"]) => {
    if (state === "MERGED") {
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#C084FC] whitespace-nowrap shrink-0">
          <GitMerge className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Merged</span>
        </span>
      );
    }
    if (state === "OPEN") {
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#4ADE80] whitespace-nowrap shrink-0">
          <CircleDot className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Open</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#94A3B8] whitespace-nowrap shrink-0">
        <CircleSlash className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Closed</span>
      </span>
    );
  };

  const renderList = (prs: PullRequestNode[], emptyMsg: string) => {
    if (status === "unavailable") {
      return (
        <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
          Pull request activity could not be retrieved because GitHub is
          currently unreachable.
        </div>
      );
    }

    if (!prs || prs.length === 0) {
      return (
        <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground flex items-center justify-between gap-2">
          <span>{emptyMsg}</span>
          <span className="font-mono text-xs text-[#788391] shrink-0">0 matching</span>
        </div>
      );
    }

    return (
      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {prs.map((pr) => {
          const formattedDate = formatShortDate(pr.createdAt);
          return (
            <Link
              key={pr.url}
              href={pr.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-4 sm:px-5 transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-start sm:items-center justify-between sm:justify-start gap-2">
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 sm:line-clamp-1">
                    {pr.title}
                  </span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 shrink-0 text-[#788391] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary mt-0.5 sm:mt-0"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-[#788391] tabular-nums">
                  <span className="text-muted-foreground truncate max-w-[200px] sm:max-w-none">
                    {pr.repository.nameWithOwner}
                  </span>
                  {formattedDate && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{formattedDate}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-start sm:justify-end gap-3 shrink-0">
                {renderStateIndicator(pr.state)}
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="merged" className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GitPullRequest
              className="h-4 w-4 text-[#788391]"
              aria-hidden="true"
            />
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Recent Pull Requests
            </h3>
          </div>

          <TabsList className="grid grid-cols-3 w-full sm:w-auto bg-[#0B0D0F] border border-border p-1 h-auto">
            <TabsTrigger
              value="merged"
              className="px-2 sm:px-3 py-1.5 font-mono text-[11px] sm:text-xs whitespace-nowrap shrink-0 data-active:bg-secondary data-active:text-primary"
            >
              Merged ({mergedPrs.length})
            </TabsTrigger>
            <TabsTrigger
              value="open"
              className="px-2 sm:px-3 py-1.5 font-mono text-[11px] sm:text-xs whitespace-nowrap shrink-0 data-active:bg-secondary data-active:text-primary"
            >
              Open ({openPrs.length})
            </TabsTrigger>
            <TabsTrigger
              value="closed"
              className="px-2 sm:px-3 py-1.5 font-mono text-[11px] sm:text-xs whitespace-nowrap shrink-0 data-active:bg-secondary data-active:text-primary"
            >
              Closed ({closedPrs.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="merged" className="mt-0">
          {renderList(mergedPrs, "No recently merged pull requests found.")}
        </TabsContent>
        <TabsContent value="open" className="mt-0">
          {renderList(openPrs, "No open pull requests at the moment.")}
        </TabsContent>
        <TabsContent value="closed" className="mt-0">
          {renderList(closedPrs, "No recently closed pull requests.")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
