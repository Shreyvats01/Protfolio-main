"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  ContributionDay,
  ContributionWeek,
  RepoMetadata,
} from "@/lib/github";
import { computeLanguageBreakdown } from "@/lib/portfolio-helpers";

function formatDayDate(dateStr: string): string {
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRepoPushDate(iso: string | null): string {
  if (!iso) return "Active";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "Active";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatContributionReadout(count: number): string {
  if (count <= 0) return "No public commits recorded";
  if (count === 1) return "Active commit day";
  return `${count} contributions`;
}

export function Heatmap({
  weeks,
  discoveredRepos = [],
}: {
  weeks: ContributionWeek[];
  status?: "authenticated" | "public_fallback" | "unavailable";
  discoveredRepos?: RepoMetadata[];
}) {
  const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const allDays = weeks ? weeks.flatMap((w) => w.contributionDays) : [];
  const totalContributions = allDays.reduce(
    (sum, d) => sum + d.contributionCount,
    0
  );
  const hasRichCalendar = weeks && weeks.length > 0 && totalContributions > 1;

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      el.scrollLeft = el.scrollWidth;
    }
  }, [weeks.length]);

  const getCellStyle = (count: number) => {
    if (count === 0) {
      return "bg-secondary border border-border dark:bg-[#141920] dark:border-[#222933]";
    }
    if (count <= 2) {
      return "bg-[#C7E8B5] border border-[#AEDB97] dark:bg-[#2C441E] dark:border-[#3B5B28]";
    }
    if (count <= 5) {
      return "bg-[#88CA68] border border-[#72B852] dark:bg-[#4D7C2B] dark:border-[#5E9635]";
    }
    if (count <= 10) {
      return "bg-[#4F9E2F] border border-[#3E8422] dark:bg-[#82B946] dark:border-[#96CF56]";
    }
    return "bg-[#2D6A1E] border border-[#225216] dark:bg-[#B7F36B] dark:border-[#CCF792]";
  };

  const languageBreakdown = computeLanguageBreakdown(discoveredRepos).slice(
    0,
    5
  );
  const recentRepos = discoveredRepos.slice(0, 4);

  if (!hasRichCalendar) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Active Repositories &amp; Language Breakdown
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Language distribution and most recently updated public
              repositories.
            </p>
          </div>
          {discoveredRepos.length > 1 && (
            <span className="font-mono text-xs text-muted-subtle tabular-nums shrink-0">
              {discoveredRepos.length} public repositories
            </span>
          )}
        </div>

        {languageBreakdown.length > 0 && (
          <div className="space-y-3">
            <div
              className="flex h-2 w-full overflow-hidden rounded-full bg-secondary"
              role="img"
              aria-label="Repository language distribution"
            >
              {languageBreakdown.map((lang) => (
                <div
                  key={lang.name}
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color,
                  }}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs text-muted-foreground tabular-nums">
              {languageBreakdown.map((lang) => (
                <div key={lang.name} className="inline-flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: lang.color }}
                    aria-hidden="true"
                  />
                  <span className="text-foreground font-medium">
                    {lang.name}
                  </span>
                  <span className="text-muted-subtle">{lang.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentRepos.length > 0 && (
          <div className="divide-y divide-border rounded-md border border-border bg-background">
            {recentRepos.map((repo) => (
              <Link
                key={repo.nameWithOwner}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[52px] flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-3.5 sm:px-4 transition-colors duration-150 hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between sm:justify-start gap-2">
                    <span className="font-mono text-xs sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {repo.nameWithOwner}
                    </span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 shrink-0 text-muted-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  {repo.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {repo.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] text-muted-subtle tabular-nums shrink-0">
                  {repo.primaryLanguage && (
                    <>
                      <span className="text-muted-foreground">
                        {repo.primaryLanguage.name}
                      </span>
                      <span aria-hidden="true">·</span>
                    </>
                  )}
                  <span>Pushed {formatRepoPushDate(repo.pushedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  const latestActiveDay =
    [...allDays].reverse().find((d) => d.contributionCount > 1) ||
    [...allDays].reverse().find((d) => d.contributionCount > 0) ||
    allDays[allDays.length - 1] ||
    null;
  const activeReadout = selectedDay || latestActiveDay;

  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            52-Week Contribution Matrix
          </h2>
          <p className="text-xs text-muted-subtle">
            Tap or focus any day cell to inspect commit and review activity.
          </p>
        </div>

        {/* Intensity Legend */}
        <div
          className="flex items-center gap-1.5 font-mono text-[11px] text-muted-subtle"
          aria-label="Contribution intensity scale from less to more"
        >
          <span>Less</span>
          <span className="h-3 w-3 rounded-[2px] bg-secondary border border-border dark:bg-[#141920] dark:border-[#222933]" />
          <span className="h-3 w-3 rounded-[2px] bg-[#C7E8B5] border border-[#AEDB97] dark:bg-[#2C441E] dark:border-[#3B5B28]" />
          <span className="h-3 w-3 rounded-[2px] bg-[#88CA68] border border-[#72B852] dark:bg-[#4D7C2B] dark:border-[#5E9635]" />
          <span className="h-3 w-3 rounded-[2px] bg-[#4F9E2F] border border-[#3E8422] dark:bg-[#82B946] dark:border-[#96CF56]" />
          <span className="h-3 w-3 rounded-[2px] bg-[#2D6A1E] border border-[#225216] dark:bg-[#B7F36B] dark:border-[#CCF792]" />
          <span>More</span>
        </div>
      </div>

      <TooltipProvider delay={50}>
        <div
          ref={scrollContainerRef}
          role="region"
          aria-label="GitHub contribution calendar"
          className="overflow-x-auto pb-2 no-scrollbar"
        >
          <div className="inline-flex gap-1 min-w-max">
            {weeks.map((week, weekIdx) => (
              <div
                key={week.contributionDays[0]?.date || weekIdx}
                className="flex flex-col gap-1 shrink-0"
              >
                {week.contributionDays.map((day) => {
                  const formattedDate = formatDayDate(day.date);
                  const countText = formatContributionReadout(
                    day.contributionCount
                  );
                  const isSelected = selectedDay?.date === day.date;

                  return (
                    <Tooltip key={day.date}>
                      <TooltipTrigger
                        render={
                          <button
                            type="button"
                            aria-label={`${countText} on ${formattedDate}`}
                            onClick={() => setSelectedDay(day)}
                            onFocus={() => setSelectedDay(day)}
                            onMouseEnter={() => setSelectedDay(day)}
                            className={`h-3.5 w-3.5 sm:h-3 sm:w-3 rounded-[2px] transition-transform duration-150 ease-[var(--ease-out-expo)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${getCellStyle(
                              day.contributionCount
                            )} ${
                              isSelected
                                ? "ring-1 ring-foreground scale-115"
                                : "hover:scale-110"
                            }`}
                          />
                        }
                      />
                      <TooltipContent>
                        <p className="font-mono text-xs tabular-nums">
                          <span className="font-semibold">{countText}</span> ·{" "}
                          {formattedDate}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </TooltipProvider>

      {/* Touch & Keyboard Accessible Readout Bar */}
      {activeReadout && (
        <div
          aria-live="polite"
          className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 font-mono text-xs text-muted-foreground tabular-nums"
        >
          <span>
            Selected:{" "}
            <strong className="font-medium text-foreground">
              {formatDayDate(activeReadout.date)}
            </strong>
          </span>
          <span className="text-foreground font-medium">
            {activeReadout.contributionCount > 1 ? (
              <>
                <strong className="text-primary">
                  {activeReadout.contributionCount}
                </strong>{" "}
                contributions
              </>
            ) : (
              formatContributionReadout(activeReadout.contributionCount)
            )}
          </span>
        </div>
      )}

      {/* Live Repository Language Breakdown */}
      {languageBreakdown.length > 0 && (
        <div className="space-y-2.5 border-t border-border pt-4">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 font-mono text-[11px] text-muted-subtle">
            <span>Language Distribution</span>
            {discoveredRepos.length > 1 && (
              <span className="tabular-nums">
                {discoveredRepos.length} public repos
              </span>
            )}
          </div>
          <div
            className="flex h-1.5 w-full overflow-hidden rounded-full bg-secondary"
            role="img"
            aria-label="Primary language distribution across public repositories"
          >
            {languageBreakdown.map((lang) => (
              <div
                key={lang.name}
                style={{
                  width: `${lang.percentage}%`,
                  backgroundColor: lang.color,
                }}
                className="h-full first:rounded-l-full last:rounded-r-full"
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground tabular-nums">
            {languageBreakdown.map((lang) => (
              <div key={lang.name} className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: lang.color }}
                  aria-hidden="true"
                />
                <span className="text-foreground">{lang.name}</span>
                <span className="text-muted-subtle">{lang.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
