# Shrey Vats — Systems & Solana Engineering Portfolio Redesign

This plan outlines the architectural and visual transformation of Shrey Vats's developer portfolio into a restrained, editorial-grade engineering showcase centered on Rust, backend infrastructure, and Solana protocol development, backed by resilient server-side GitHub GraphQL and REST fallbacks.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product and technical decisions incorporate your confirmed preferences and codebase audit findings. Review and click **Proceed** to begin implementation.

- **Confirmed Decision 1 — Hybrid Real Repository Fetching + Curated Overrides**: We will dynamically fetch public repositories from `shreyvats01` via GitHub (using authenticated GraphQL when `GITHUB_TOKEN` is configured, and falling back cleanly to GitHub's public REST API when unauthenticated) and merge them with curated metadata and verified projects (such as **Lemon**, **Wiki Backend**, **Solana On-Chain Programs / ERC-4626 Vault & Escrow**, and **Token Launchpad**).
- **Confirmed Decision 2 — Contact & Custom Mail Domain Configuration**: The placeholder `shreyvats01@example.com` address will be removed. The Contact section and Command Palette will read from `NEXT_PUBLIC_CONTACT_EMAIL` (defaulting to `contact@shrey.online` / `https://contact.shrey.online` and supporting your Resend-powered `mail.shrey.online` endpoint configuration) while keeping direct links to GitHub, X, and LinkedIn always accessible.
- **Confirmed Decision 3 — Architectural Diagrams & Technical Spec Previews**: Featured projects will display bespoke, high-contrast SVG system architecture and protocol flow diagrams (e.g., Telegram-to-Solana RPC signer flow for Lemon, SQLx/WebSocket state pipeline for Wiki Backend, PDA vault accounting for Solana Programs) alongside problem statements, stack metadata, and independent Source and Live Demo actions.
- **Confirmed Decision 4 — Canonical Domain & Metadata Consistency**: Canonical URLs, OpenGraph, sitemap, robots, and JSON-LD Person schema will unify around `NEXT_PUBLIC_SITE_URL` with a consistent default origin (`https://shrey.online`).

---

## 1. Overview & Core Concept

- **What It Does**: Presents Shrey Vats's systems programming, backend architecture, and Solana engineering work through an editorial layout that prioritizes real code artifacts, architectural diagrams, engineering philosophy, and live open-source activity.
- **Target Audience / Persona**: Systems engineers, protocol teams, open-source maintainers, and technical founders evaluating depth of understanding in Rust, low-level execution, and distributed systems.
- **Key Value**: Replaces generic template placeholders and fragile API assumptions with a high-trust engineering monograph where every claim is paired with verifiable repositories, architectural schematics, and truthful telemetry.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Arrival & Orientation (Header + Editorial Hero)**:
   - Visitors land on a focused 3-zone header (`SV — Shrey Vats` brand mark, single-line anchor links for `Projects`, `About`, `Activity`, `Contact`, and a keyboard-accessible `Cmd/Ctrl+K` trigger + primary contact action).
   - The Hero introduces Shrey Vats's focus on Rust, backend systems, and Solana internals without relying on age as a gimmick, offering immediate primary actions to explore selected work or initiate contact.
2. **Technical Evaluation (Featured & Secondary Projects)**:
   - Visitors inspect Featured Work first, examining bespoke architectural schematics, problem statements, implementation notes, and verified repository metrics (`tabular-nums` stars, forks, primary language) with independent links for Source and Live Demo.
   - Additional repositories from `shreyvats01` are presented in a clean secondary index below the featured showcase.
3. **Engineering Philosophy & Capabilities (About & Technical Focus)**:
   - Visitors read a concise 3-paragraph narrative detailing how Shrey approaches systems beneath abstractions, coupled with a structured specification grid of core domains (Systems & Rust, Solana & On-Chain Programs, Backend & Infrastructure).
4. **Open-Source Proof (GitHub Activity & Pull Requests)**:
   - Visitors review contribution totals, a responsive 52-week contribution heatmap with keyboard-focusable cells and date/count tooltips, and filterable Pull Request tabs (`Merged`, `Open`, `Closed`) with explicit semantic icons and graceful fallback states when offline or unauthenticated.
5. **Direct Outreach (Contact & Command Palette)**:
   - Visitors reach out via the configured `shrey.online` contact address/endpoint or social channels, or press `Cmd/Ctrl+K` from anywhere to jump to sections, inspect repositories, or copy/trigger contact details.

### Visual Identity & Theme

- **Aesthetic Direction**: Utilitarian editorial monograph—crisp hairline borders, deep carbon-slate surfaces, technical schematics, and disciplined negative space.
- **Color Palette & Mood** (60-30-10 allocation):
  - **60% Dominant Canvas**: Deep carbon (`#0B0D0F` / `--background`) with high-contrast primary text (`#F1F5F9` / `--foreground`) and optical readability tuning (`#A1AAB6` secondary prose, `#788391` technical metadata).
  - **30% Structural Surfaces**: Elevated slate cards (`#12161B` / `--card`), secondary wells (`#171C22` / `--secondary`), and crisp `1px` borders (`#242A31` / `--border`).
  - **10% Restrained Accent**: Signal lime (`#B7F36B` / `--primary`) reserved strictly for focus-visible rings, active tab indicators, primary interactive highlights, and upper-tier heatmap intensity. Semantic PR states remain distinct (Merged purple, Open emerald, Closed rose-slate).
- **Typography & Hierarchy**:
  - **Display & Headings**: `Geist Sans` with fluid scaling (`clamp(2.25rem, 4.5vw, 4.25rem)` for hero headline, `1.75rem–2.25rem` for section headers, `text-wrap: balance`, tight tracking).
  - **Body Prose**: `Geist Sans` at `16px–17px` with `1.65` line-height and `65ch` measure for comfortable reading.
  - **Technical Metadata & Schematics**: `Geist Mono` (`11px–13px`, `tabular-nums`) for stack tags (unboxed inline text with `·` separators or subtle technical cells), commit/PR timestamps, and architecture diagram annotations.
- **Component Styling & Layout**:
  - Max-width `1080px` (`max-w-5xl`) editorial container with a 12-column internal grid, `1px` structural hairlines, and zero nested card-in-card clutter.
  - No thick left accent borders (`border-l-2` removed from project impact statements), no pulsing decorative green dots, and no overflowing pill clusters.
- **Interactive Feedback & Motion**:
  - `150ms–200ms` transitions on `transform` and `opacity` only.
  - Full `prefers-reduced-motion` support across the `CountUp` statistics ticker, section entrances, and hover states.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Resilient Dual-Mode GitHub Data Layer (GraphQL + Public REST Fallback)**
  - *Chosen Approach*: Parameterize GraphQL queries with variables, validate `owner/name` slugs, batch repository metadata inside a single query, and fall back to GitHub's unauthenticated public REST endpoints (`/users/shreyvats01`, `/users/shreyvats01/repos`, `/search/issues`) if `GITHUB_TOKEN` is absent or rate-limited—while explicitly tagging the response status (`live`, `partial`, or `unavailable`) so missing data never masquerades as `0`.
  - *Why*: Guarantees the portfolio renders real repository stars, languages, and PRs even in local/preview environments without a secret token, and prevents silent zero-value falsification if GitHub is unreachable.
  - *Alternatives Considered*: Failing to `0` on missing `GITHUB_TOKEN` (rejected: violates truthfulness criteria and makes local/preview builds look empty).
- **Decision 2 — Inline SVG Architectural Diagrams for Featured Work**
  - *Chosen Approach*: Render deterministic, accessible SVG architecture diagrams tailored to each featured system (e.g., Solana PDA state flow, Rust async worker pipeline, Telegram wallet signer bridge) directly inside featured project cards.
  - *Why*: Aligns with the editorial systems-engineering aesthetic, scales cleanly at any DPI without CLS, and communicates real system topology rather than decorative stock imagery.
  - *Alternatives Considered*: Generic gradient thumbnails or fake terminal windows (rejected: explicitly prohibited by design constraints).
- **Decision 3 — Configurable `shrey.online` Contact & Mail Integration**
  - *Chosen Approach*: Centralize site identity, canonical domain (`https://shrey.online`), contact email (`NEXT_PUBLIC_CONTACT_EMAIL` defaulting to `contact@shrey.online`), and optional Resend mail endpoint (`NEXT_PUBLIC_MAIL_ENDPOINT` supporting `https://mail.shrey.online` / `https://contact.shrey.online`) in a typed configuration module.
  - *Why*: Eliminates the hardcoded `shreyvats01@example.com` bug across both the Contact section and Command Palette while supporting your custom `contact.shrey.online` and `mail.shrey.online` infrastructure out of the box.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        Next.js App Router (Server)                           │
│                                                                              │
│  ┌────────────────────────────────────┐   ┌───────────────────────────────┐  │
│  │     GitHub Data Service            │   │   Portfolio Config & Data     │  │
│  │  • Parameterized GraphQL Query     │   │  • Curated Project Specs      │  │
│  │  • Public REST API Fallback        │   │  • Architecture Diagram Specs │  │
│  │  • Status: live | partial | error  │   │  • Contact & Domain Config    │  │
│  └─────────────────┬──────────────────┘   └───────────────┬───────────────┘  │
│                    └──────────────────┬───────────────────┘                  │
│                                       ▼                                      │
│                    ┌──────────────────────────────────────┐                  │
│                    │       Home Page Server Assembly      │                  │
│                    │  Merges live repo metrics with       │                  │
│                    │  curated overrides & status flags    │                  │
│                    └──────────────────┬───────────────────┘                  │
└───────────────────────────────────────┼──────────────────────────────────────┘
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                               ▼
┌───────────────────────┐   ┌───────────────────────┐   ┌──────────────────────┐
│ Navigation & Command  │   │   Editorial Content   │   │  Activity & Outreach │
│ • Compact Top Header  │   │ • Hero Section        │   │ • StatsBar (CountUp) │
│ • Mobile Nav Drawer   │   │ • Featured Projects   │   │ • Accessible Heatmap │
│ • CommandPalette (⌘K) │   │   + System Diagrams   │   │ • PR Tabs & States   │
│   Platform-aware keys │   │ • Secondary Repo Grid │   │ • Contact & Resend   │
│   & Contact actions   │   │ • About & Principles  │   │   Link / Copy Action │
└───────────────────────┘   └───────────────────────┘   └──────────────────────┘
```

### Data Model & State

- **`GithubFetchResult`**:
  - `status`: `'authenticated' | 'public_fallback' | 'unavailable'`
  - `stats`: Nullable numeric fields (`mergedPrsCount: number | null`, `totalContributions: number | null`, `reposCount: number | null`, `totalStars: number | null`) so the UI renders `"—"` with an explanatory status note when unavailable rather than a false `0`.
  - `weeks`: Contribution calendar array (with explicit empty/unavailable distinction).
  - `prs`: `{ merged: PRNode[]; open: PRNode[]; closed: PRNode[] }`.
  - `repositories`: Map of `owner/name` to `{ stargazerCount, forkCount, primaryLanguage, description, homepageUrl, updatedAt }` used to enrich Featured Projects without N+1 per-card API requests.
- **`ProjectSpec`**:
  - Combines verified repository identifiers (`shreyvats01/lemon`, `shreyvats01/wiki-backend`, `shreyvats01/solana-programs`, `shreyvats01/token-launchpad`, plus dynamically discovered active repos) with structured `tagline`, `problem`, `architectureSummary`, `diagramType`, `tags`, `repoUrl`, and verified `demoUrl`.

### Interactive Component & State Mapping

- **Header & Mobile Navigation**:
  - Desktop displays the 3-zone top bar with smooth anchor scrolling (`scroll-margin-top` on all target sections) and a keyboard shortcut button that opens the Command Palette.
  - Mobile provides a clean, accessible toggle menu with focus management, Escape-to-close, and automatic closure on route/anchor selection.
- **Featured & Secondary Project Cards**:
  - Separate, non-overlapping interactive links for **Source Code** (`github.com/...`) and **Live Demo** (rendered only when a verified URL exists) so card clicks never trap or block secondary actions.
  - Interactive diagram toggle or inspection view allowing visitors to switch between the architectural schematic and key technical invariants.
- **StatsBar & CountUp**:
  - Checks `window.matchMedia('(prefers-reduced-motion: reduce)')`; if enabled, renders the final value immediately.
  - Uses `requestAnimationFrame` with a bounded `750ms` cubic ease-out curve and clean unmount cancellation. Displays `"—"` if a metric is `null` (unavailable).
- **Contribution Heatmap**:
  - Renders keyboard-focusable day cells (`tabIndex={0}`, `role="gridcell"`, `aria-label="X contributions on Date"`) with distinct styling for `0` contributions (`#161B22` with subtle border) vs. 4-tier lime intensity levels.
  - Includes a live selected/focused day readout bar below the grid so touch devices and keyboard users can inspect any day without relying solely on mouse hover.
- **Pull Requests Section (`PrSection`)**:
  - Accessible segmented tabs (`Merged`, `Open`, `Closed`) with count badges, distinct status icons (`GitMerge`, `CircleDot`, `CircleSlash`), human-readable relative/short dates, and clear differentiation between "No open pull requests" and "Pull request data temporarily unavailable".
- **Contact Section & Command Palette**:
  - Provides direct one-click email launch (`mailto:` or `contact.shrey.online`), a **Copy Email** button with instant visual confirmation (`Copied to clipboard`), and direct links to GitHub, X, and LinkedIn.
  - Command Palette detects macOS vs. Windows/Linux (`⌘K` vs `Ctrl K`), supports jumping to all page sections (`#projects`, `#about`, `#activity`, `#contact`), opening featured repositories, and triggering contact actions.
