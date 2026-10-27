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
    <article className="group flex flex-col justify-between rounded-lg border border-border bg-card p-4 sm:p-6 transition-colors duration-150 hover:border-[#36404B]">
      <div className="space-y-2.5 sm:space-y-3">
        {/* Top Row: Category + Repo Stars */}
        <div className="flex items-center justify-between gap-2 font-mono text-xs text-[#788391]">
          <span>{project.category || "Project"}</span>
          {repoStats && repoStats.stargazerCount > 0 && (
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Star className="h-3 w-3" aria-hidden="true" />
              <span>{repoStats.stargazerCount}</span>
            </span>
          )}
        </div>

        {/* Title & Concise Summary */}
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
            <Link
              href={detailHref}
              className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm transition-colors"
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
      <div className="mt-5 sm:mt-6 space-y-3.5 border-t border-border pt-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-[#A1AAB6]">
          {visibleTags.map((tag, index) => (
            <React.Fragment key={tag}>
              <span>{tag}</span>
              {index < visibleTags.length - 1 && (
                <span aria-hidden="true" className="text-[#788391]">
                  ·
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 pt-0.5">
          <Link
            href={detailHref}
            className="inline-flex items-center gap-1.5 py-1 font-mono text-xs font-medium text-primary hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            <span>Project details</span>
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>

          <div className="flex items-center gap-4 font-mono text-xs">
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Source repository for ${project.title} on GitHub`}
              className="inline-flex items-center gap-1 py-1 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              <span>Source</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>

            {hasValidDemo && (
              <a
                href={rawDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live demo for ${project.title}`}
                className="inline-flex items-center gap-1 py-1 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                <span>Live Demo</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
