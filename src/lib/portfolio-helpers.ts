import type { ProjectEntry } from "@/components/project-card";
import type {
  ContributionDay,
  ContributionWeek,
  PullRequestNode,
  RepoMetadata,
} from "@/lib/github";

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

export type LanguageBreakdownItem = {
  name: string;
  color: string;
  count: number;
  percentage: number;
};

export function computeLanguageBreakdown(
  repos: RepoMetadata[]
): LanguageBreakdownItem[] {
  const counts = new Map<string, { color: string; count: number }>();
  let totalWithLang = 0;

  for (const repo of repos) {
    const lang = repo.primaryLanguage;
    if (!lang || !lang.name) continue;
    totalWithLang += 1;
    const existing = counts.get(lang.name);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(lang.name, {
        color: lang.color || "#A1AAB6",
        count: 1,
      });
    }
  }

  if (totalWithLang === 0) {
    return [];
  }

  return Array.from(counts.entries())
    .map(([name, info]) => ({
      name,
      color: info.color,
      count: info.count,
      percentage: Math.max(1, Math.round((info.count / totalWithLang) * 100)),
    }))
    .sort((a, b) => b.count - a.count);
}

export type ActivityStatItem = {
  id: string;
  label: string;
  kind: "number" | "highlight";
  numericValue: number | null;
  textValue: string;
  note: string;
};

function formatMonthYear(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

/**
 * Builds the 4 summary cards for the GitHub Activity page.
 * Any metric that is null, 0, or 1 is automatically replaced with a live
 * engineering highlight derived from public repositories.
 */
export function buildActivityStats(
  stats: {
    prs: number | null;
    contributions: number | null;
    repos: number | null;
    stars: number | null;
  },
  discoveredRepos: RepoMetadata[] = []
): ActivityStatItem[] {
  const langBreakdown = computeLanguageBreakdown(discoveredRepos);
  const hasRust = langBreakdown.some((l) => l.name === "Rust");
  const hasTs = langBreakdown.some((l) => l.name === "TypeScript");

  const topTwoLangs =
    hasRust && hasTs
      ? "Rust · TypeScript"
      : langBreakdown.length >= 2
      ? `${langBreakdown[0].name} · ${langBreakdown[1].name}`
      : langBreakdown.length === 1
      ? `${langBreakdown[0].name} · Systems`
      : "Rust · TypeScript";

  const langNote =
    discoveredRepos.length > 1
      ? `Across ${discoveredRepos.length} active repos`
      : "Primary engineering stack";

  const latestRepo = discoveredRepos.find((r) => Boolean(r.pushedAt)) || null;
  const latestPushLabel = formatMonthYear(latestRepo?.pushedAt) || "Active";
  const latestPushNote = latestRepo
    ? `Latest push · ${latestRepo.name}`
    : "Continuous public commits";

  const fallbackPool: ActivityStatItem[] = [
    {
      id: "primary-stack",
      label: "Primary Stack",
      kind: "highlight",
      numericValue: null,
      textValue: topTwoLangs,
      note: langNote,
    },
    {
      id: "core-focus",
      label: "Core Focus",
      kind: "highlight",
      numericValue: null,
      textValue: "Solana · Backend",
      note: "On-chain & distributed systems",
    },
    {
      id: "latest-activity",
      label: "Latest Activity",
      kind: "highlight",
      numericValue: null,
      textValue: latestPushLabel,
      note: latestPushNote,
    },
    {
      id: "open-source-scope",
      label: "Architecture",
      kind: "highlight",
      numericValue: null,
      textValue: "Systems & CLI",
      note: "Zero-copy & async runtimes",
    },
  ];

  let fallbackIndex = 0;
  const nextFallback = (): ActivityStatItem => {
    const item = fallbackPool[fallbackIndex % fallbackPool.length];
    fallbackIndex += 1;
    return item;
  };

  const candidates: Array<{
    id: string;
    label: string;
    value: number | null;
    minThreshold: number;
    note: string;
  }> = [
    {
      id: "repos",
      label: "Public Repos",
      value: stats.repos,
      minThreshold: 2,
      note: "Non-forked sources",
    },
    {
      id: "contributions",
      label: "Contributions (1y)",
      value: stats.contributions,
      minThreshold: 2,
      note: "52-week public activity",
    },
    {
      id: "prs",
      label: "Merged PRs",
      value: stats.prs,
      minThreshold: 2,
      note: "Shipped pull requests",
    },
    {
      id: "stars",
      label: "Repo Stars",
      value: stats.stars,
      minThreshold: 6,
      note: "Across public work",
    },
  ];

  return candidates.map((candidate) => {
    if (
      candidate.value !== null &&
      candidate.value >= candidate.minThreshold
    ) {
      return {
        id: candidate.id,
        label: candidate.label,
        kind: "number",
        numericValue: candidate.value,
        textValue: candidate.value.toLocaleString("en-US"),
        note: candidate.note,
      };
    }
    return nextFallback();
  });
}

export type PrTabDescriptor = {
  id: "merged" | "open" | "closed";
  label: string;
  badgeText: string | null;
  count: number;
  prs: PullRequestNode[];
  emptyMsg: string;
};

/**
 * Filters out empty PR status tabs (count === 0) and omits raw "1" or "0"
 * numeric badges so mobile tabs stay compact and high-signal.
 */
export function getVisiblePrTabs({
  mergedPrs,
  openPrs,
  closedPrs,
}: {
  mergedPrs: PullRequestNode[];
  openPrs: PullRequestNode[];
  closedPrs: PullRequestNode[];
}): PrTabDescriptor[] {
  const rawTabs: Array<{
    id: "merged" | "open" | "closed";
    label: string;
    prs: PullRequestNode[];
    emptyMsg: string;
  }> = [
    {
      id: "merged",
      label: "Merged",
      prs: mergedPrs || [],
      emptyMsg: "No recently merged pull requests found.",
    },
    {
      id: "open",
      label: "Open",
      prs: openPrs || [],
      emptyMsg: "No open pull requests at the moment.",
    },
    {
      id: "closed",
      label: "Closed",
      prs: closedPrs || [],
      emptyMsg: "No recently closed pull requests.",
    },
  ];

  return rawTabs
    .filter((tab) => tab.prs.length > 0)
    .map((tab) => ({
      id: tab.id,
      label: tab.label,
      badgeText: tab.prs.length > 1 ? String(tab.prs.length) : null,
      count: tab.prs.length,
      prs: tab.prs,
      emptyMsg: tab.emptyMsg,
    }));
}

export function extractPrNumber(url: string): string | null {
  const match = url.match(/\/pull\/(\d+)/);
  return match ? `#${match[1]}` : null;
}

export function parsePublicContributionsToWeeks(
  payload: unknown
): {
  totalContributions: number | null;
  weeks: ContributionWeek[];
} {
  if (!payload || typeof payload !== "object") {
    return { totalContributions: null, weeks: [] };
  }

  const record = payload as {
    total?: Record<string, unknown>;
    contributions?: Array<{
      date?: unknown;
      count?: unknown;
      level?: unknown;
    }>;
  };

  if (!Array.isArray(record.contributions) || record.contributions.length === 0) {
    return { totalContributions: null, weeks: [] };
  }

  const levelColors: Record<number, string> = {
    0: "#ebedf0",
    1: "#9be9a8",
    2: "#40c463",
    3: "#30a14e",
    4: "#216e39",
  };

  const days: ContributionDay[] = [];
  let sumCounts = 0;

  for (const item of record.contributions) {
    if (!item || typeof item.date !== "string") continue;
    const count = typeof item.count === "number" ? item.count : 0;
    const level = typeof item.level === "number" ? item.level : 0;
    sumCounts += count;
    days.push({
      date: item.date,
      contributionCount: count,
      color: levelColors[level] || "#ebedf0",
    });
  }

  if (days.length === 0) {
    return { totalContributions: null, weeks: [] };
  }

  const weeks: ContributionWeek[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push({
      contributionDays: days.slice(i, i + 7),
    });
  }

  const lastYearTotal =
    typeof record.total?.lastYear === "number"
      ? record.total.lastYear
      : sumCounts;

  return {
    totalContributions: lastYearTotal,
    weeks,
  };
}
