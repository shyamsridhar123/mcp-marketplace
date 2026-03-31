---
title: "feat: CRM & Sales Agents, Skills, and Dynamics 365 MCPs"
type: feat
status: active
date: 2026-03-31
origin: docs/brainstorms/2026-03-31-crm-sales-agents-skills-brainstorm.md
---

# ✨ feat: CRM & Sales Agents, Skills, and Dynamics 365 MCPs

## Overview

Add Dynamics 365 Sales as a business-line vertical to the Unified Agent Platform: 3 MCP servers, 3 sales agents with Work IQ integration, 6 sales skills, a Sales Operations blueprint, and CRM data DLP policy. Extends the Microsoft Agent 365 story from IT operations into revenue teams.

(see brainstorm: [docs/brainstorms/2026-03-31-crm-sales-agents-skills-brainstorm.md](docs/brainstorms/2026-03-31-crm-sales-agents-skills-brainstorm.md))

## Problem Statement

The platform demonstrates IT/devops and productivity use cases but lacks any line-of-business vertical. Sales teams need CRM-connected agents with governed access to customer data, pipeline intelligence, and cross-pillar Work IQ integration.

## Proposed Solution

Single-phase implementation adding mock data for all new entities to the existing data layer, plus a `'CRM'` category to the MCPCategory type. No new pages or components — the new entities surface automatically through existing Marketplace, Agents, Skills, Governance, and Canvas pages.

---

## Technical Approach

### Files Modified

| File | Change |
|------|--------|
| `lib/types.ts` | Add `'CRM'` to `MCPCategory` union |
| `lib/data.ts` | Add 3 Dynamics 365 MCP servers, 3 sales agents with full Agent 365 fields |
| `lib/data/governance.ts` | Add 1 blueprint, 1 DLP policy, 3-5 traces, 2 approval requests, 3-4 IQ signals |
| `app/page.tsx` | Add `'crm'` to categories array for sidebar filter |

### Implementation Details

#### 1. Type Extension (`lib/types.ts`)

Add `'CRM'` to the `MCPCategory` union type:

```typescript
export type MCPCategory =
  | 'Infrastructure'
  | 'Compliance'
  | 'Analytics'
  | 'Communication'
  | 'CRM'           // ← NEW
  | 'Database'
  // ... rest unchanged
```

- [ ] Add `'CRM'` to `MCPCategory` union

#### 2. Dynamics 365 MCP Servers (`lib/data.ts`)

Add 3 MCPs to `mcpServers` array:

**Dynamics 365 Sales Core:**
```
id: 'd365-sales-core'
name: 'Dynamics 365 Sales'
category: 'CRM'
provider: 'Microsoft'
version: '2.1.0'
downloads: 18750
rating: 4.8
status: 'active'
complianceLevel: 'high'
dataClassification: 'confidential'
capabilities: ['Lead Management', 'Contact Management', 'Opportunity Tracking', 'Pipeline Views']
icon: 'briefcase'
tags: ['dynamics-365', 'crm', 'sales', 'microsoft']
isInstalled: true
adminConsentRequired: true
```

**Dynamics 365 Sales Insights:**
```
id: 'd365-sales-insights'
name: 'Dynamics 365 Sales Insights'
category: 'CRM'
provider: 'Microsoft'
version: '1.5.0'
downloads: 12340
rating: 4.7
status: 'active'
complianceLevel: 'high'
dataClassification: 'confidential'
capabilities: ['Revenue Forecasting', 'Quota Management', 'Deal Velocity', 'Win/Loss Analysis']
icon: 'trending-up'
tags: ['dynamics-365', 'sales-insights', 'forecasting', 'analytics']
isInstalled: true
adminConsentRequired: true
```

**Dynamics 365 Copilot for Sales:**
```
id: 'd365-copilot-sales'
name: 'Dynamics 365 Copilot for Sales'
category: 'CRM'
provider: 'Microsoft'
version: '1.2.0'
downloads: 9870
rating: 4.6
status: 'active'
complianceLevel: 'high'
dataClassification: 'confidential'
capabilities: ['Call Analytics', 'Email Engagement', 'Conversation Summaries', 'Relationship Health']
icon: 'message-square'
tags: ['dynamics-365', 'copilot', 'conversation-intelligence', 'ai']
isInstalled: true
adminConsentRequired: true
```

- [ ] Add `d365-sales-core` MCP entry
- [ ] Add `d365-sales-insights` MCP entry
- [ ] Add `d365-copilot-sales` MCP entry

#### 3. Sales Agents (`lib/data.ts`)

Add 3 agents to `agentData` array with full Agent 365 fields:

**Sales Rep Agent:**
```
id: 'sales-rep-agent'
department: 'Sales'
status: 'active'
blueprintId: 'bp-sales-ops'
lifecycleStatus: 'active'
observabilityEnabled: true
mcpConnections: ['d365-sales-core', 'd365-copilot-sales', 'workiq-mail-mcp', 'workiq-calendar-mcp']
skills: [
  Pipeline Management (from d365-sales-core)
  Activity Logging (from d365-sales-core)
  Meeting-to-CRM Sync (from workiq-calendar-mcp)
  Conversation Intelligence (from d365-copilot-sales)
]
entraIdentity: mock-entra-00000009-*
mailbox: sales-rep-agent@contoso.onmicrosoft.com
permissions: D365 Sales scopes + Work IQ Mail/Calendar scopes
```

**Sales Manager Agent:**
```
id: 'sales-manager-agent'
department: 'Sales'
status: 'active'
blueprintId: 'bp-sales-ops'
lifecycleStatus: 'active'
observabilityEnabled: true
mcpConnections: ['d365-sales-core', 'd365-sales-insights', 'workiq-teams-mcp']
skills: [
  Revenue Forecasting (from d365-sales-insights)
  Pipeline Management (from d365-sales-core)
]
entraIdentity: mock-entra-00000010-*
mailbox: sales-manager@contoso.onmicrosoft.com
permissions: D365 Sales + Insights scopes + Work IQ Teams scope
```

**Lead Generation Agent:**
```
id: 'lead-gen-agent'
department: 'Marketing'
status: 'active'
blueprintId: 'bp-sales-ops'
lifecycleStatus: 'active'
observabilityEnabled: true
mcpConnections: ['d365-sales-core', 'd365-copilot-sales', 'workiq-mail-mcp']
skills: [
  Contact Enrichment (from d365-copilot-sales)
  Activity Logging (from d365-sales-core)
  Conversation Intelligence (from d365-copilot-sales)
]
entraIdentity: mock-entra-00000011-*
mailbox: lead-gen-agent@contoso.onmicrosoft.com
permissions: D365 Sales scopes + Work IQ Mail scope
```

- [ ] Add `sales-rep-agent` with 4 skills and Entra identity
- [ ] Add `sales-manager-agent` with 2 skills and Entra identity
- [ ] Add `lead-gen-agent` with 3 skills and Entra identity

#### 4. Sales Operations Blueprint (`lib/data/governance.ts`)

```
id: 'bp-sales-ops'
name: 'Sales Operations Blueprint'
capabilities: ['Pipeline Management', 'Revenue Forecasting', 'Activity Logging', 'CRM Automation']
requiredMCPServers: ['d365-sales-core', 'd365-sales-insights']
securityConstraints: [
  'CRM record access scoped to user territory/team assignment',
  'Deal modifications above $100K require manager approval',
  'Customer PII must not be exported to unmanaged channels',
  'All CRM write operations logged and auditable'
]
complianceRequirements: ['SOC 2', 'GDPR', 'Company Sales Policy']
governancePolicies: ['pol-1', 'dlp-crm']
status: 'active'
```

- [ ] Add `bp-sales-ops` blueprint

#### 5. CRM Data DLP Policy (`lib/data/governance.ts`)

```
id: 'dlp-crm'
name: 'CRM Customer Data Protection'
level: 'agent'
enforcement: 'warn'
rules: [
  { type: 'data-boundary', condition: 'export customer PII to non-CRM channel', action: 'warn_and_log', dataClassifications: ['confidential'] },
  { type: 'sensitivity-label', condition: 'deal value modification > threshold', action: 'require_approval', dataClassifications: ['confidential'] }
]
appliedTo: ['d365-sales-core', 'd365-copilot-sales']
```

- [ ] Add `dlp-crm` DLP policy

#### 6. Agent Traces (`lib/data/governance.ts`)

Add 4 traces for sales agents:

```
- Sales Rep Agent: tool_execution → D365 Sales (success, 340ms)
- Sales Rep Agent: tool_execution → Work IQ Calendar (success, 280ms)  
- Sales Manager Agent: inference → D365 Sales Insights (success, 890ms)
- Lead Gen Agent: tool_execution → D365 Copilot for Sales (success, 520ms)
```

- [ ] Add 4 sales agent traces

#### 7. Approval Requests (`lib/data/governance.ts`)

Add 2 approval requests:

```
- 'Sales Rep Agent requesting D365 Sales Core access' (stage: approved)
- 'Lead Gen Agent requesting Copilot for Sales access' (stage: pending)
```

- [ ] Add 2 sales-related approval requests

#### 8. IQ Signals (`lib/data/governance.ts`)

Add 3 sales-related IQ signals:

```
- work-iq / data: 'Pipeline velocity declining 15% in EMEA region — 12 deals stalled in negotiation stage'
- work-iq / inference: 'Recommend scheduling follow-up meetings for 5 high-value opportunities with no activity in 14 days'
- work-iq / memory: 'Q1 pipeline typically closes 23% higher than Q4 — historical pattern from 3-year analysis'
```

- [ ] Add 3 sales IQ signals

#### 9. Marketplace Category Sidebar (`app/page.tsx`)

Add CRM to the categories array:

```typescript
{ id: "crm", label: "CRM", count: mcpServers.filter(s => s.category === "CRM").length },
```

- [ ] Add CRM category to marketplace sidebar

#### 10. Data Categories Array (`lib/data.ts`)

Add `'CRM'` to the `mcpCategories` array:

- [ ] Add `'CRM'` to `mcpCategories` const array

---

## Acceptance Criteria

- [ ] 3 Dynamics 365 MCP servers appear in Marketplace under CRM category
- [ ] CRM sidebar filter shows correct count (3)
- [ ] 3 sales agents appear in Agent Registry with Sales/Marketing departments
- [ ] Sales agents show "Sales Operations Blueprint" badge
- [ ] Agent detail pages show correct skills, Work IQ + D365 MCP connections
- [ ] Blueprint tab shows CRM-specific security constraints
- [ ] Identity tab shows Entra identity with D365 + Work IQ scoped permissions
- [ ] Observability tab shows sales agent traces
- [ ] Governance Blueprints tab shows Sales Operations Blueprint
- [ ] Governance Audit tab includes sales agent traces
- [ ] Governance Compliance tab includes sales agents with scores
- [ ] Canvas shows D365 MCPs connected to sales agents + Work IQ cross-connections
- [ ] Intelligence page shows sales IQ signals in Data/Memory/Inference panels
- [ ] `pnpm build` passes with zero errors
- [ ] No breaking changes to existing functionality

## Success Metrics

- **Total MCPs in marketplace:** 19 (16 existing + 3 Dynamics 365)
- **Total agents:** 11 (8 existing + 3 sales)
- **Total skills:** 26 (17 existing + 9 new across 3 agents — some skills appear on multiple agents)
- **Total blueprints:** 5 (4 existing + Sales Operations)
- **Canvas nodes:** ~22 (16 existing + 3 D365 MCPs + 3 sales agents)

## Sources & References

### Origin
- **Brainstorm:** [docs/brainstorms/2026-03-31-crm-sales-agents-skills-brainstorm.md](docs/brainstorms/2026-03-31-crm-sales-agents-skills-brainstorm.md) — Key decisions: Dynamics 365 only (no Salesforce/HubSpot), 3 agent personas, deep Work IQ integration, full governance with Sales blueprint

### Internal References
- Types: [lib/types.ts](lib/types.ts) — `MCPCategory` union, `MCP`, `Agent`, `Skill` interfaces
- Mock data: [lib/data.ts](lib/data.ts) — `mcpServers`, `agentData`, `mcpCategories`
- Governance data: [lib/data/governance.ts](lib/data/governance.ts) — `agentBlueprints`, `dlpPolicies`, `agentTraces`, `approvalRequests`, `iqSignals`
- Marketplace sidebar: [app/page.tsx](app/page.tsx) — `categories` array
