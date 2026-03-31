---
title: "Unified Agent Platform: MCP + Agents + Skills + Work IQ Integration"
category: architecture
date: 2026-03-31
tags: [microsoft-agent-365, work-iq, mcp-marketplace, governance, entra-identity, opentelemetry, next-js]
module: Full Platform
symptom: "Platform only managed MCPs in isolation — no agent lifecycle, Work IQ intelligence, or enterprise governance"
root_cause: "Missing data model and UI for Agent 365 blueprints, Work IQ MCP servers, DLP policies, and observability traces"
---

# Unified Agent Platform: MCP + Agents + Skills + Work IQ Integration

## Problem

The Nexus MCP Marketplace managed MCP servers in isolation with basic governance. Enterprise customers needed:
- Full agent lifecycle with Microsoft Agent 365 blueprints and Entra identity
- Work IQ MCP servers (Mail, Calendar, Teams, SharePoint) as first-class citizens
- DLP policies, compliance scorecards, and Defender-style audit trails
- OpenTelemetry observability traces per agent
- Intelligence dashboard visualizing Work IQ Data/Memory/Inference layers

## Root Cause

The data model only had `MCP`, `Agent`, `Skill`, `GovernancePolicy` — no concepts for blueprints, Entra identity, DLP, traces, approval workflows, or IQ signals.

## Solution

### Phase 1: Data Foundation (lib/types.ts + lib/data/)
- Added 11 new TypeScript interfaces: `AgentBlueprint`, `EntraIdentity`, `EntraPermission`, `DLPPolicy`, `DLPRule`, `AgentTrace`, `ApprovalRequest`, `IQSignal`, `BasePolicy`
- Extended `Agent` with optional `blueprintId`, `entraIdentity`, `lifecycleStatus`, `observabilityEnabled`
- Extended `MCP` with optional `isWorkIQ`, `workIQService`, `adminConsentRequired`
- Created `lib/data/governance.ts` for new mock data (blueprints, DLP, traces, approvals, IQ signals)
- All mock Entra IDs use `mock-entra-*` prefix to prevent confusion with real credentials

### Phase 2: Navigation Redesign (components/app-shell.tsx)
- Replaced 4-phase nav (Discover→Connect→Orchestrate→Govern) with 6 pillars:
  Marketplace → Agents → Skills → Orchestration → Governance → Intelligence
- Updated activity feed with Agent 365-relevant events

### Phase 3: Marketplace + Agent Registry
- Added Work IQ featured section with Microsoft branding and service icons
- Agent cards show blueprint badges, lifecycle status chips, Entra identity indicators
- Agent detail gains Blueprint, Identity, Observability tabs

### Phase 4: Governance Enhancement
- Blueprints tab with blueprint cards showing agent count and required MCPs
- Defender-style Advanced Hunting audit table with trace data
- Compliance scorecards with per-agent scoring based on observability/Entra/blueprint

### Phase 5: Intelligence + Canvas
- Intelligence page with 3-panel Work IQ dashboard (Data/Memory/Inference layers)
- IQ Family selector (Work IQ active, Foundry/Fabric IQ coming soon)
- Canvas enhanced with `workiq` node type — purple gradient styling, positioned above MCPs

## Key Patterns

1. **Backward-compatible type extension**: Add optional fields to existing interfaces instead of breaking them
2. **Data re-export pattern**: New data in `lib/data/governance.ts`, re-exported from `lib/data.ts`
3. **Mock ID convention**: `mock-entra-*` prefix for all Entra identity fields
4. **Work IQ governed access**: One Work IQ MCP (`Teams`) set to `status: 'pending'` to demo admin consent flow
5. **Tab extraction**: Complex governance page uses inline tab rendering (could extract to sub-components for 500+ line files)

## Prevention

- When adding new entity types, always add them to `lib/types.ts` first and build before adding data
- Cross-reference IDs carefully — use consistent naming (`bp-*` for blueprints, `dlp-*` for DLP policies, `workiq-*-mcp` for Work IQ servers)
- Test `pnpm build` after each phase to catch type mismatches early
- Keep `MCP.status` type union consistent with actual data values

## Related

- Brainstorm: `docs/brainstorms/2026-03-31-unified-agent-platform-brainstorm.md`
- Plan: `docs/plans/2026-03-31-001-feat-unified-agent-platform-plan.md`
- Microsoft Agent 365 SDK docs: https://learn.microsoft.com/microsoft-agent-365/developer/agent-365-sdk
- Work IQ MCP Overview: https://learn.microsoft.com/microsoft-agent-365/tooling-servers-overview
