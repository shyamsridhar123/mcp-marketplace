---
date: 2026-03-31
topic: ey-ux-reimagination
---

# UX Reimagination: EY Command Center Dark Mode Theme

## What We're Building

A complete UX overhaul of the MCP Marketplace platform applying **EY's brand identity** (Yellow #FFE600 on Dark Charcoal #2E2E38) with a redesigned navigation model, executive dashboard home, and improved cross-pillar flow. This transforms the platform from a generic "Nexus" tool into an **EY AI Agent Hub** with professional enterprise aesthetics.

### Problems Being Solved

From the visual UX audit:

1. **Navigation overflow** — 6 horizontal pillars + chevrons truncate on standard screens; "Intelligence" label gets cut off
2. **No user journey** — All 6 nav items are flat peers with no progression, starting point, or contextual breadcrumbs
3. **Disconnected pages** — Each page is a standalone island with the same header → stats → content layout
4. **Generic branding** — "Nexus" purple/violet theme has no client identity
5. **Missing landing context** — Marketplace as homepage doesn't set up the platform narrative for executives
6. **Inconsistent density** — Some pages are sparse (Intelligence), others are dense (Governance 5 tabs)

## Why This Approach

**EY Command Center** was chosen over two alternatives:

- **EY Theme + Nav Fix Only** — Rejected because it doesn't solve the disconnected page flow
- **Progressive Redesign** — Rejected because intermediate states feel incomplete for demo purposes

The full approach delivers a cohesive, demo-ready EY-branded experience in a single implementation pass.

## Key Decisions

### 1. EY Brand System — Design Tokens

Replace the current oklch-based violet theme with EY's authentic brand palette:

| Token | Current | EY Value | Purpose |
|-------|---------|----------|---------|
| `--background` | oklch(0.07 0 0) near-black | `#1A1A24` (EY Dark Navy) | Page background |
| `--card` | oklch(0.12 0 0) dark gray | `#2E2E38` (EY Charcoal) | Card backgrounds |
| `--accent` | oklch(0.65 0.18 280) violet | `#FFE600` (EY Yellow) | Primary accent, CTAs, active states |
| `--accent-foreground` | oklch(0.98 0 0) white | `#1A1A24` (dark text on yellow) | Text on accent backgrounds |
| `--secondary` | oklch(0.18 0 0) gray | `#3B3B47` (EY Warm Gray) | Secondary surfaces |
| `--muted-foreground` | oklch(0.60 0 0) gray | `#9898A0` (EY Mid Gray) | Secondary text |
| `--border` | oklch(0.22 0 0) | `#3B3B47` | Subtle borders |
| `--destructive` | red | `#FF6B6B` | Error states |
| `--success` | green | `#4CAF82` | Success/active |
| `--warning` | amber | `#FFB547` (EY warm amber) | Warning states |
| `--chart-1` | violet | `#FFE600` (EY Yellow) | Primary chart color |
| `--chart-2` | cyan | `#47C2E1` (EY Teal) | Secondary chart |
| `--chart-3` | green | `#4CAF82` (EY Green) | Tertiary chart |
| `--chart-4` | yellow | `#FFB547` (EY Amber) | Quaternary chart |
| `--chart-5` | orange | `#FF8C69` (EY Coral) | Quinary chart |

**Typography:** Replace Geist with EY Interstate font family (or fallback `system-ui, -apple-system, 'Segoe UI'` for demo).

**Logo:** Replace "N" Nexus mark with "EY" logo badge. Brand text becomes **"EY AI Agent Hub"**.

### 2. Navigation: Hybrid Sidebar + Top Bar

**Left Sidebar** (fixed, ~240px collapsed to ~64px):
- EY logo at top
- 7 navigation items (Dashboard home + 6 pillars):
  - 🏠 Dashboard (home — NEW)
  - 📦 Marketplace
  - 🤖 Agents
  - ⚡ Skills
  - 🔗 Orchestration
  - 🛡️ Governance
  - 🧠 Intelligence
- Settings at bottom
- User avatar and notification bell at bottom
- Collapsible to icon-only mode

**Top Bar** (contextual per pillar):
- Shows breadcrumb: `EY AI Agent Hub / Agents / Knowledge Worker Agent`
- Sub-navigation tabs when a pillar has multiple views (e.g., Governance: Policies | Blueprints | Approvals | Audit | Compliance)
- Quick actions bar (Search, Create agent, Notifications)

**Behavioral changes:**
- Sidebar highlight follows active pillar with EY Yellow left-border accent
- Hover shows pillar name tooltip when collapsed
- Sub-nav tabs only appear when needed (Governance has 5, Agents has none at list level)
- **Collapsible with memory**: User can toggle between expanded (~240px) and icon-only (~64px). Preference persisted in localStorage.
- **Canvas auto-collapse**: When entering `/canvas`, sidebar auto-collapses to icon-only to maximize horizontal space. Restores on exit.
- **Cross-pillar links**: Inline contextual chips/badges that link to related entities (e.g., agent card MCP badges are clickable, governance agent names link to agent detail)

### 3. Executive Dashboard Home (`/`)

New landing page replacing the marketplace as home. Shows cross-pillar KPIs and quick-action cards:

**KPI Row** (5 metrics):
- Total MCPs (19) with trend
- Active Agents (9/11) with health indicator
- Pending Approvals (4) with urgency indicator
- Compliance Score (overall %) 
- IQ Signals (15 active)

**Quick Action Cards** (2×3 grid linking to each pillar):
| Card | Metric | Quick Action |
|------|--------|-------------|
| Marketplace | 19 MCPs, 3 CRM, 4 Work IQ | "Browse MCPs →" |
| Agents | 11 agents, 9 active | "View Agents →" |
| Skills | 26 skills, 23 active | "Skill Library →" |
| Orchestration | 22 canvas nodes | "Open Canvas →" |
| Governance | 4 pending approvals, 5 blueprints | "Review Approvals →" |
| Intelligence | 15 signals, 92% confidence | "IQ Dashboard →" |

**Activity Feed** (right column or bottom):
- Recent platform activity (agent deployed, MCP approved, policy updated)
- Real-time signal preview from Intelligence

### 4. Page Flow: Drill-Down Pattern

Every pillar page follows a consistent structure:

```
Sidebar > Pillar Page (list/overview) > Detail Page (entity detail)
```

With breadcrumbs: `Dashboard / Agents / Sales Rep Agent / Blueprint`

**Cross-pillar links:**
- Agent card → click MCP badge → opens MCP detail
- Governance blueprint → click agent count → filtered agent list
- Intelligence signal → click agent name → agent observability tab
- Marketplace MCP → click "N agents connected" → filtered agent list

### 5. Marketplace Moves to Sub-Page

Marketplace becomes `/marketplace` instead of `/`. The root `/` is now the executive dashboard. All marketplace functionality preserved — just a URL change and sidebar position.

### 6. EY-Specific UI Patterns

**Cards:** Dark charcoal (#2E2E38) with subtle 1px border (#3B3B47), yellow accent on hover left-border. No rounded corners past 8px — EY is more angular.

**Buttons:**
- Primary: EY Yellow (#FFE600) with dark text — used for CTAs
- Secondary: Transparent with border (#3B3B47) and white text
- Destructive: Coral red (#FF6B6B)

**Status chips:**
- Active: EY Green (#4CAF82) with dark text
- Pending/Review: EY Amber (#FFB547)
- Inactive/Retired: Mid Gray (#9898A0)
- Error: Coral (#FF6B6B)

**Stat cards:** Subtle gradient from card to slightly darker base. Yellow accent icon. Large number in white, label in muted gray.

### Files to Modify

| File | Change Type | Description |
|------|-------------|-------------|
| `app/globals.css` | **Redesign** | All CSS custom properties → EY brand tokens |
| `components/app-shell.tsx` | **Rewrite** | Horizontal nav → sidebar + top bar + breadcrumbs |
| `app/page.tsx` | **Rewrite** | Marketplace → Executive Dashboard |
| `app/marketplace/page.tsx` | **Create** (move) | Move marketplace content to `/marketplace` |
| `app/layout.tsx` | **Update** | Font family, metadata title "EY AI Agent Hub" |
| `app/agents/page.tsx` | **Update** | Remove onboarding ref, update to new card pattern |
| `app/governance/page.tsx` | **Update** | Sub-nav tabs move to top bar |
| `app/intelligence/page.tsx` | **Update** | Layout adjustments for sidebar |
| `app/analytics/page.tsx` | **Update** | Layout adjustments |
| `app/skills/page.tsx` | **Update** | Layout adjustments |
| `app/canvas/page.tsx` | **Update** | Layout adjustments for sidebar width |
| `app/settings/page.tsx` | **Update** | Layout adjustments |
| `components/onboarding-wizard.tsx` | **Remove** | Dashboard replaces onboarding |

### Mock Wireframe: Dashboard Home

```
┌──────────┬──────────────────────────────────────────────────┐
│ EY       │  Dashboard / {breadcrumb}          🔍  🔔  👤   │
│ ━━━━━━━  ├──────────────────────────────────────────────────┤
│          │                                                  │
│ ■ Dash   │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│ ■ Market │  │19   │ │9/11 │ │ 4 ⚠│ │ 87% │ │ 15  │      │
│ ■ Agents │  │MCPs │ │Agts │ │Appr │ │Comp │ │Sigs │      │
│ ■ Skills │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘      │
│ ■ Orch   │                                                  │
│ ■ Govern │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ ■ Intel  │  │Marketplace│ │ Agents   │ │  Skills  │        │
│          │  │19 MCPs →  │ │ 11 total→│ │ 26 total→│        │
│          │  └──────────┘ └──────────┘ └──────────┘        │
│ ────     │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ ⚙ Set    │  │Orchestr. │ │Governance│ │Intel     │        │
│ 👤 User  │  │22 nodes →│ │4 pending→│ │15 sigs → │        │
│          │  └──────────┘ └──────────┘ └──────────┘        │
└──────────┴──────────────────────────────────────────────────┘
```

## Open Questions

_None — all major decisions resolved through collaborative dialogue._

## Next Steps

→ `/ce-plan` for detailed implementation plan with file changes and EY brand token specifications.
