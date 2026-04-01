---
title: "feat: EY Command Center UX Reimagination"
type: feat
status: active
date: 2026-03-31
origin: docs/brainstorms/2026-03-31-ey-ux-reimagination-brainstorm.md
---

# ✨ feat: EY Command Center UX Reimagination

## Overview

Complete UX overhaul: EY brand identity (Yellow #FFE600 on Dark Charcoal #2E2E38), hybrid sidebar + top bar navigation, new executive dashboard home, and improved cross-pillar drill-down flow. Transforms "Nexus" into "EY AI Agent Hub."

(see brainstorm: [docs/brainstorms/2026-03-31-ey-ux-reimagination-brainstorm.md](docs/brainstorms/2026-03-31-ey-ux-reimagination-brainstorm.md))

## Implementation Phases

### Phase 1: EY Brand Tokens (`app/globals.css`)

Replace all CSS custom properties with EY brand values.

```css
:root {
  --background: #1A1A24;
  --foreground: #F0F0F5;
  --card: #2E2E38;
  --card-foreground: #F0F0F5;
  --popover: #23232D;
  --popover-foreground: #F0F0F5;
  --primary: #FFE600;
  --primary-foreground: #1A1A24;
  --secondary: #3B3B47;
  --secondary-foreground: #F0F0F5;
  --muted: #2E2E38;
  --muted-foreground: #9898A0;
  --accent: #FFE600;
  --accent-foreground: #1A1A24;
  --destructive: #FF6B6B;
  --destructive-foreground: #F0F0F5;
  --border: #3B3B47;
  --input: #2E2E38;
  --ring: #FFE600;
  --chart-1: #FFE600;
  --chart-2: #47C2E1;
  --chart-3: #4CAF82;
  --chart-4: #FFB547;
  --chart-5: #FF8C69;
  --success: #4CAF82;
  --warning: #FFB547;
  --sidebar: #23232D;
  --sidebar-foreground: #F0F0F5;
  --sidebar-primary: #FFE600;
  --sidebar-primary-foreground: #1A1A24;
  --sidebar-accent: #3B3B47;
  --sidebar-accent-foreground: #F0F0F5;
  --sidebar-border: #3B3B47;
  --sidebar-ring: #FFE600;
  --radius: 0.5rem;         /* 8px — more angular per EY style */
}
```

- [ ] Replace all `:root` CSS custom properties with EY hex values
- [ ] Replace `.dark` block with same values (single-theme dark mode)
- [ ] Update `--radius` from 0.625rem to 0.5rem (8px max per EY angular style)
- [ ] Change font import from Geist to system-ui stack

### Phase 2: Layout + Sidebar Navigation (`components/app-shell.tsx`)

Rewrite the AppShell from horizontal nav to sidebar + top bar layout.

**Sidebar structure:**
```
┌──────────────────────┐
│ EY  AI Agent Hub     │ ← Logo + brand
│ ──────────────────── │
│ ■ Dashboard          │ ← href="/"
│ ■ Marketplace        │ ← href="/marketplace"
│ ■ Agents             │ ← href="/agents"
│ ■ Skills             │ ← href="/skills"
│ ■ Orchestration      │ ← href="/canvas"
│ ■ Governance         │ ← href="/governance"
│ ■ Intelligence       │ ← href="/intelligence"
│                      │
│ ──────────────────── │
│ ⚙ Settings           │
│ 🔔 3  Alex H.        │ ← Notifications + user
└──────────────────────┘
```

**Top bar structure:**
```
┌──────────────────────────────────────────────┐
│ Dashboard / Agents / Sales Rep Agent   🔍 🔔 │
└──────────────────────────────────────────────┘
```

Key implementation details:
- Sidebar state (expanded/collapsed) stored in localStorage key `ey-sidebar-collapsed`
- Collapsed width: 64px, Expanded width: 240px
- Active item: EY Yellow left border (3px solid #FFE600) + subtle yellow bg tint
- Canvas page (`/canvas`): auto-collapse sidebar, restore on navigate away
- Breadcrumb computed from `usePathname()` segments
- Activity feed/notification dropdown moves to sidebar bottom

- [ ] Rewrite `app-shell.tsx` with sidebar + topbar layout
- [ ] Add sidebar collapse toggle with localStorage persistence
- [ ] Add breadcrumb component in top bar
- [ ] Add canvas auto-collapse behavior
- [ ] Move notification bell and user avatar to sidebar bottom
- [ ] Update EY logo: "EY" badge + "AI Agent Hub" text

### Phase 3: Executive Dashboard Home (`app/page.tsx`)

Rewrite the current marketplace page as `/page.tsx` → Executive Dashboard.

**Layout:**
1. **KPI Row** — 5 stat cards computed from mock data:
   - Total MCPs: `mcpServers.length`
   - Active Agents: `agentData.filter(active).length` / `agentData.length`
   - Pending Approvals: `approvalRequests.filter(pending/in-review).length`
   - Compliance Score: computed average from agents
   - IQ Signals: `iqSignals.length`

2. **Pillar Cards** — 2×3 grid of quick-action cards:
   Each card shows icon, pillar name, key metric, and "→" link

3. **Activity Feed** — Recent activity stream (reuse existing `recentActivity` data)

- [ ] Rewrite `app/page.tsx` as Executive Dashboard
- [ ] KPI row with 5 dynamic stat cards
- [ ] 6 pillar quick-action cards in 2×3 grid
- [ ] Activity feed section

### Phase 4: Marketplace Move (`app/marketplace/page.tsx`)

Move existing marketplace content from `app/page.tsx` to `app/marketplace/page.tsx`.

- [ ] Create `app/marketplace/page.tsx` with marketplace content
- [ ] Update all internal links pointing to `/` for marketplace → `/marketplace`
- [ ] Update `app-shell.tsx` sidebar marketplace link: `href="/marketplace"`
- [ ] MCP detail pages (`app/mcp/[id]/page.tsx`): update "Back to Marketplace" link

### Phase 5: Page Layout Updates

Update all pages to work within the sidebar layout (remove `<AppShell>` wrapper calls since AppShell is now the layout wrapper, not per-page):

- [ ] `app/layout.tsx` — Update metadata title to "EY AI Agent Hub", font to system-ui
- [ ] `app/agents/page.tsx` — Remove onboarding wizard ref, adjust padding for sidebar
- [ ] `app/governance/page.tsx` — Move sub-tabs into page body (no longer in top bar)
- [ ] `app/intelligence/page.tsx` — Adjust layout for sidebar
- [ ] `app/analytics/page.tsx` — Add "Intelligence / Analytics" breadcrumb context
- [ ] `app/skills/page.tsx` — Adjust layout for sidebar
- [ ] `app/canvas/page.tsx` — Adjust for auto-collapsed sidebar
- [ ] `app/settings/page.tsx` — Adjust layout for sidebar

### Phase 6: EY UI Pattern Updates

Update component styling across all pages:

- [ ] Buttons: Primary uses `bg-[#FFE600] text-[#1A1A24]` for CTAs
- [ ] Cards: Max `rounded-lg` (8px), yellow left-border on hover
- [ ] Status chips: Green (#4CAF82), Amber (#FFB547), Gray (#9898A0), Red (#FF6B6B)
- [ ] All purple/violet accent references → EY Yellow
- [ ] Agent card blueprint badges: yellow-tinted instead of purple
- [ ] Canvas Work IQ nodes: update from violet gradient to EY Yellow accent

---

## Acceptance Criteria

- [ ] EY Yellow (#FFE600) is the primary accent color across all pages
- [ ] Background is EY Dark Navy (#1A1A24), cards are Charcoal (#2E2E38)
- [ ] No remaining purple/violet colors in the UI
- [ ] Sidebar navigation with 7 items renders correctly
- [ ] Sidebar collapses to 64px icon-only mode, preference persisted
- [ ] Canvas page auto-collapses sidebar
- [ ] Executive Dashboard shows dynamic KPIs computed from mock data
- [ ] Marketplace accessible at `/marketplace`
- [ ] Breadcrumbs show correct path on all pages
- [ ] Brand shows "EY AI Agent Hub" in sidebar
- [ ] All existing functionality preserved (agents, governance, intelligence, canvas)
- [ ] `pnpm build` passes with zero errors

## Dependencies & Risks

| Risk | Mitigation |
|------|-----------|
| Sidebar width breaks canvas layout | Auto-collapse to 64px on canvas route |
| EY Yellow on dark: contrast issues with small text | Only use yellow for accent elements, not body text |
| Marketplace URL change breaks MCP detail "back" links | Update all back links in Phase 4 |
| 13 files to modify | Phase ordering ensures each phase builds on prior |

## Sources & References

### Origin
- **Brainstorm:** [docs/brainstorms/2026-03-31-ey-ux-reimagination-brainstorm.md](docs/brainstorms/2026-03-31-ey-ux-reimagination-brainstorm.md) — Key decisions: EY authentic brand, hybrid sidebar nav, executive dashboard home, drill-down flow pattern

### Internal References
- Current CSS tokens: [app/globals.css](app/globals.css)
- Current navigation: [components/app-shell.tsx](components/app-shell.tsx)
- Current marketplace: [app/page.tsx](app/page.tsx)
- Current layout: [app/layout.tsx](app/layout.tsx)

### External References
- EY Brand Guidelines: Yellow #FFE600, Dark backgrounds, EYInterstate font
- EY Visual Identity: Angular design (max 8px radius), yellow as action color
