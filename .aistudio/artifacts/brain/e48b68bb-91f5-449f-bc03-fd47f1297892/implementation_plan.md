# GitHub Activity Page Redesign & Mobile Optimization

## User Review & Critical Decisions

- **Adaptive Summary Metrics (`0`, `1`, or Missing Data)**: Confirmed by user — when any GitHub summary metric (`Contributions`, `Stars`, `Pull Requests`, or `Repositories`) is unavailable (`null`) or `<= 1`, we will automatically replace that slot in the top summary bar with live engineering highlights derived from public repositories (such as **Primary Languages**: `Rust · TypeScript`, **Core Focus**: `Solana · Systems`, or **Latest Push**: live month/year cadence) rather than displaying `—`, `0`, or `1`.
- **Eliminating the `"Requires GITHUB_TOKEN"` Placeholder**: Confirmed by user — instead of showing a dead configuration warning box when `GITHUB_TOKEN` is absent, we will fetch the public 52-week contribution calendar from a public contributions endpoint and pair/fallback with an **Active Repository & Language Breakdown** view built from live public repository activity.
- **Mobile-First Pull Requests Layout**: Confirmed by user — we will fix the broken side-by-side flex orientation in the tabs container so the section stacks vertically across the full mobile viewport, automatically hide any status tab with `0` items (such as `Closed (0)`), and present pull requests as full-width stacked mobile cards with unboxed metadata and $\ge 44\text{px}$ touch targets.

---

## 1. Overview & Core Concept

The **Activity** page serves as live proof of engineering output across Rust, backend systems, and Solana protocols. Currently, three issues undermine its credibility on mobile and in tokenless environments:
1. **Low or Missing Metrics in the Top Summary Bar**: When `GITHUB_TOKEN` is not configured or a metric is `0` or `1`, showing `—` with `"Requires GITHUB_TOKEN"` or a lone `1` makes the portfolio appear unmaintained or sparse.
2. **Dead Centerpiece Box**: Without a private GraphQL token, the middle of the page renders an empty dashed box stating `"Contribution Calendar Requires GITHUB_TOKEN"`, wasting prime viewport space.
3. **Broken Mobile Pull Request Layout**: Because the underlying tabs primitive checks `data-horizontal:flex-col` while the library emits `data-orientation="horizontal"`, the tabs container defaults to `flex-row`. On a `390px` mobile screen, this squeezes the `"Recent Pull Requests"` header and tab switcher into a narrow left column while compressing the pull request cards into a cramped right column.

This redesign transforms the Activity page into a resilient, always-complete engineering ledger that adapts gracefully to available data and reads effortlessly on mobile screens (`320px–430px`) as well as desktop viewports.

---

## 2. User Experience & Visual Design

### Adaptive 4-Cell Engineering Summary Bar
- **High-Signal Metric Threshold (`> 1`)**: Numeric counters (`Public Repositories`, `Merged Pull Requests`, `Contributions (1yr)`, `Total Stars`) only render as numeric counters when their value is strictly greater than `1`.
- **Smart Highlight Substitution (`null`, `0`, or `1`)**: Any slot whose raw count is `null`, `0`, or `1` seamlessly converts into a live qualitative engineering highlight derived from the user's public repositories and portfolio metadata:
  - **Primary Stack**: Displays the top programming languages ranked by active public repositories (e.g., `Rust · TypeScript`) with a subtitle showing the active repository distribution.
  - **Architecture Focus**: Highlights core engineering domains (`Solana · Backend`) paired with protocol and systems focus areas.
  - **Latest Activity**: Computes the most recent repository push date across all public repositories (e.g., `Active · Mar 2026`) alongside the most recently updated repository name.
- **Zero Technical Jargon**: All references to `"Requires GITHUB_TOKEN"` or missing environment variables are completely removed from user-facing UI.

### Public Contribution Calendar & Active Repository Timeline Fallback
- **Public 52-Week Contribution Graph**: Even when `GITHUB_TOKEN` is not set in the environment, the server will retrieve public 52-week contribution counts so the interactive 52-week heatmap and yearly contribution total populate automatically.
- **Active Repository & Language Breakdown Fallback**: If the contribution calendar is ever unreachable or returns `<= 1` total contributions, the middle section automatically renders a **Recent Repository Activity & Language Breakdown** panel showing:
  - A proportional horizontal language bar and unboxed legend (`Rust`, `TypeScript`, `JavaScript`, etc.) calculated from live public repositories.
  - A chronological list of the most recently pushed public repositories with their description, primary language, and last-updated timestamp.

### Mobile-First Pull Requests Section
- **Full-Width Vertical Stacking**: Fixing the horizontal orientation selector on the tabs container ensures the section header and status filter bar sit cleanly above the full-width pull request cards on every viewport.
- **Dynamic Tab Pruning**: Status tabs (`Merged`, `Open`, `Closed`) with `0` pull requests are hidden automatically. If only a single status category has more than `1` pull request (or if an additional tab has only `1` item that would look sparse on its own), users can either switch between non-empty tabs or view a unified chronological list when only one category is populated.
- **Responsive Stacked PR Cards**:
  - On mobile (`< 640px`), each pull request card stacks vertically across the full width:
    - **Top Row**: Status icon + unboxed repository path (`owner/repo`) on the left, tabular date (`Jan 2026`) and external link arrow on the right.
    - **Bottom Row**: Full pull request title with comfortable line height (`leading-snug`) and a subtle inline `#number` reference.
  - Every card and tab trigger enforces a minimum `44px` touch target height with crisp focus-visible rings and zero static pill clutter.

---

## 3. Key Product Decisions & Trade-Offs

- **Threshold-Based Metric Replacement vs. Static Placeholders**: Showing `0` or `1` on a senior systems portfolio weakens perceived impact, while showing `—` looks broken. Replacing any `null` or `<= 1` metric with live, verifiable repository insights (top languages, active push cadence, core systems focus) keeps every cell informative and truthful.
- **Multi-Tier Public Data Strategy**: Relying solely on GitHub's authenticated GraphQL API leaves local previews and tokenless deployments with missing sections. Adding a public contribution calendar fetch plus a repository-activity fallback guarantees that the page always renders rich visual data with zero configuration required.
- **Hiding Empty Status Tabs**: Displaying `Closed (0)` adds visual noise on `390px` screens and forces users to tap into empty states. Filtering out zero-count tabs keeps the mobile tab bar compact and ensures every tap reveals meaningful work.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Server Data Layer (Revalidate 1h)                    │
│                                                                         │
│  1. Authenticated GraphQL (if GITHUB_TOKEN set)                         │
│  2. Public REST + Public Contributions API Fallback (no token needed)   │
│  3. Live Repository Aggregation (top languages, latest pushed repos)    │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                 Pure Transformation & Threshold Helpers                 │
│                                                                         │
│  • buildActivityStats(githubData) → Replaces null/0/1 with live signals │
│  • filterVisiblePrCategories(prs) → Prunes 0-count tabs & orders items  │
│  • computeLanguageBreakdown(repos) → Calculates language distribution   │
└───────┬───────────────────────────┬─────────────────────────────┬───────┘
        │                           │                             │
        ▼                           ▼                             ▼
┌───────────────────┐     ┌───────────────────────┐     ┌─────────────────┐
│     StatsBar      │     │  Heatmap / Repo Feed  │     │    PrSection    │
│ 4-Cell Grid with  │     │ 52-Week Calendar OR   │     │ Full-Width Tabs │
│ Smart Fallbacks   │     │ Active Repo Timeline  │     │ & Stacked Cards │
└───────────────────┘     └───────────────────────┘     └─────────────────┘
```

### Data Normalization & Pure Helper Logic
- **Public Contribution Enrichment**: When `GITHUB_TOKEN` is absent, the public fallback fetcher queries GitHub's public user profile, repositories, pull requests, and public 52-week contribution history in parallel, normalizing the response into the same `ContributionWeek[]` structure used by the GraphQL path.
- **Smart Summary Builder**: A pure helper inspects each candidate metric (`contributions`, `repos`, `prs`, `stars`). Any metric `> 1` is kept as a formatted numeric stat; any metric that is `null` or `<= 1` is replaced in priority order by deterministic highlights computed from `discoveredRepos` (`Primary Stack`, `Core Focus`, `Latest Push`, `Open Source Scope`).
- **Tabs Orientation Fix**: Updating the tabs root styling from `data-horizontal:flex-col` to `flex-col data-[orientation=vertical]:flex-row` ensures horizontal tabs always stack their trigger list above their content panel across mobile and desktop viewports.
