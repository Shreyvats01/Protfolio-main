"use client";

import { useEffect, useState } from "react";

export function CountUp({
  to,
  className,
}: {
  to: number | null;
  className?: string;
}) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (to === null || to <= 0) {
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    let animationFrameId: number;
    const duration = 650; // bounded, snappy duration in ms
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * to));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(to);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [to]);

  if (to === null) {
    return (
      <span className={className} title="Metric requires GitHub token or live connection">
        —
      </span>
    );
  }

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const displayValue = to === 0 || prefersReducedMotion ? to : count;

  return (
    <span className={className}>{displayValue.toLocaleString("en-US")}</span>
  );
}

export function StatsBar({
  prs,
  contributions,
  repos,
  stars,
}: {
  prs: number | null;
  contributions: number | null;
  repos: number | null;
  stars: number | null;
}) {
  const items = [
    {
      label: "Merged PRs",
      value: prs,
      note: prs === null ? "Unavailable" : "Public history",
    },
    {
      label: "Contributions (1y)",
      value: contributions,
      note:
        contributions === null ? "Requires GITHUB_TOKEN" : "52-week total",
    },
    {
      label: "Public Repositories",
      value: repos,
      note: repos === null ? "Unavailable" : "Non-forked sources",
    },
    {
      label: "Repository Stars",
      value: stars,
      note: stars === null ? "Unavailable" : "Across public work",
    },
  ];

  return (
    <dl className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border rounded-lg border border-border bg-card">
      {items.map((item) => (
        <div key={item.label} className="p-5 flex flex-col justify-between gap-2">
          <dt className="font-mono text-xs text-[#788391]">{item.label}</dt>
          <dd className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground font-mono tabular-nums">
            <CountUp to={item.value} />
          </dd>
          <span className="font-mono text-[11px] text-[#788391]">
            {item.note}
          </span>
        </div>
      ))}
    </dl>
  );
}
