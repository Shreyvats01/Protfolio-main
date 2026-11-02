"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { ProjectCard, type ProjectEntry } from "@/components/project-card";
import {
  filterProjectsByCategory,
  getCategoryCounts,
} from "@/lib/portfolio-helpers";
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
  const prefersReducedMotion = useReducedMotion();

  const categoryCounts = useMemo(
    () => getCategoryCounts(projects, CATEGORIES),
    [projects]
  );

  const filteredProjects = useMemo(
    () => filterProjectsByCategory(projects, selectedCategory),
    [projects, selectedCategory]
  );

  return (
    <div className="space-y-12 sm:space-y-14">
      {/* Category Filter Bar */}
      <div className="space-y-5 sm:space-y-6">
        <div
          role="group"
          aria-label="Filter projects by category"
          className="flex flex-wrap items-center gap-1.5 sm:gap-2"
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            const count = categoryCounts[category] ?? 0;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedCategory(category)}
                className={`relative inline-flex min-h-[40px] sm:min-h-[38px] items-center gap-1.5 rounded-md border px-2.5 sm:px-3.5 py-1.5 font-mono text-[11px] sm:text-xs transition-colors duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0 ${
                  active
                    ? "border-primary/50 text-primary font-medium"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="project-category-pill"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 32 }
                    }
                    className="absolute inset-0 rounded-[calc(var(--radius-md)-1px)] bg-secondary"
                  />
                )}
                <span className="relative z-10">{category}</span>
                <span
                  aria-hidden="true"
                  className={`relative z-10 tabular-nums text-[10px] sm:text-[11px] ${
                    active ? "text-primary/80" : "text-muted-subtle"
                  }`}
                >
                  · {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Curated Projects Grid */}
        <motion.div
          layout={!prefersReducedMotion}
          className="grid gap-4 sm:gap-6 md:grid-cols-2"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout={!prefersReducedMotion}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.98, y: 6 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.98, y: -4 }
                }
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="flex [&>article]:w-full"
              >
                <ProjectCard
                  project={project}
                  repoStats={repoMap[project.repo.toLowerCase()] || null}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
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
              className="group inline-flex min-h-[44px] sm:min-h-[32px] items-center gap-1 font-mono text-xs text-muted-foreground hover:text-primary transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm shrink-0"
            >
              <span>All on GitHub</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>

          <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {extraRepos.map((repo) => (
              <a
                key={repo.nameWithOwner}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[56px] flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 transition-colors duration-150 hover:bg-secondary/60 active:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-150 truncate">
                      {repo.name}
                    </span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 text-muted-subtle transition-all duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                  {repo.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 sm:line-clamp-1">
                      {repo.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 font-mono text-xs text-muted-subtle shrink-0 tabular-nums">
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
