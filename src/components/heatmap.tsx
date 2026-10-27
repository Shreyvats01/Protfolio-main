"use client";

import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ContributionDay, ContributionWeek } from "@/lib/github";

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

export function Heatmap({
  weeks,
  status,
}: {
  weeks: ContributionWeek[];
  status?: "authenticated" | "public_fallback" | "unavailable";
}) {
  const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null);

  const getCellStyle = (count: number) => {
    if (count === 0) {
      return "bg-[#141920] border border-[#222933]";
    }
    if (count <= 2) {
      return "bg-[#2C441E] border border-[#3B5B28]";
    }
    if (count <= 5) {
      return "bg-[#4D7C2B] border border-[#5E9635]";
    }
    if (count <= 10) {
      return "bg-[#82B946] border border-[#96CF56]";
    }
    return "bg-[#B7F36B] border border-[#CCF792]";
  };

  if (!weeks || weeks.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              Contribution Calendar
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {status === "public_fallback"
                ? "GitHub’s 52-week contribution graph requires an authenticated GraphQL token (GITHUB_TOKEN). Public repositories and pull requests remain live."
                : "Contribution calendar data is temporarily unavailable from the GitHub API."}
            </p>
          </div>
          <span className="font-mono text-[11px] text-[#788391] whitespace-nowrap shrink-0">
            GraphQL · contributionsCollection
          </span>
        </div>
      </div>
    );
  }

  const allDays = weeks.flatMap((w) => w.contributionDays);
  const latestDay = allDays[allDays.length - 1] || null;
  const activeReadout = selectedDay || latestDay;

  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            52-Week Contribution Matrix
          </h3>
          <p className="text-xs text-[#788391]">
            Tap or focus any day cell to inspect exact commit and review activity.
          </p>
        </div>

        {/* Intensity Legend */}
        <div
          className="flex items-center gap-1.5 font-mono text-[11px] text-[#788391]"
          aria-label="Contribution intensity scale from zero to high"
        >
          <span>0</span>
          <span className="h-3 w-3 rounded-[2px] bg-[#141920] border border-[#222933]" />
          <span className="h-3 w-3 rounded-[2px] bg-[#2C441E] border border-[#3B5B28]" />
          <span className="h-3 w-3 rounded-[2px] bg-[#4D7C2B] border border-[#5E9635]" />
          <span className="h-3 w-3 rounded-[2px] bg-[#82B946] border border-[#96CF56]" />
          <span className="h-3 w-3 rounded-[2px] bg-[#B7F36B] border border-[#CCF792]" />
          <span>10+</span>
        </div>
      </div>

      <TooltipProvider delay={50}>
        <div
          role="region"
          aria-label="GitHub contribution calendar"
          className="overflow-x-auto pb-2"
        >
          <div className="inline-flex gap-1 min-w-max">
            {weeks.map((week, weekIdx) => (
              <div
                key={week.contributionDays[0]?.date || weekIdx}
                className="flex flex-col gap-1 shrink-0"
              >
                {week.contributionDays.map((day) => {
                  const formattedDate = formatDayDate(day.date);
                  const countText =
                    day.contributionCount === 1
                      ? "1 contribution"
                      : `${day.contributionCount} contributions`;
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
                            className={`h-3 w-3 rounded-[2px] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${getCellStyle(
                              day.contributionCount
                            )} ${isSelected ? "ring-1 ring-foreground scale-110" : ""}`}
                          />
                        }
                      />
                      <TooltipContent>
                        <p className="font-mono text-xs tabular-nums">
                          <span className="font-semibold">{countText}</span> on{" "}
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
            Date:{" "}
            <strong className="font-medium text-foreground">
              {formatDayDate(activeReadout.date)}
            </strong>
          </span>
          <span>
            <strong className="font-medium text-primary">
              {activeReadout.contributionCount}
            </strong>{" "}
            {activeReadout.contributionCount === 1
              ? "contribution"
              : "contributions"}
          </span>
        </div>
      )}
    </div>
  );
}
