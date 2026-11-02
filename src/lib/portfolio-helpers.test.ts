import test from "node:test";
import assert from "node:assert/strict";
import {
  filterProjectsByCategory,
  getCategoryCounts,
  getAdjacentProjects,
} from "./portfolio-helpers";
import { isValidRepoSlug } from "./github";
import projectsData from "../data/projects.json";
import type { ProjectEntry } from "../components/project-card";

const projects = projectsData as ProjectEntry[];

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
