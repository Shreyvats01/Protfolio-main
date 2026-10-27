import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Shrey Vats — technical interests in Rust, backend systems, and Solana.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="space-y-16">
      {/* Personal Introduction */}
      <section aria-labelledby="about-heading" className="space-y-6 max-w-2xl">
        <header className="space-y-2">
          <h1
            id="about-heading"
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground"
          >
            About
          </h1>
          <p className="font-mono text-xs text-[#788391]">
            {siteConfig.name} · {siteConfig.location}
          </p>
        </header>

        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
          {siteConfig.aboutBio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Grouped Technical Capabilities */}
      <section
        aria-labelledby="capabilities-heading"
        className="space-y-6 border-t border-border pt-12"
      >
        <div className="space-y-1">
          <h2
            id="capabilities-heading"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            Technical Capabilities
          </h2>
          <p className="text-sm text-muted-foreground">
            Tools and languages I use across my projects.
          </p>
        </div>

        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {siteConfig.skillGroups.map((group) => (
            <div
              key={group.title}
              className="grid gap-4 p-5 sm:grid-cols-12 sm:items-baseline"
            >
              <div className="sm:col-span-4">
                <h3 className="text-sm font-semibold text-foreground">
                  {group.title}
                </h3>
              </div>

              <div className="sm:col-span-8 space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {group.description}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-[#A1AAB6]">
                  {group.skills.map((skill, idx) => (
                    <React.Fragment key={skill}>
                      <span>{skill}</span>
                      {idx < group.skills.length - 1 && (
                        <span aria-hidden="true" className="text-[#788391]">
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Working Habits + Links to Relevant Projects */}
      <section
        aria-labelledby="habits-heading"
        className="space-y-6 border-t border-border pt-12"
      >
        <div className="space-y-1">
          <h2
            id="habits-heading"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            How I Work
          </h2>
          <p className="text-sm text-muted-foreground">
            What I focus on when learning and building software.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {siteConfig.workingHabits.map((habit) => (
            <div
              key={habit.title}
              className="flex flex-col justify-between rounded-lg border border-border bg-card p-5 space-y-4"
            >
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {habit.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {habit.description}
                </p>
              </div>

              <Link
                href={`/projects/${habit.projectSlug}`}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-primary hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm pt-2"
              >
                <span>See {habit.projectLabel}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
