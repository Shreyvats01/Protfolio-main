# Mobile Responsiveness Overhaul & Project Card Cleanup

This plan removes the unnecessary 3-node flow box from project cards across the homepage and `/projects` catalogue, introduces a mobile-native vertical architecture breakdown for `/projects/[slug]` detail pages, and resolves mobile viewport spacing, touch target, and grid border issues across `320px–430px` screens.

## User Review & Critical Decisions

> [!IMPORTANT]
> Review the confirmed changes below and click **Proceed** to apply them across the codebase.

- **Confirmed Decision 1 — Remove Flow Box from All Project Cards**: The `[ Telegram Update ] → [ Tokio Signer ] → [ Solana RPC ]` preview box (and redundant sub-caption) will be removed from all project cards on both `/` and `/projects`, leaving a clean, well-proportioned card with Category, Title, Summary, Stack Tags, and Action Links.
- **Confirmed Decision 2 — Mobile Vertical Architecture Stack on `/projects/[slug]`**: Horizontal 640px SVG diagrams become illegibly small when shrunk to a 320px–375px phone screen. On mobile (`< 640px`), `/projects/[slug]` will render a structured vertical step-by-step architecture flow, while tablet and desktop (`≥ 640px`) continue displaying the full SVG schematic.
- **Confirmed Decision 3 — Mobile Viewport & Touch Ergonomics (`320px–430px`)**:
  - **Container Padding & Vertical Rhythm**: Reduce mobile horizontal padding from `px-6` (`24px`) to `px-4` (`16px`) and tighten vertical spacing so content fits naturally on narrow phones without wasted margins.
  - **Header & Command Trigger**: Hide the desktop-only `⌘K` keycap badge on mobile screens in favor of a clean touch-sized search icon button (`40×40px`) alongside the mobile menu toggle, with `44px`-tall touch rows in the mobile drawer.
  - **StatsBar 2×2 Mobile Grid Borders**: Fix the broken `divide-y` border on mobile 2-column grids where the top-right cell had an unintended top border.
  - **Footer Wrapping**: Remove the inline `|` pipe character that wraps awkwardly on mobile and separate page navigation from social profiles cleanly.

---

## 1. Overview & Core Concept

- **What It Does**: Eliminates visual clutter inside project cards and ensures every route (`/`, `/projects`, `/projects/[slug]`, `/about`, `/contact`, `/activity`) fits comfortably and reads effortlessly on mobile phones (`320px–430px`) as well as desktop monitors.
- **Target Audience / Persona**: Mobile and desktop visitors browsing projects, reading technical details, or reaching out on the go.
- **Key Value**: Cleaner project cards on the homepage and catalogue, readable system architecture flows on mobile screens, and zero awkward wrapping or cramped containers.

---

## 2. User Experience & Visual Design

### Mobile Layout Improvements

1. **Cleaner Project Cards (`/` & `/projects`)**:
   - Removes the boxed 3-node flow strip and secondary one-liner.
   - Uses `p-4 sm:p-6` padding so text has generous breathing room on 320px–375px screens.
   - Ensures footer links (`Project details →` and `Source ↗`) have comfortable tap spacing.
2. **Mobile-Friendly Architecture Diagrams (`/projects/[slug]`)**:
   - **Mobile (`< 640px`)**: Displays a vertical sequence of numbered stage cards connected by downward arrows (`↓`), showing each component name, role, and protocol detail at full 13px–14px legibility.
   - **Desktop (`≥ 640px`)**: Displays the full horizontal SVG architecture schematic.
3. **Header, Hero & Footer Mobile Fit**:
   - **Header**: Compact `56px` mobile height with `px-4 sm:px-6`, a clean search icon trigger, and a full-width mobile drawer with `44px` minimum tap targets.
   - **Hero**: Responsive type scale (`text-2xl sm:text-4xl md:text-5xl`), full-width or cleanly grouped primary action buttons on small screens, and a clean separator above social links on mobile.
   - **Footer**: Stacks navigation links and social links into two distinct rows on mobile without dangling `|` separators.
4. **Catalogue Filters & Activity Telemetry (`/projects` & `/activity`)**:
   - **Category Filters**: Horizontally scrollable single-line filter row on narrow mobile screens (`overflow-x-auto no-scrollbar`) so filter buttons never wrap into uneven stacks.
   - **StatsBar**: True 2×2 grid border alignment on mobile (`border-b` on top row, `odd:border-r` between left and right columns) switching to a 4-column row on desktop.
   - **PR Tabs & Heatmap**: Compact tab triggers (`px-2.5 py-1.5 text-xs`) and stacked date/count readout on mobile.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Removing Card Previews in Favor of Typography & Whitespace**
  - *Chosen Approach*: Remove `ProjectDiagram` from `ProjectCard` altogether and keep diagrams exclusively on `/projects/[slug]`.
  - *Why*: On both mobile and desktop, repeating a 3-box diagram inside every card competed with the project summary and squeezed horizontally on narrow viewports.
- **Decision 2 — Responsive Dual-Render for System Diagrams**
  - *Chosen Approach*: Render structured HTML/CSS vertical step cards on `< 640px` (`sm:hidden`) and the SVG schematic on `≥ 640px` (`hidden sm:block`).
  - *Why*: SVG diagrams with fixed 640×160 coordinate spaces shrink text by more than 50% on a 320px viewport; native vertical cards preserve every technical detail at readable font sizes.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Responsive Component Adaptation Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     Responsive Viewport Breakpoints                      │
│          Mobile (320px – 639px)          Desktop (640px – 1440px+)       │
└────────────────────┬──────────────────────────────────┬──────────────────┘
                     │                                  │
                     ▼                                  ▼
┌────────────────────────────────────────┐ ┌───────────────────────────────┐
│ Mobile Layout Adaptations              │ │ Desktop Layout                │
│ • Container: px-4 py-10 space-y-14     │ │ • Container: px-6 py-20       │
│ • Header: Search icon + 44px Nav rows  │ │ • Header: Inline links + ⌘K   │
│ • ProjectCard: Clean text + tags only  │ │ • ProjectCard: Clean 2-col    │
│ • ProjectDiagram (/projects/[slug]):   │ │ • ProjectDiagram:             │
│   Vertical Step Cards (sm:hidden)      │ │   Full 640x160 SVG Schematic  │
│ • StatsBar: 2x2 cell borders           │ │ • StatsBar: 1x4 row dividers  │
│ • Footer: Stacked Nav + Social rows    │ │ • Footer: Single-row split    │
└────────────────────────────────────────┘ └───────────────────────────────┘
```
