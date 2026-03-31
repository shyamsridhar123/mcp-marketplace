---
date: 2026-03-31
topic: unified-agent-platform
---

# Unified Agent Platform: MCP + Agents + Skills + Work IQ

## What We're Building

A comprehensive **Unified Agent Platform** that transforms the current Nexus MCP Marketplace into a full lifecycle management platform for MCPs, Agents, Skills, and Intelligence — all connected, monitored, and governed through **Microsoft Agent 365** and integrated with the **Microsoft IQ platform** (Work IQ, Foundry IQ, Fabric IQ).

The platform serves three personas with role-based views: **IT Admins/Platform Engineers** (governance, compliance, fleet management), **Developers/Agent Builders** (registration, skill composition, orchestration), and **Business Users/LOB Leads** (analytics, self-service, agent requests).

The full demo uses mock data to demonstrate end-to-end capabilities without requiring real Microsoft 365 tenant integration.

## Why This Approach

Three approaches were considered:

1. **Unified Agent Platform (chosen)** — Complete 6-pillar redesign covering all personas, full Agent 365 blueprint integration, Work IQ intelligence layer, and comprehensive governance. Selected because it delivers the most complete demo and aligns with the Microsoft Agent 365 architecture.

2. **Agent 365 Control Plane** — Focused on governance/admin experience. Rejected because it underplays orchestration and skill composition.

3. **Developer-First Agent Builder** — Wizard-driven developer workflow. Rejected because it misses the multi-persona requirement.

## Key Decisions

### Navigation Redesign: 6 Pillars

Replace the current 4-phase navigation (Discover → Connect → Orchestrate → Govern) with 6 pillars:

| Pillar | Purpose | Key Pages |
|--------|---------|-----------|
| **Marketplace** | Discover & register MCPs + Work IQ MCP servers | MCP catalog, Work IQ Mail/Calendar/Teams/SharePoint servers, registration flow, provider portal |
| **Agents** | Full agent lifecycle with Agent 365 blueprints | Agent registry, blueprint editor, Entra identity management, deployment status, agent detail with Agent 365 metadata |
| **Skills** | Reusable capability packages from MCPs | Skill library, skill builder, skill-to-MCP mapping, skill versioning, cross-agent skill sharing |
| **Orchestration** | Visual multi-agent + MCP composition | Enhanced connection canvas, multi-agent workflows, skill chains, event-driven orchestration |
| **Governance** | Policies, DLP, compliance, approvals | Agent blueprints & policies, DLP enforcement, scoped permissions, approval workflows, Copilot Control System integration, audit trails |
| **Intelligence** | Work IQ + analytics + observability | Work IQ dashboard (Data/Memory/Inference layers), Foundry IQ integration, OpenTelemetry traces, Defender-style observability, IQ signal visualization |

### Key Screen Descriptions

**Marketplace (`/`)**: Extends the existing MCP catalog with a new "Work IQ" category section at the top. Work IQ MCP servers (Mail, Calendar, Teams, SharePoint) appear as premium/featured cards with Microsoft branding. Existing MCP browsing, search, and filtering preserved. "Register Provider" becomes "Register MCP or Agent."

**Agent Registry (`/agents`)**: Redesigned list/grid showing agents with Agent 365 blueprint badges, lifecycle status chips (Draft/Review/Approved/Active/Suspended/Retired), Entra identity indicators, and connected MCP/skill counts. Filter by status, department, blueprint. "Create Agent" opens a multi-step wizard: define → select blueprint → assign MCPs → configure identity → submit for review.

**Agent Detail (`/agents/[id]`)**: Extended with new tabs: **Blueprint** (shows inherited policies, required MCPs, security constraints), **Identity** (Entra object ID, mailbox, permissions), **Observability** (OpenTelemetry traces timeline), plus existing Skills/Integrations/Activity tabs.

**Skills Library (`/skills`)**: Enhanced with skill versioning badges, Work IQ-powered skills section, and a "Compose Skill" button for combining MCP capabilities. Shows which agents and blueprints use each skill.

**Orchestration Canvas (`/canvas`)**: Extended to show Work IQ data flows alongside MCP-Agent connections. New node types: Work IQ servers, skill chains, multi-agent collaboration links. Minimap shows the intelligence layer feeding into agents.

**Governance Dashboard (`/governance`)**: Redesigned with tabs: **Policies** (existing + DLP policies), **Blueprints** (agent blueprint management with approval status), **Approvals** (multi-stage workflow: pending → in review → approved/rejected), **Audit** (Defender-style advanced hunting table with tool call traces), **Compliance** (compliance scorecards per agent/MCP).

**Intelligence Dashboard (`/intelligence`)**: New page. Three-panel view for Work IQ layers (Data signals, Memory graph, Inference activity). IQ family selector (Work IQ / Foundry IQ / Fabric IQ). Real-time signal stream. Agent-to-IQ connection visualization.

**Analytics (`/analytics`)**: Merged into Intelligence pillar or kept as sub-page. Adds observability metrics: tool call latency, inference success rates, Work IQ signal volume trends.

### Existing File Migration Strategy

| Current File | Action |
|-------------|--------|
| `app/page.tsx` (Marketplace) | **Extend** — add Work IQ section, keep existing MCP catalog |
| `app/agents/page.tsx` | **Redesign** — add blueprint badges, lifecycle status, Entra indicators |
| `app/agents/[id]/` | **Extend** — add Blueprint, Identity, Observability tabs |
| `app/skills/page.tsx` | **Extend** — add versioning, Work IQ skills, compose flow |
| `app/canvas/page.tsx` | **Extend** — add Work IQ nodes, skill chain nodes |
| `app/governance/page.tsx` | **Redesign** — add Blueprints, Audit, Compliance tabs |
| `app/analytics/page.tsx` | **Move** — becomes sub-page of Intelligence or merges into it |
| `app/settings/page.tsx` | **Keep** — no changes needed |
| `lib/types.ts` | **Extend** — add new interfaces alongside existing ones |
| `lib/data.ts` | **Extend** — add mock data for new entities |
| `components/app-shell.tsx` | **Redesign** — new 6-pillar navigation |
| **NEW** `app/intelligence/page.tsx` | **Create** — Work IQ + IQ family dashboard |

### Agent Registration: Full Agent 365 Blueprint Model

- **Agent Blueprint**: IT-approved, pre-configured definition of an agent type (from Entra agent blueprint concept)
- **Entra-backed Identity**: Each agent gets its own identity with mailbox, scoped permissions
- **Governed MCP Access**: Agents access MCP servers only with admin consent via ToolingManifest
- **Lifecycle States**: Draft → Review → Approved → Active → Suspended → Retired
- **OpenTelemetry Observability**: Built-in tracing of agent invocations, tool executions, inference calls

### Work IQ Integration: Full (MCPs + Intelligence Layer)

- **Work IQ MCP Servers in Marketplace**: Work IQ Mail, Calendar, Teams, SharePoint appear as first-class MCP servers with governance controls
- **Intelligence Layer Visualization**: Dashboard showing the three Work IQ layers:
  - **Data Layer**: Unified signals from files, emails, meetings, chats
  - **Memory Layer**: Persistent understanding of how people and teams work
  - **Inference Layer**: Models, skills, tools powering reasoning and action
- **IQ Family**: Work IQ, Foundry IQ, Fabric IQ shown as connected intelligence sources
- **Mock Data**: Simulated Work IQ signals, memory graphs, inference traces

### Governance: Full Agent 365 Governance Model

- **Agent Blueprints**: Templates defining capabilities, required MCP accesses, security constraints, audit requirements
- **DLP Policies**: Data Loss Prevention enforcement at tenant/environment/agent level
- **Scoped Permissions**: Per-MCP-server permission grants with admin consent
- **Approval Workflows**: Multi-stage approval for agent registration, MCP access, and deployment
- **Defender Observability**: Mock Microsoft Defender Advanced Hunting view for tool call traces
- **Copilot Control System**: Agent lifecycle management (deploy → govern → retire)

### Data Model Expansion

Extend the existing `MCP`, `Agent`, `Skill`, `GovernancePolicy` interfaces. Key new types:

- **`AgentBlueprint`**: IT-approved agent template with capabilities, required MCPs, security constraints, compliance rules, Entra identity config, lifecycle status (draft → review → approved → active → suspended → retired)
- **`Agent` (extended)**: Add `blueprintId`, `entraObjectId`, `lifecycleStatus`, `notificationChannels[]`, `observabilityEnabled`
- **`WorkIQServer`**: Extends MCP shape with `service` type (mail/calendar/teams/sharepoint), activation status, permissions, signal counts
- **`IQSignal`**: Source (work-iq/foundry-iq/fabric-iq), layer (data/memory/inference), content, confidence score
- **`DLPPolicy`**: Level (tenant/environment/agent), enforcement mode (block/warn/audit), applied scope
- **`AgentTrace`**: OpenTelemetry-style trace with type (invocation/tool_execution/inference), tool server name, result, duration
- **`ApprovalRequest`**: Multi-stage workflow item with requestor, approver, stage, decision, timestamps

Detailed interface definitions deferred to planning phase.

### Mock Data Strategy

All mock data with realistic enterprise scenarios:

- **12+ MCP Servers**: Existing 11 + Work IQ Mail, Calendar, Teams, SharePoint
- **8+ Agents**: Existing 5 + Compliance Sentinel, Knowledge Worker Agent, HR Onboarding Agent (all with Agent 365 blueprints)
- **15+ Skills**: Expanded from 10 with Work IQ-powered skills (email summarization, meeting prep, document insights)
- **6+ Governance Policies**: Existing 3 + DLP policies, scoped permission policies, blueprint compliance
- **Work IQ Signals**: Mocked data/memory/inference layer activity
- **Observability Traces**: Mocked OpenTelemetry traces with Defender-style advanced hunting view
- **Approval Workflows**: In-progress agent registrations and MCP access requests

## Open Questions

_None — all major decisions resolved through collaborative dialogue._

## Next Steps

→ `/ce-plan` for detailed implementation plan with file changes, component architecture, and mock data design.
