import test from "node:test";
import assert from "node:assert/strict";
import {
  filterProjectsByCategory,
  getCategoryCounts,
  getAdjacentProjects,
  buildActivityStats,
  computeLanguageBreakdown,
  getVisiblePrTabs,
  extractPrNumber,
  parsePublicContributionsToWeeks,
} from "./portfolio-helpers";
import { isValidRepoSlug, type PullRequestNode, type RepoMetadata } from "./github";
import projectsData from "../data/projects.json";
import type { ProjectEntry } from "../components/project-card";

const projects = projectsData as ProjectEntry[];

const sampleRepos: RepoMetadata[] = [
  {
    name: "lemon",
    nameWithOwner: "shreyvats01/lemon",
    description: "Distributed task scheduler in Rust",
    url: "https://github.com/shreyvats01/lemon",
    homepageUrl: null,
    stargazerCount: 2,
    forkCount: 0,
    pushedAt: "2026-03-15T10:00:00Z",
    primaryLanguage: { name: "Rust", color: "#dea584" },
    languages: [{ name: "Rust", color: "#dea584" }],
  },
  {
    name: "solana-programs",
    nameWithOwner: "shreyvats01/solana-programs",
    description: "Anchor and Pinocchio programs",
    url: "https://github.com/shreyvats01/solana-programs",
    homepageUrl: null,
    stargazerCount: 0,
    forkCount: 0,
    pushedAt: "2026-02-10T10:00:00Z",
    primaryLanguage: { name: "Rust", color: "#dea584" },
    languages: [{ name: "Rust", color: "#dea584" }],
  },
  {
    name: "wiki-backend",
    nameWithOwner: "shreyvats01/wiki-backend",
    description: "Backend service in TypeScript",
    url: "https://github.com/shreyvats01/wiki-backend",
    homepageUrl: null,
    stargazerCount: 0,
    forkCount: 0,
    pushedAt: "2026-01-20T10:00:00Z",
    primaryLanguage: { name: "TypeScript", color: "#3178c6" },
    languages: [{ name: "TypeScript", color: "#3178c6" }],
  },
];

test("filterProjectsByCategory returns all projects for 'All' and filters accurately", () => {
  const all = filterProjectsByCategory(projects, "All");
  assert.equal(all.length, 5);

  const solana = filterProjectsByCategory(projects, "Solana");
  assert.equal(solana.length, 3);
  assert.ok(solana.every((p) => p.category === "Solana"));

  const backend = filterProjectsByCategory(projects, "Backend");
  assert.equal(backend.length, 1);
  assert.equal(backend[0]?.id, "wiki-backend");
});

test("getCategoryCounts computes exact project counts per category", () => {
  const categories = ["All", "Solana", "Backend", "Systems & Rust"] as const;
  const counts = getCategoryCounts(projects, categories);
  assert.deepEqual(counts, {
    All: 5,
    Solana: 3,
    Backend: 1,
    "Systems & Rust": 1,
  });
});

test("getAdjacentProjects returns previous and next projects accurately", () => {
  const first = getAdjacentProjects(projects, "lemon");
  assert.equal(first.previous, null);
  assert.equal(first.next?.id, "solana-programs");

  const middle = getAdjacentProjects(projects, "wiki-backend");
  assert.equal(middle.previous?.id, "solana-programs");
  assert.equal(middle.next?.id, "token-launchpad");

  const last = getAdjacentProjects(projects, "endroite");
  assert.equal(last.previous?.id, "token-launchpad");
  assert.equal(last.next, null);

  const unknown = getAdjacentProjects(projects, "non-existent");
  assert.equal(unknown.previous, null);
  assert.equal(unknown.next, null);
});

test("isValidRepoSlug validates owner/repo slugs cleanly", () => {
  assert.equal(isValidRepoSlug("shreyvats01/lemon"), true);
  assert.equal(isValidRepoSlug("shreyvats01/solana-programs"), true);
  assert.equal(isValidRepoSlug("invalid-slug"), false);
  assert.equal(isValidRepoSlug(""), false);
});

test("buildActivityStats replaces null, 0, or 1 metrics with live highlights", () => {
  const items = buildActivityStats(
    {
      repos: 43,
      contributions: null,
      prs: 6,
      stars: 1,
    },
    sampleRepos
  );

  assert.equal(items.length, 4);
  // repos (43) -> kept as number
  assert.equal(items[0]?.kind, "number");
  assert.equal(items[0]?.numericValue, 43);

  // contributions (null) -> replaced with Primary Stack highlight
  assert.equal(items[1]?.kind, "highlight");
  assert.equal(items[1]?.label, "Primary Stack");
  assert.equal(items[1]?.textValue, "Rust · TypeScript");

  // prs (6) -> kept as number
  assert.equal(items[2]?.kind, "number");
  assert.equal(items[2]?.numericValue, 6);

  // stars (1) -> replaced with Core Focus highlight instead of showing "1"
  assert.equal(items[3]?.kind, "highlight");
  assert.equal(items[3]?.label, "Core Focus");
  assert.equal(items[3]?.textValue, "Solana · Backend");
});

test("computeLanguageBreakdown aggregates and ranks languages accurately", () => {
  const breakdown = computeLanguageBreakdown(sampleRepos);
  assert.equal(breakdown.length, 2);
  assert.equal(breakdown[0]?.name, "Rust");
  assert.equal(breakdown[0]?.count, 2);
  assert.equal(breakdown[0]?.percentage, 67);
  assert.equal(breakdown[1]?.name, "TypeScript");
  assert.equal(breakdown[1]?.count, 1);
  assert.equal(breakdown[1]?.percentage, 33);
});

test("getVisiblePrTabs hides 0-count tabs and suppresses badgeText for 1-count tabs", () => {
  const makePr = (state: "MERGED" | "OPEN" | "CLOSED", idx: number): PullRequestNode => ({
    title: `PR ${idx}`,
    url: `https://github.com/shreyvats01/lemon/pull/${idx}`,
    state,
    createdAt: "2026-01-15T00:00:00Z",
    repository: { nameWithOwner: "shreyvats01/lemon" },
  });

  const tabs = getVisiblePrTabs({
    mergedPrs: [makePr("MERGED", 1), makePr("MERGED", 2), makePr("MERGED", 3)],
    openPrs: [makePr("OPEN", 4)],
    closedPrs: [],
  });

  // Closed (0) is hidden
  assert.equal(tabs.length, 2);
  assert.equal(tabs[0]?.id, "merged");
  assert.equal(tabs[0]?.badgeText, "3");
  // Open (1) has null badgeText so raw "1" is not displayed
  assert.equal(tabs[1]?.id, "open");
  assert.equal(tabs[1]?.badgeText, null);
});

test("extractPrNumber and parsePublicContributionsToWeeks normalize GitHub data cleanly", () => {
  assert.equal(
    extractPrNumber("https://github.com/shreyvats01/lemon/pull/42"),
    "#42"
  );
  assert.equal(extractPrNumber("https://github.com/shreyvats01/lemon"), null);

  const parsed = parsePublicContributionsToWeeks({
    total: { lastYear: 28 },
    contributions: Array.from({ length: 10 }, (_, idx) => ({
      date: `2026-01-${String(idx + 1).padStart(2, "0")}`,
      count: 2,
      level: 1,
    })),
  });

  assert.equal(parsed.totalContributions, 28);
  assert.equal(parsed.weeks.length, 2);
  assert.equal(parsed.weeks[0]?.contributionDays.length, 7);
  assert.equal(parsed.weeks[1]?.contributionDays.length, 3);
});
