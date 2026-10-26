"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, GitFork, Star, Layers, FileCode2 } from "lucide-react";
import { ProjectDiagram } from "@/components/project-diagram";
import { GithubIcon } from "@/components/icons";
import type { RepoMetadata } from "@/lib/github";

export type ProjectEntry = {
  id: string;
  title: string;
  tagline?: string;
  problem?: string;
  description: string;
  impact: string;
  architectureNotes?: string[];
  diagramType?: string;
  repo: string;
  demoUrl?: string;
  projectUrl?: string;
  tags: string[];
  featured?: boolean;
};

function formatUpdatedDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function ProjectCard({
  project,
  repoStats,
  index,
}: {
  project: ProjectEntry;
  repoStats?: RepoMetadata | null;
  index?: number;
}) {
  const [activeTab, setActiveTab] = useState<"diagram" | "notes">("diagram");

  const isFeatured = Boolean(project.featured);
  const sourceHref =
    repoStats?.url ||
    project.projectUrl ||
    (project.repo ? `https://github.com/${project.repo}` : "https://github.com/shreyvats01");

  const rawDemoUrl = project.demoUrl?.trim() || repoStats?.homepageUrl?.trim() || "";
  const hasValidDemo =
    rawDemoUrl !== "" &&
    rawDemoUrl !== "https://demo.url" &&
    rawDemoUrl.startsWith("http");

  const updatedLabel = formatUpdatedDate(repoStats?.pushedAt);
  const displayIndex =
    typeof index === "number" ? String(index + 1).padStart(2, "0") : null;

  if (!isFeatured) {
    return (
      <article className="group flex flex-col justify-between rounded-lg border border-border bg-card p-6 transition-colors duration-200 hover:border-[#36404B] hover:bg-[#151A20]">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono text-xs text-[#788391]">
                {displayIndex && <span>{displayIndex}</span>}
                {displayIndex && <span aria-hidden="true">·</span>}
                <span className="truncate">{project.repo}</span>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                <Link
                  href={sourceHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm transition-colors"
                >
                  <span>{project.title}</span>
                  <ArrowUpRight className="h-4 w-4 text-[#788391] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </Link>
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={sourceHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View source repository for ${project.title} on GitHub`}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-[#36404B] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                <span>Source</span>
              </Link>
              {hasValidDemo && (
                <Link
                  href={rawDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open live deployment for ${project.title}`}
                  className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0"
                >
                  <span>Live</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>

          {project.tagline && (
            <p className="text-sm font-medium text-[#CBD5E1]">{project.tagline}</p>
          )}

          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        </div>

        <div className="mt-6 space-y-3 border-t border-border pt-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-[#788391]">
            {project.tags.map((tag, i) => (
              <React.Fragment key={tag}>
                <span className="text-muted-foreground">{tag}</span>
                {i < project.tags.length - 1 && (
                  <span aria-hidden="true" className="text-[#3A434E]">
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          {repoStats && (
            <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-[#788391] tabular-nums">
              {repoStats.primaryLanguage && (
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: repoStats.primaryLanguage.color }}
                    aria-hidden="true"
                  />
                  {repoStats.primaryLanguage.name}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5" aria-hidden="true" />
                {repoStats.stargazerCount}
              </span>
              <span className="inline-flex items-center gap-1">
                <GitFork className="h-3.5 w-3.5" aria-hidden="true" />
                {repoStats.forkCount}
              </span>
              {updatedLabel && <span>Updated {updatedLabel}</span>}
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="group rounded-lg border border-border bg-card transition-colors duration-200 hover:border-[#36404B]">
      {/* Card Header */}
      <div className="border-b border-border p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#788391]">
              {displayIndex && (
                <span className="text-primary font-medium">{displayIndex}</span>
              )}
              {displayIndex && <span aria-hidden="true">/</span>}
              <span>{project.repo}</span>
              {updatedLabel && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Last push {updatedLabel}</span>
                </>
              )}
            </div>

            <h3 className="text-2xl font-semibold tracking-tight text-foreground">
              <Link
                href={sourceHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm transition-colors"
              >
                {project.title}
              </Link>
            </h3>

            {project.tagline && (
              <p className="text-base font-medium text-[#CBD5E1]">
                {project.tagline}
              </p>
            )}
          </div>

          {/* Independent Action Links */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Inspect source code for ${project.title} on GitHub`}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-3.5 py-2 font-mono text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>Source Code</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#788391]" />
            </Link>

            {hasValidDemo && (
              <Link
                href={rawDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Launch live demo for ${project.title}`}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 font-mono text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0"
              >
                <span>Live Demo</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Split: Problem/Implementation & Interactive Diagram/Specs */}
      <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-4">
            {project.problem && (
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] tracking-wider text-[#788391] uppercase">
                  Problem Context
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {project.problem}
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="font-mono text-[11px] tracking-wider text-[#788391] uppercase">
                Engineering Implementation
              </span>
              <p className="text-sm leading-relaxed text-[#CBD5E1]">
                {project.description}
              </p>
            </div>

            <div className="rounded-md border border-border bg-secondary/60 p-3.5">
              <span className="block font-mono text-[11px] text-primary mb-1">
                Core Architectural Outcome
              </span>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {project.impact}
              </p>
            </div>
          </div>

          {/* Unboxed Stack & Verified Repo Metrics */}
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs">
              {project.tags.map((tag, i) => (
                <React.Fragment key={tag}>
                  <span className="text-[#CBD5E1]">{tag}</span>
                  {i < project.tags.length - 1 && (
                    <span aria-hidden="true" className="text-[#475260]">
                      ·
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-[#788391] tabular-nums">
              {repoStats ? (
                <>
                  {repoStats.primaryLanguage && (
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: repoStats.primaryLanguage.color,
                        }}
                        aria-hidden="true"
                      />
                      {repoStats.primaryLanguage.name}
                    </span>
                  )}
                  <span
                    className="inline-flex items-center gap-1"
                    title="GitHub Stars"
                  >
                    <Star className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{repoStats.stargazerCount} stars</span>
                  </span>
                  <span
                    className="inline-flex items-center gap-1"
                    title="GitHub Forks"
                  >
                    <GitFork className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{repoStats.forkCount} forks</span>
                  </span>
                </>
              ) : (
                <span>Repository specification · GitHub</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Architecture Schematic & Invariants */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <span className="font-mono text-xs text-[#788391]">
              Technical Preview
            </span>
            {project.architectureNotes &&
              project.architectureNotes.length > 0 && (
                <div
                  role="tablist"
                  aria-label={`${project.title} preview mode`}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-[#0B0D0F] p-0.5"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "diagram"}
                    onClick={() => setActiveTab("diagram")}
                    className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[11px] transition-colors whitespace-nowrap shrink-0 ${
                      activeTab === "diagram"
                        ? "bg-secondary text-foreground font-medium"
                        : "text-[#788391] hover:text-foreground"
                    }`}
                  >
                    <Layers className="h-3 w-3" />
                    <span>System Diagram</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "notes"}
                    onClick={() => setActiveTab("notes")}
                    className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[11px] transition-colors whitespace-nowrap shrink-0 ${
                      activeTab === "notes"
                        ? "bg-secondary text-foreground font-medium"
                        : "text-[#788391] hover:text-foreground"
                    }`}
                  >
                    <FileCode2 className="h-3 w-3" />
                    <span>Design Notes</span>
                  </button>
                </div>
              )}
          </div>

          {activeTab === "diagram" ? (
            <div className="space-y-3">
              <ProjectDiagram
                type={project.diagramType || project.id}
                title={project.title}
              />
              {project.architectureNotes &&
                project.architectureNotes.length > 0 && (
                  <ul className="space-y-1.5 pt-1">
                    {project.architectureNotes.slice(0, 2).map((note) => (
                      <li
                        key={note}
                        className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary"
                        />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          ) : (
            <div className="rounded-md border border-border bg-[#0B0D0F] p-5 space-y-3">
              <div className="font-mono text-[11px] text-primary">
                IMPLEMENTATION INVARIANTS &amp; DESIGN NOTES
              </div>
              <ul className="space-y-2.5">
                {(project.architectureNotes || [project.impact]).map(
                  (note, idx) => (
                    <li
                      key={note}
                      className="flex items-start gap-3 text-xs leading-relaxed text-[#CBD5E1]"
                    >
                      <span className="font-mono text-[#788391] shrink-0">
                        0{idx + 1}.
                      </span>
                      <span>{note}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
