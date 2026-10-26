import React from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUp, ArrowUpRight } from "lucide-react";
import { getGithubPortfolioData, type RepoMetadata } from "@/lib/github";
import { siteConfig } from "@/lib/site-config";
import { Header } from "@/components/header";
import { ProjectCard, type ProjectEntry } from "@/components/project-card";
import { StatsBar } from "@/components/stats-bar";
import { Heatmap } from "@/components/heatmap";
import { PrSection } from "@/components/pr-section";
import { ContactSection } from "@/components/contact-section";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons";
import projectsData from "@/data/projects.json";

export default async function Home() {
  const githubData = await getGithubPortfolioData(siteConfig.handle);

  const curatedProjects: ProjectEntry[] = projectsData;
  const featuredProjects = curatedProjects.filter((p) => p.featured);
  const secondaryCurated = curatedProjects.filter((p) => !p.featured);

  // Merge any additional live non-fork repositories from shreyvats01 not already in curated list
  const curatedSlugs = new Set(
    curatedProjects.map((p) => p.repo.toLowerCase())
  );

  const dynamicExtraProjects: ProjectEntry[] = githubData.discoveredRepos
    .filter(
      (repo) =>
        !curatedSlugs.has(repo.nameWithOwner.toLowerCase()) &&
        repo.name.toLowerCase() !== siteConfig.handle.toLowerCase() &&
        repo.name.toLowerCase() !== "protfolio" &&
        repo.name.toLowerCase() !== "portfolio"
    )
    .slice(0, 4)
    .map((repo) => ({
      id: `gh-${repo.name}`,
      title: repo.name,
      tagline: repo.primaryLanguage
        ? `${repo.primaryLanguage.name} repository`
        : "Public repository",
      description:
        repo.description ||
        `Open-source repository (${repo.nameWithOwner}) maintained on GitHub.`,
      impact: "Public source repository on GitHub.",
      repo: repo.nameWithOwner,
      projectUrl: repo.url,
      demoUrl: repo.homepageUrl || "",
      tags:
        repo.languages.length > 0
          ? repo.languages.map((l) => l.name)
          : repo.primaryLanguage
          ? [repo.primaryLanguage.name]
          : ["Open Source"],
      featured: false,
    }));

  const secondaryProjects = [...secondaryCurated, ...dynamicExtraProjects];

  const getEnrichedRepo = (slug: string): RepoMetadata | null => {
    if (!slug) return null;
    return githubData.repoMap[slug.toLowerCase()] || null;
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main
        id="main-content"
        className="flex-1 mx-auto w-full max-w-5xl px-6 py-16 md:py-24 space-y-24 md:space-y-32"
      >
        {/* B. Editorial Hero Section */}
        <section
          aria-labelledby="hero-heading"
          className="space-y-8 border-b border-border pb-16 md:pb-20"
        >
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#788391]">
            <span className="text-primary">SYSTEMS &amp; PROTOCOL ENGINEERING</span>
            <span aria-hidden="true">·</span>
            <span>RUST / SOLANA / BACKEND</span>
            <span aria-hidden="true">·</span>
            <span>{siteConfig.location.toUpperCase()}</span>
          </div>

          <div className="space-y-6 max-w-3xl">
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground leading-[1.08] text-balance"
            >
              {siteConfig.name}
            </h1>

            <p className="text-lg md:text-xl leading-relaxed text-[#CBD5E1] max-w-2xl">
              {siteConfig.intro}
            </p>

            <p className="font-mono text-xs md:text-sm text-[#788391] leading-relaxed max-w-2xl">
              Focus:{" "}
              <span className="text-muted-foreground">
                {siteConfig.currentFocus}
              </span>
            </p>
          </div>

          {/* Primary Actions & Social Links */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-mono text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0"
              >
                <span>Explore Selected Work</span>
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-4 py-2.5 font-mono text-xs font-medium text-foreground transition-colors hover:border-[#36404B] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0"
              >
                <span>Get in Touch</span>
              </a>
            </div>

            <div className="flex items-center gap-5 font-mono text-xs text-muted-foreground">
              <Link
                href={siteConfig.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shrey Vats on GitHub"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                <GithubIcon className="h-4 w-4" />
                <span>GitHub</span>
              </Link>
              <Link
                href={siteConfig.socials.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shrey Vats on X (Twitter)"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                <TwitterIcon className="h-4 w-4" />
                <span>X</span>
              </Link>
              <Link
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shrey Vats on LinkedIn"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                <LinkedinIcon className="h-4 w-4" />
                <span>LinkedIn</span>
              </Link>
            </div>
          </div>
        </section>

        {/* C. Featured Projects & Secondary Open-Source Index */}
        <section
          id="projects"
          aria-labelledby="projects-heading"
          className="space-y-12"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-2">
              <span className="font-mono text-xs text-primary">
                01 · Selected Work &amp; Architecture
              </span>
              <h2
                id="projects-heading"
                className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground"
              >
                Systems &amp; Protocol Implementations
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Each featured project pairs problem context with system topology
              and direct source links.
            </p>
          </div>

          {/* Featured Projects Stack */}
          <div className="space-y-8">
            {featuredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                repoStats={getEnrichedRepo(project.repo)}
                index={idx}
              />
            ))}
          </div>

          {/* Secondary Work Grid */}
          {secondaryProjects.length > 0 && (
            <div className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs uppercase tracking-wider text-[#788391]">
                  Additional Repositories &amp; Tooling
                </h3>
                <Link
                  href={`${siteConfig.socials.github}?tab=repositories`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                >
                  <span>All GitHub repositories</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {secondaryProjects.map((project, idx) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    repoStats={getEnrichedRepo(project.repo)}
                    index={featuredProjects.length + idx}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* D. Substantive About Section */}
        <section
          id="about"
          aria-labelledby="about-heading"
          className="space-y-10 border-t border-border pt-16"
        >
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-2">
              <span className="font-mono text-xs text-primary">
                02 · Engineering Approach
              </span>
              <h2
                id="about-heading"
                className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground"
              >
                How I think about software &amp; systems
              </h2>
              <p className="font-mono text-xs text-[#788391] pt-1">
                Based in {siteConfig.location} · Open-source contributor
              </p>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground max-w-[65ch]">
                <p className="text-[#CBD5E1]">
                  My interest in programming started with curiosity about what
                  happens after code compiles—how bytes are laid out in memory,
                  how network sockets multiplex concurrent connections, and how
                  distributed ledgers enforce state transitions without a central
                  coordinator.
                </p>
                <p>
                  That curiosity drew me to{" "}
                  <strong className="font-medium text-foreground">Rust</strong>{" "}
                  and the{" "}
                  <strong className="font-medium text-foreground">
                    Solana Virtual Machine (SVM)
                  </strong>
                  . Writing on-chain programs and low-level backend services forces
                  explicit thinking upfront: ownership and lifetimes are checked
                  at compile time, every account passed into an instruction must
                  be validated against deterministic Program Derived Addresses,
                  and compute budgets reward tight data structures.
                </p>
                <p>
                  I learn best by building end-to-end prototypes and reading
                  production open-source codebases—whether implementing an
                  ERC-4626 tokenized vault standard in Rust, wiring real-time
                  WebSocket state synchronization over PostgreSQL, or bridging
                  Telegram interfaces with Solana transaction signing. Note that
                  while I started exploring systems programming early (at 16), my
                  focus is strictly on engineering rigor and shipping dependable
                  software.
                </p>
              </div>

              {/* Engineering Principles */}
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                {siteConfig.principles.map((principle, i) => (
                  <div
                    key={principle.title}
                    className="rounded-lg border border-border bg-card p-4 space-y-2"
                  >
                    <span className="font-mono text-xs text-primary">
                      0{i + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">
                      {principle.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {principle.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* E. Technical Domains & Stack Architecture */}
        <section
          id="systems"
          aria-labelledby="systems-heading"
          className="space-y-8 border-t border-border pt-16"
        >
          <div className="space-y-2">
            <span className="font-mono text-xs text-primary">
              03 · Technical Capabilities
            </span>
            <h2
              id="systems-heading"
              className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground"
            >
              Core Domains &amp; Tooling
            </h2>
          </div>

          <div className="divide-y divide-border rounded-lg border border-border bg-card">
            {siteConfig.domains.map((domain) => (
              <div
                key={domain.index}
                className="grid gap-6 p-6 md:p-8 lg:grid-cols-12 lg:items-center"
              >
                <div className="lg:col-span-4 space-y-1">
                  <span className="font-mono text-xs text-primary">
                    {domain.index}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {domain.title}
                  </h3>
                </div>

                <div className="lg:col-span-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {domain.summary}
                  </p>
                </div>

                <div className="lg:col-span-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-[#CBD5E1]">
                  {domain.stack.map((item, idx) => (
                    <React.Fragment key={item}>
                      <span>{item}</span>
                      {idx < domain.stack.length - 1 && (
                        <span aria-hidden="true" className="text-[#475260]">
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* F. GitHub Activity and Statistics */}
        <section
          id="activity"
          aria-labelledby="activity-heading"
          className="space-y-8 border-t border-border pt-16"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="font-mono text-xs text-primary">
                04 · Open-Source Telemetry
              </span>
              <h2
                id="activity-heading"
                className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground"
              >
                GitHub Activity &amp; Pull Requests
              </h2>
            </div>

            <div className="font-mono text-xs text-[#788391]">
              <span>@{siteConfig.handle}</span>
              <span aria-hidden="true"> · </span>
              <span>{githubData.statusMessage}</span>
            </div>
          </div>

          <StatsBar
            prs={githubData.stats.prs}
            contributions={githubData.stats.contributions}
            repos={githubData.stats.repos}
            stars={githubData.stats.stars}
          />

          <Heatmap weeks={githubData.weeks} status={githubData.status} />

          <PrSection
            openPrs={githubData.openPrs}
            closedPrs={githubData.closedPrs}
            mergedPrs={githubData.mergedPrs}
            status={githubData.status}
          />
        </section>

        {/* G. Dedicated Contact Section */}
        <ContactSection />
      </main>

      {/* H. Restrained Footer */}
      <footer className="border-t border-border bg-[#0B0D0F]">
        <div className="mx-auto flex max-w-5xl flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-6 py-8 text-xs text-[#788391] font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-foreground">
              {siteConfig.monogram} — {siteConfig.name}
            </span>
            <span aria-hidden="true">·</span>
            <span>© {new Date().getFullYear()}</span>
            <span aria-hidden="true">·</span>
            <span>Rust &amp; Solana Engineering</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <a
              href="#projects"
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              Projects
            </a>
            <a
              href="#about"
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              About
            </a>
            <a
              href="#activity"
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              Activity
            </a>
            <Link
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              GitHub
            </Link>
            <Link
              href={siteConfig.socials.x}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              X
            </Link>
            <Link
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              LinkedIn
            </Link>
            <a
              href="#top"
              aria-label="Scroll back to top"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              <span>Top</span>
              <ArrowUp className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
