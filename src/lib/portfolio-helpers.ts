import type { ProjectEntry } from "@/components/project-card";

export function filterProjectsByCategory(
  projects: ProjectEntry[],
  category: string
): ProjectEntry[] {
  if (!category || category === "All") {
    return projects;
  }
  return projects.filter((p) => p.category === category);
}

export function getCategoryCounts(
  projects: ProjectEntry[],
  categories: readonly string[]
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const cat of categories) {
    if (cat === "All") {
      counts[cat] = projects.length;
    } else {
      counts[cat] = projects.filter((p) => p.category === cat).length;
    }
  }
  return counts;
}

export function getAdjacentProjects(
  projects: ProjectEntry[],
  currentSlug: string
): {
  previous: ProjectEntry | null;
  next: ProjectEntry | null;
} {
  const index = projects.findIndex((p) => p.id === currentSlug);
  if (index === -1) {
    return { previous: null, next: null };
  }
  const previous = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;
  return { previous, next };
}
