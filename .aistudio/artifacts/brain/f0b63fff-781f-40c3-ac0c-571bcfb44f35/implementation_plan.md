# Shrey Vats — Multi-Route Dark Editorial Portfolio & Copy Refactor

This plan restructures the portfolio from a single overloaded page into a focused, multi-route Next.js App Router application (`/`, `/projects`, `/projects/[slug]`, `/about`, `/contact`, and `/activity`), eliminates light/washed-out UI component surfaces, and rewrites all project and bio copy in a natural, concise developer voice.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and design decisions incorporate your feedback and audit findings. Review and click **Proceed** to execute the refactor.

- **Confirmed Decision 1 — Dedicated `/activity` Route**: GitHub statistics, the 52-week contribution heatmap, and pull-request tabs move off the homepage to `/activity`, linked unobtrusively from the shared footer and Command Palette (`⌘K` / `Ctrl K`).
- **Confirmed Decision 2 — Two-Tier Project Previews (`/projects` & `/projects/[slug]`)**: Project cards on `/` and `/projects` display a compact, dark-themed schematic preview alongside a 15–35 word summary and 2–4 stack labels, while `/projects/[slug]` renders the full architecture diagram, plain-English overview, and key technical decisions.
- **Confirmed Decision 3 — Eliminating Light-Looking & Washed-Out UI Surfaces**:
  - **Root Causes Identified in Audit**:
    1. `TooltipContent` used `bg-foreground text-background`, which inverted to bright white (`#F1F5F9`) in dark mode.
    2. `DialogOverlay` used `bg-black/10` (nearly transparent) and `DialogContent` used `ring-foreground/10` instead of a solid `#12161B` surface and `#242A31` border.
    3. `TabsTrigger` and `Input`/`Textarea` used `dark:bg-input/30`, creating muddy translucent gray boxes.
  - **Fix**: All UI primitives (`tooltip`, `dialog`, `command`, `tabs`, `input`, `textarea`, `card`) will strictly bind to `#0B0D0F` (background), `#12161B` (main surface), `#171C22` (secondary surface), and `#242A31` (border).
- **Confirmed Decision 4 — Natural, Plain-English Copywriting**: All inflated buzzwords ("high-throughput", "zero-trust", "sub-millisecond", "deterministic") are replaced with direct, factual descriptions within strict word-count budgets.

---

## 1. Overview & Core Concept

- **What It Does**: Gives visitors an immediate, scannable overview on `/` (Hero, 3 Featured Projects, brief About preview, brief Contact link) and dedicated pages for browsing all projects (`/projects`), reading project breakdowns (`/projects/[slug]`), learning about Shrey's background (`/about`), getting in touch (`/contact`), or viewing open-source activity (`/activity`).
- **Target Audience / Persona**: Engineers and collaborators who value clarity, honest technical descriptions, and fast navigation over marketing walls of text.
- **Key Value**: Every page has a single clear purpose, consistent dark surfaces, and grounded copy that lets the code speak for itself.

---

## 2. User Experience & Visual Design

### Route Hierarchy & Content Budgets

1. **Shared Layout (`Header` & `Footer`)**:
   - **Header**: Compact top bar with `SV` wordmark (`/`), primary route links (`Projects`, `About`, `Contact`), a restrained `⌘K` Command Palette button, and an accessible mobile menu drawer that closes on route selection.
   - **Footer**: Minimal single-row footer with identity (`Shrey Vats`), secondary route links (`Projects`, `About`, `Activity`, `Contact`), and social links (`GitHub`, `X`, `LinkedIn`).
2. **Home (`/`) — Strict Preview Budget**:
   - **Hero**: Name (`Shrey Vats`), 25–35 word introduction (*"I'm Shrey Vats. I build software with Rust, TypeScript, and tools from the Solana ecosystem. I'm interested in how systems work under the surface."*), two actions (`View Projects` → `/projects`, `Contact` → `/contact`), and social links.
   - **Featured Work**: Exactly 3 featured projects (`Lemon`, `Solana Programs`, `Wiki Backend`) with compact schematic previews, 15–30 word summaries, 3–4 stack tags, a link to `/projects/[slug]`, a link to GitHub source, and a `"View all projects →"` link to `/projects`.
   - **About Preview**: 45–65 word summary of how Shrey learns and builds, paired with a `"More about me →"` link to `/about`.
   - **Contact Invitation**: 20-word invitation paired with a `"Get in touch →"` link to `/contact`.
3. **Project Catalogue (`/projects`)**:
   - Working client-side category filter bar (`All`, `Solana`, `Systems & Rust`, `Backend`).
   - 2-column responsive grid of curated projects (with compact schematic previews, 15–35 word summaries, 2–4 tags, `/projects/[slug]` detail link, and source link) followed by a compact list of additional public GitHub repositories.
4. **Project Detail (`/projects/[slug]`)**:
   - Back link to `/projects`, project title, category, stack tags, and direct Source / Demo links.
   - 40–80 word plain-English overview of what the project does and why it was built.
   - Full dark-themed SVG architecture diagram showing how components interact.
   - 2–3 concise technical notes (20–45 words each) explaining real implementation details (e.g., Tokio task handling, Anchor PDA validation, SQLx queries).
5. **About (`/about`)**:
   - 140–180 word personal introduction written in a natural voice.
   - Grouped technical capabilities (`Systems and Rust`, `Backend development`, `Solana and smart contracts`, `Frontend and developer tools`), each with a 1-sentence description and verified tools.
   - Short list of working habits with direct links to relevant `/projects/[slug]` pages.
6. **Contact (`/contact`)**:
   - Short 20-word introduction, direct `mailto:contact@shrey.online` link, one-click copy-email button, social links (`GitHub`, `X`, `LinkedIn`), and a clean message form that validates input and falls back honestly to `mailto:` if the external endpoint does not confirm delivery.
7. **GitHub Activity (`/activity`)**:
   - Houses the `StatsBar`, 52-week `Heatmap`, and `PrSection` tabs (`Merged`, `Open`, `Closed`) with honest fallback states when `GITHUB_TOKEN` is absent.

### Visual Identity & Dark Surface Audit

- **Centralized Dark Palette**:
  - Background: `#0B0D0F` (`--background`)
  - Main Surface (cards, dialogs, tooltips): `#12161B` (`--card`, `--popover`)
  - Secondary Surface (inputs, inactive tabs, subtle wells): `#171C22` (`--secondary`, `--muted`)
  - Border: `#242A31` (`--border`, `--input`)
  - Primary Text: `#F1F5F9` (`--foreground`)
  - Secondary Text: `#A1AAB6` (`--muted-foreground`)
  - Muted Text: `#788391`
  - Accent: `#B7F36B` (`--primary`)

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Multi-Page App Router Over Single-Page Scroll**
  - *Chosen Approach*: Split content into `/`, `/projects`, `/projects/[slug]`, `/about`, `/contact`, and `/activity`, with `generateStaticParams` on `/projects/[slug]`.
  - *Why*: Eliminates cognitive overload on the landing page, gives each project its own shareable URL, and keeps every page scannable in seconds.
- **Decision 2 — Compact Preview vs. Full Diagram Split**
  - *Chosen Approach*: Render a lightweight, minimal 3-node flow header preview on project cards while reserving the detailed multi-stage SVG diagram for `/projects/[slug]`.
  - *Why*: Gives project cards visual distinction on `/projects` without crowding the grid or repeating dense text.
- **Decision 3 — Grounded Copy Over Marketing Superlatives**
  - *Chosen Approach*: Rewrite all project data and bio paragraphs to state what each tool does first, what problem it addresses, and how it is built using plain technical nouns (e.g., "Uses SQLx and PostgreSQL to store tasks and broadcasts updates over WebSockets") instead of exaggerated claims.
  - *Why*: Builds genuine credibility with experienced engineers.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Route & Component Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     Root Layout (Header · Main · Footer)                     │
│        Shared Dark Theme (#0B0D0F / #12161B / #171C22 / #242A31)             │
└───────┬───────────────┬────────────────┬───────────────┬──────────────┬──────┘
        │               │                │               │              │
        ▼               ▼                ▼               ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐
│      /       │ │  /projects   │ │   /about    │ │  /contact   │ │ /activity  │
│ • Short Hero │ │ • Category   │ │ • 160w Bio  │ │ • Verified  │ │ • StatsBar │
│ • 3 Featured │ │   Filter Bar │ │ • 4 Skill   │ │   Email &   │ │ • Heatmap  │
│   Cards      │ │ • Curated    │ │   Groups    │ │   Copy Btn  │ │ • PR Tabs  │
│ • 50w About  │ │   Grid       │ │ • Working   │ │ • Socials   │ │   (Merged/ │
│   Preview    │ │ • Additional │ │   Habits +  │ │ • Validated │ │    Open/   │
│ • Contact    │ │   GH Repos   │ │   Links     │ │   Form      │ │    Closed) │
│   Link       │ └──────┬───────┘ └─────────────┘ └─────────────┘ └────────────┘
└──────────────┘        │
                        ▼
               ┌──────────────────┐
               │ /projects/[slug] │
               │ • 60w Overview   │
               │ • Full Dark SVG  │
               │   System Diagram │
               │ • Technical      │
               │   Decisions      │
               │ • Live GH Stats  │
               └──────────────────┘
```

### Interactive Component & State Mapping

- **Header (`Header`)**: Uses `usePathname()` from `next/navigation` to highlight the active route (`/`, `/projects`, `/about`, `/contact`), supports keyboard navigation, and closes the mobile drawer automatically on link click or `Escape`.
- **Project Catalogue Filter (`ProjectsCatalogue`)**: Client-side filter state (`All`, `Solana`, `Systems & Rust`, `Backend`) that filters curated projects cleanly with accessible `aria-pressed` buttons and a reset action if needed.
- **Command Palette (`CommandPalette`)**: Uses `router.push()` to navigate across real routes (`/`, `/projects`, `/about`, `/contact`, `/activity`, and individual `/projects/[slug]` pages), plus direct contact and social actions.
- **Contact Form (`ContactSection`)**: Validates email and message length, posts to the configured endpoint, checks HTTP status and JSON response before confirming delivery, and provides a one-click `mailto:` fallback when the external endpoint is unreachable or unverified.
