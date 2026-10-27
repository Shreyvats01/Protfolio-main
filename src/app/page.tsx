import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getGithubPortfolioData } from "@/lib/github";
import { siteConfig } from "@/lib/site-config";
import { ProjectCard, type ProjectEntry } from "@/components/project-card";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons";
import projectsData from "@/data/projects.json";

export default async function HomePage() {
  const githubData = await getGithubPortfolioData(siteConfig.handle);
  const featuredProjects = (projectsData as ProjectEntry[])
    .filter((project) => project.featured)
    .slice(0, 3);

  return (
    <div className="space-y-14 sm:space-y-20">
      {/* Section 1: Hero */}
      <section aria-labelledby="hero-heading" className="space-y-5 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4 max-w-2xl">
          <h1
            id="hero-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground"
          >
            {siteConfig.name}
          </h1>
          <p className="text-sm sm:text-lg leading-relaxed text-muted-foreground">
            {siteConfig.heroIntro}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-1">
          <div className="flex items-center gap-3">
            <Link
              href="/projects"
              className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>View Projects</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 font-mono text-xs font-medium text-foreground transition-colors hover:border-[#36404B] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>Contact</span>
            </Link>
          </div>

          <div className="flex items-center gap-5 border-t border-border/60 pt-3 sm:border-t-0 sm:pt-0 font-mono text-xs text-muted-foreground">
            <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="inline-flex items-center gap-1.5 py-1 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              <GithubIcon className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <a
              href={siteConfig.socials.x}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X profile"
              className="inline-flex items-center gap-1.5 py-1 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              <TwitterIcon className="h-4 w-4" />
              <span>X</span>
            </a>
            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex items-center gap-1.5 py-1 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              <LinkedinIcon className="h-4 w-4" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </section>

      {/* Section 2: Featured Projects (Max 3) */}
      <section
        aria-labelledby="featured-projects-heading"
        className="space-y-5 sm:space-y-6 border-t border-border pt-10 sm:pt-12"
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="featured-projects-heading"
            className="text-lg sm:text-xl font-semibold tracking-tight text-foreground"
          >
            Featured Projects
          </h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 py-1 font-mono text-xs text-primary hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm shrink-0"
          >
            <span>View all projects</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              repoStats={
                githubData.repoMap[project.repo.toLowerCase()] || null
              }
            />
          ))}
        </div>
      </section>

      {/* Section 3: Small About Preview */}
      <section
        aria-labelledby="about-preview-heading"
        className="space-y-3 border-t border-border pt-10 sm:pt-12 max-w-2xl"
      >
        <h2
          id="about-preview-heading"
          className="text-lg sm:text-xl font-semibold tracking-tight text-foreground"
        >
          About
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
          {siteConfig.aboutPreview}
        </p>
        <div className="pt-1">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 py-1 font-mono text-xs font-medium text-primary hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            <span>More about how I work</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Section 4: Small Contact Invitation */}
      <section
        aria-labelledby="contact-preview-heading"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-border bg-card p-5 sm:p-6"
      >
        <div className="space-y-1 max-w-xl">
          <h2
            id="contact-preview-heading"
            className="text-base font-semibold text-foreground"
          >
            Get in touch
          </h2>
          <p className="text-sm text-muted-foreground">
            {siteConfig.contactIntro}
          </p>
        </div>

        <Link
          href="/contact"
          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md bg-secondary border border-border px-4 py-2 font-mono text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0 self-start sm:self-center"
        >
          <span>Contact page</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
