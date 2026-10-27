import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, GitFork, Star } from "lucide-react";
import { getRepoStats } from "@/lib/github";
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
          className="inline-flex items-center gap-1.5 py-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to projects</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#788391]">
              <span className="text-primary">{project.category || "Project"}</span>
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
              className="inline-flex min-h-[38px] items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 font-mono text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>View Source</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#788391]" aria-hidden="true" />
            </a>

            {hasValidDemo && (
              <a
                href={rawDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 font-mono text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span>Live Demo</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        {/* Stack & Verified Repo Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[#A1AAB6]">
            {project.tags.map((tag, index) => (
              <React.Fragment key={tag}>
                <span>{tag}</span>
                {index < project.tags.length - 1 && (
                  <span aria-hidden="true" className="text-[#788391]">
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          {repoStats && (
            <div className="flex items-center gap-4 text-[#788391] tabular-nums">
              {repoStats.primaryLanguage && (
                <span>{repoStats.primaryLanguage.name}</span>
              )}
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{repoStats.stargazerCount} stars</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <GitFork className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{repoStats.forkCount} forks</span>
              </span>
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

      {/* Responsive Architecture Diagram (Vertical cards on mobile, SVG on desktop) */}
      {project.diagramType && (
        <section aria-labelledby="diagram-heading" className="space-y-3">
          <h2
            id="diagram-heading"
            className="text-base sm:text-lg font-semibold text-foreground"
          >
            How it works
          </h2>
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
            {project.decisions.map((decision) => (
              <div
                key={decision.title}
                className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-1.5"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {decision.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {decision.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
