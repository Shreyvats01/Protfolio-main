import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import type { RepoMetadata } from "@/lib/github";

export type ProjectDecision = {
  title: string;
  body: string;
};

export type ProjectEntry = {
  id: string;
  title: string;
  category?: string;
  summary: string;
  detail?: string;
  overview?: string;
  decisions?: ProjectDecision[];
  diagramType?: string;
  repo: string;
  demoUrl?: string;
  projectUrl?: string;
  tags: string[];
  featured?: boolean;
};

export function ProjectCard({
  project,
  repoStats,
}: {
  project: ProjectEntry;
  repoStats?: RepoMetadata | null;
}) {
  const detailHref = `/projects/${project.id}`;
  const sourceHref =
    repoStats?.url ||
    project.projectUrl ||
    (project.repo
      ? `https://github.com/${project.repo}`
      : "https://github.com/shreyvats01");

  const rawDemoUrl =
    project.demoUrl?.trim() || repoStats?.homepageUrl?.trim() || "";
  const hasValidDemo =
    rawDemoUrl !== "" &&
    rawDemoUrl !== "https://demo.url" &&
    rawDemoUrl.startsWith("http");

  const visibleTags = project.tags.slice(0, 4);

  return (
    <article className="group flex flex-col justify-between rounded-lg border border-border bg-card p-5 sm:p-6 transition-all duration-200 ease-[var(--ease-out-expo)] hover:border-foreground/30 hover:-translate-y-[1px] hover:shadow-[0_4px_20px_-12px_rgba(15,23,42,0.12)] dark:hover:shadow-[0_6px_24px_-12px_rgba(0,0,0,0.55)]">
      <div className="space-y-2.5 sm:space-y-3">
        {/* Top Row: Category + Repo Stars */}
        <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-subtle">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-primary font-medium">
              {project.category || "Project"}
            </span>
            {repoStats?.primaryLanguage && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate">{repoStats.primaryLanguage.name}</span>
              </>
            )}
          </div>
          {repoStats && repoStats.stargazerCount > 0 && (
            <span className="inline-flex items-center gap-1 tabular-nums shrink-0">
              <Star className="h-3 w-3 text-muted-subtle transition-colors duration-150 group-hover:text-primary" aria-hidden="true" />
              <span>{repoStats.stargazerCount}</span>
            </span>
          )}
        </div>

        {/* Title & Concise Summary */}
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
            <Link
              href={detailHref}
              className="inline-block hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm transition-colors duration-150"
            >
              {project.title}
            </Link>
          </h3>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
        </div>
      </div>

      {/* Card Footer: 2-4 Tech Labels & Distinct Links */}
      <div className="mt-5 sm:mt-6 space-y-3 border-t border-border pt-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground">
          {visibleTags.map((tag, index) => (
            <React.Fragment key={tag}>
              <span>{tag}</span>
              {index < visibleTags.length - 1 && (
                <span aria-hidden="true" className="text-muted-subtle">
                  ·
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <Link
            href={detailHref}
            className="group/details inline-flex min-h-[44px] sm:min-h-[32px] items-center gap-1.5 py-1 font-mono text-xs font-medium text-primary hover:underline underline-offset-4 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm transition-transform duration-150"
          >
            <span>Project details</span>
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover/details:translate-x-1"
              aria-hidden="true"
            />
          </Link>

          <div className="flex items-center gap-4 font-mono text-xs">
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Source repository for ${project.title} on GitHub`}
              className="group/ext inline-flex min-h-[44px] sm:min-h-[32px] items-center gap-1 py-1 text-muted-foreground hover:text-foreground active:scale-[0.98] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              <span>Source</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover/ext:translate-x-0.5 group-hover/ext:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>

            {hasValidDemo && (
              <a
                href={rawDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live demo for ${project.title}`}
                className="group/demo inline-flex min-h-[44px] sm:min-h-[32px] items-center gap-1 py-1 text-muted-foreground hover:text-foreground active:scale-[0.98] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                <span>Live Demo</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover/demo:translate-x-0.5 group-hover/demo:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
