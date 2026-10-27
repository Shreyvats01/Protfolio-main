"use client";

import React, { useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { ProjectCard, type ProjectEntry } from "@/components/project-card";
import type { RepoMetadata } from "@/lib/github";

const CATEGORIES = ["All", "Solana", "Backend", "Systems & Rust"] as const;

export function ProjectsCatalogue({
  projects,
  repoMap,
  extraRepos,
}: {
  projects: ProjectEntry[];
  repoMap: Record<string, RepoMetadata>;
  extraRepos: RepoMetadata[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-12 sm:space-y-14">
      {/* Category Filter Bar */}
      <div className="space-y-5 sm:space-y-6">
        <div
          role="group"
          aria-label="Filter projects by category"
          className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar"
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedCategory(category)}
                className={`min-h-[38px] rounded-md border px-3 py-1.5 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0 ${
                  active
                    ? "border-primary/50 bg-secondary text-primary font-medium"
                    : "border-border bg-card text-muted-foreground hover:border-[#36404B] hover:text-foreground"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Curated Projects Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              repoStats={repoMap[project.repo.toLowerCase()] || null}
            />
          ))}
        </div>
      </div>

      {/* Supplemental GitHub Repositories (Compact List) */}
      {extraRepos.length > 0 && selectedCategory === "All" && (
        <section
          aria-labelledby="other-repos-heading"
          className="space-y-4 border-t border-border pt-8 sm:pt-10"
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              id="other-repos-heading"
              className="text-base font-semibold text-foreground"
            >
              Other Public Repositories
            </h2>
            <a
              href="https://github.com/shreyvats01?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm shrink-0"
            >
              <span>All on GitHub</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="divide-y divide-border rounded-lg border border-border bg-card">
            {extraRepos.map((repo) => (
              <a
                key={repo.nameWithOwner}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {repo.name}
                    </span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 text-[#788391] group-hover:text-primary transition-colors shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                  {repo.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 sm:line-clamp-1">
                      {repo.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 font-mono text-xs text-[#788391] shrink-0 tabular-nums">
                  {repo.primaryLanguage && (
                    <span>{repo.primaryLanguage.name}</span>
                  )}
                  {repo.stargazerCount > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3" aria-hidden="true" />
                      <span>{repo.stargazerCount}</span>
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
