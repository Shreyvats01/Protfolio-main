import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  GitFork,
  Star,
} from "lucide-react";
import { getRepoStats } from "@/lib/github";
import { getAdjacentProjects } from "@/lib/portfolio-helpers";
import { ProjectDiagram } from "@/components/project-diagram";
import { GithubIcon } from "@/components/icons";
import type { ProjectEntry } from "@/components/project-card";
import projectsData from "@/data/projects.json";

const projects = projectsData as ProjectEntry[];

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/projects/${project.id}`,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);

  if (!project) {
    notFound();
  }

  const repoStats = await getRepoStats(project.repo);
  const { previous, next } = getAdjacentProjects(projects, project.id);

  const sourceHref =
    repoStats?.url ||
    project.projectUrl ||
    `https://github.com/${project.repo}`;

  const rawDemoUrl =
    project.demoUrl?.trim() || repoStats?.homepageUrl?.trim() || "";
  const hasValidDemo =
    rawDemoUrl !== "" &&
    rawDemoUrl !== "https://demo.url" &&
    rawDemoUrl.startsWith("http");

  return (
    <article className="space-y-10 sm:space-y-12">
      {/* Back Link & Header */}
      <div className="space-y-5 sm:space-y-6 border-b border-border pb-6 sm:pb-8">
        <Link
          href="/projects"
          className="group inline-flex min-h-[44px] sm:min-h-[32px] items-center gap-1.5 py-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
        >
          <ArrowLeft
            className="h-3.5 w-3.5 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          <span>Back to projects</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-subtle">
              <span className="text-primary font-medium">
                {project.category || "Project"}
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{project.repo}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              {project.title}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {project.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 sm:pt-0">
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[44px] sm:min-h-[38px] items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 font-mono text-xs font-medium text-foreground transition-all duration-150 ease-[var(--ease-out-expo)] hover:border-primary/50 hover:text-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>View Source</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 text-muted-subtle transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                aria-hidden="true"
              />
            </a>

            {hasValidDemo && (
              <a
                href={rawDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[44px] sm:min-h-[38px] items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 font-mono text-xs font-semibold text-primary-foreground transition-all duration-150 ease-[var(--ease-out-expo)] hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span>Live Demo</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            )}
          </div>
        </div>

        {/* Stack & Verified Repo Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
            {project.tags.map((tag, index) => (
              <React.Fragment key={tag}>
                <span>{tag}</span>
                {index < project.tags.length - 1 && (
                  <span aria-hidden="true" className="text-muted-subtle">
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          {repoStats && (
            <div className="flex items-center gap-3.5 text-muted-subtle tabular-nums">
              {repoStats.stargazerCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{repoStats.stargazerCount}</span>
                </span>
              )}
              {repoStats.forkCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <GitFork className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{repoStats.forkCount}</span>
                </span>
              )}
              {repoStats.pushedAt && (
                <span>
                  Updated{" "}
                  {new Date(repoStats.pushedAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Overview */}
      {project.overview && (
        <section aria-labelledby="overview-heading" className="space-y-2.5 max-w-2xl">
          <h2
            id="overview-heading"
            className="text-base sm:text-lg font-semibold text-foreground"
          >
            Overview
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            {project.overview}
          </p>
        </section>
      )}

      {/* Responsive Architecture Diagram (Interactive vertical cards on mobile, Interactive SVG on desktop) */}
      {project.diagramType && (
        <section aria-labelledby="diagram-heading" className="space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <h2
              id="diagram-heading"
              className="text-base sm:text-lg font-semibold text-foreground"
            >
              How it works
            </h2>
            <span className="font-mono text-[11px] text-muted-subtle">
              Tap or hover stages to inspect
            </span>
          </div>
          <ProjectDiagram type={project.diagramType} title={project.title} />
        </section>
      )}

      {/* Key Technical Decisions */}
      {project.decisions && project.decisions.length > 0 && (
        <section aria-labelledby="decisions-heading" className="space-y-3.5">
          <h2
            id="decisions-heading"
            className="text-base sm:text-lg font-semibold text-foreground"
          >
            Implementation details
          </h2>
          <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
            {project.decisions.map((decision, idx) => (
              <div
                key={decision.title}
                className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-1.5 transition-colors duration-150 hover:border-foreground/25"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-primary tabular-nums">
                    0{idx + 1}.
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">
                    {decision.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {decision.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Previous / Next Project Navigation */}
      {(previous || next) && (
        <nav
          aria-label="Adjacent projects"
          className="grid gap-3 sm:grid-cols-2 border-t border-border pt-8 sm:pt-10"
        >
          {previous ? (
            <Link
              href={`/projects/${previous.id}`}
              className="group flex flex-col justify-between gap-1.5 rounded-lg border border-border bg-card p-4 transition-all duration-200 ease-[var(--ease-out-expo)] hover:border-foreground/30 hover:-translate-y-[1px] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-subtle group-hover:text-primary transition-colors">
                <ArrowLeft
                  className="h-3.5 w-3.5 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
                <span>Previous project</span>
              </span>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {previous.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block" aria-hidden="true" />
          )}

          {next ? (
            <Link
              href={`/projects/${next.id}`}
              className="group flex flex-col items-start sm:items-end justify-between gap-1.5 rounded-lg border border-border bg-card p-4 text-left sm:text-right transition-all duration-200 ease-[var(--ease-out-expo)] hover:border-foreground/30 hover:-translate-y-[1px] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-subtle group-hover:text-primary transition-colors">
                <span>Next project</span>
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {next.title}
              </span>
            </Link>
          ) : null}
        </nav>
      )}
    </article>
  );
}
