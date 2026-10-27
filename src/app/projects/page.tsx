import type { Metadata } from "next";
import { getGithubPortfolioData } from "@/lib/github";
import { siteConfig } from "@/lib/site-config";
import { ProjectsCatalogue } from "@/components/projects-catalogue";
import type { ProjectEntry } from "@/components/project-card";
import projectsData from "@/data/projects.json";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected Rust, Solana, and backend projects built by Shrey Vats.",
  alternates: {
    canonical: "/projects",
  },
};

export default async function ProjectsPage() {
  const githubData = await getGithubPortfolioData(siteConfig.handle);
  const curatedProjects = projectsData as ProjectEntry[];

  const curatedSlugs = new Set(
    curatedProjects.map((p) => p.repo.toLowerCase())
  );

  const extraRepos = githubData.discoveredRepos
    .filter(
      (repo) =>
        !curatedSlugs.has(repo.nameWithOwner.toLowerCase()) &&
        repo.name.toLowerCase() !== siteConfig.handle.toLowerCase() &&
        repo.name.toLowerCase() !== "protfolio" &&
        repo.name.toLowerCase() !== "portfolio"
    )
    .slice(0, 6);

  return (
    <div className="space-y-10">
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Projects
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
          Rust tools, Solana programs, and backend services I have built to
          learn how systems work.
        </p>
      </header>

      <ProjectsCatalogue
        projects={curatedProjects}
        repoMap={githubData.repoMap}
        extraRepos={extraRepos}
      />
    </div>
  );
}
