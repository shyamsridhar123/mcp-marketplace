---
date: 2026-03-31
topic: crm-sales-agents-skills
---

# CRM & Sales Agents, Skills, and MCPs — Dynamics 365

## What We're Building

Add **CRM and sales capabilities** to the Unified Agent Platform by introducing:

- **3 Dynamics 365 MCP servers** — Sales Core, Sales Insights, Copilot for Sales
- **3 Sales agent personas** — Sales Rep Agent, Sales Manager Agent, Lead Generation Agent
- **6 sales-specific skills** — Pipeline Management, Revenue Forecasting, Meeting-to-CRM Sync, Activity Logging, Conversation Intelligence, Contact Enrichment
- **1 new agent blueprint** — Sales Operations Blueprint with CRM-specific governance
- **1 new DLP policy** — Customer data protection for CRM records
- **Deep Work IQ integration** — Sales agents leverage existing Work IQ Mail/Calendar/Teams MCPs to enrich CRM context (auto-log emails, sync meeting notes to opportunities)

This extends the Microsoft Agent 365 story with a business-line vertical that demonstrates end-to-end CRM orchestration.

## Why This Approach

The platform currently covers IT operations (logging, database, devtools) and productivity (Work IQ). Adding Dynamics 365 Sales as a vertical demonstrates:

1. **Line-of-business expansion** — Shows the platform isn't just for IT; it serves revenue teams
2. **Cross-pillar integration** — Sales agents connect Work IQ (email/calendar) to Dynamics 365 (CRM), showing the orchestration canvas at its best
3. **Microsoft alignment** — Dynamics 365 is the natural CRM partner for the Agent 365 + Work IQ story
4. **Governance depth** — CRM data (customer PII, deal values, forecasts) requires its own DLP policies and blueprint constraints

Alternatives considered:
- **Multi-CRM (Salesforce + HubSpot)** — Rejected to keep the Microsoft-aligned story clean
- **Customer Success agents** — Deferred; sales rep/manager/lead gen covers the core sales workflow

## Key Decisions

### Dynamics 365 MCP Servers (3 new)

| MCP | Purpose | Category | Key Capabilities |
|-----|---------|----------|-----------------|
| **Dynamics 365 Sales Core** | CRUD on leads, contacts, accounts, opportunities + pipeline views | CRM | Lead Management, Contact Management, Opportunity Tracking, Pipeline Views |
| **Dynamics 365 Sales Insights** | Revenue forecasts, quota tracking, deal velocity analytics | CRM | Revenue Forecasting, Quota Management, Deal Velocity, Win/Loss Analysis |
| **Dynamics 365 Copilot for Sales** | Conversation intelligence, call analytics, email engagement tracking | CRM | Call Analytics, Email Engagement, Conversation Summaries, Relationship Health |

All three: `provider: 'Microsoft'`, `complianceLevel: 'high'`, `dataClassification: 'confidential'`, `adminConsentRequired: true`. Add `'CRM'` to `MCPCategory` union.

### Sales Agent Personas (3 new)

| Agent | Department | MCPs | Work IQ MCPs | Key Skills |
|-------|-----------|------|-------------|------------|
| **Sales Rep Agent** | Sales | d365-sales-core, d365-copilot-sales | workiq-mail-mcp, workiq-calendar-mcp | Pipeline Management, Activity Logging, Meeting-to-CRM Sync, Conversation Intelligence |
| **Sales Manager Agent** | Sales | d365-sales-core, d365-sales-insights | workiq-teams-mcp | Revenue Forecasting, Pipeline Management |
| **Lead Generation Agent** | Marketing | d365-sales-core, d365-copilot-sales | workiq-mail-mcp | Contact Enrichment, Activity Logging, Conversation Intelligence |

All three agents get Entra identity (`mock-entra-*`), full observability, and are governed by the Sales Operations Blueprint.

### Sales-Specific Skills (6 new)

| Skill | Source MCP | Description |
|-------|-----------|-------------|
| **Pipeline Management** | d365-sales-core | Visualize deal stages, move opportunities through pipeline, flag stalled deals |
| **Revenue Forecasting** | d365-sales-insights | Generate quarterly/annual forecasts from pipeline data with confidence scoring |
| **Meeting-to-CRM Sync** | workiq-calendar-mcp | Auto-log meeting notes/outcomes from Work IQ Calendar to CRM opportunities |
| **Activity Logging** | d365-sales-core | Track and log sales activities (calls, emails, meetings) to contact/opportunity timelines |
| **Conversation Intelligence** | d365-copilot-sales | Analyze call/email engagement patterns, extract action items, score sentiment |
| **Contact Enrichment** | d365-copilot-sales | Enrich contact profiles from email and Teams signals using Work IQ data |

### Sales Operations Blueprint (1 new)

- **ID:** `bp-sales-ops`
- **Required MCPs:** d365-sales-core, d365-sales-insights (at minimum)
- **Security Constraints:**
  - CRM record access scoped to user's territory/team assignment
  - Deal modifications above $100K require manager approval
  - Customer PII (email, phone) must not be exported to unmanaged channels
  - All CRM write operations logged and auditable
- **Compliance Requirements:** SOC 2, GDPR (customer data), Company Sales Policy
- **Governance Policies:** linked to new DLP policy for CRM data

### CRM Data DLP Policy (1 new)

- **ID:** `dlp-crm`
- **Level:** agent
- **Enforcement:** warn
- **Rules:**
  - Block export of customer contact information to non-approved channels
  - Warn when deal value modifications exceed defined thresholds
  - Audit all CRM record access outside assigned territory

### Work IQ Integration Pattern

Sales agents deeply integrate with existing Work IQ MCPs:
- **Sales Rep Agent** → Work IQ Mail (auto-log emails to CRM contacts) + Work IQ Calendar (sync meeting notes to opportunities)
- **Sales Manager Agent** → Work IQ Teams (post pipeline updates, deal alerts to sales channels)
- **Lead Generation Agent** → Work IQ Mail (track prospect email engagement)

This creates rich cross-pillar connections on the orchestration canvas — showing Dynamics 365 MCPs on the left, Work IQ MCPs above them, and Sales agents on the right, all interconnected.

### Mock Data Additions

- **3 MCP servers** in `mcpServers` array
- **3 agents** in `agentData` array with Entra identity and Agent 365 fields
- **6 skills** distributed across the 3 agents
- **1 blueprint** in `agentBlueprints`
- **1 DLP policy** in `dlpPolicies`
- **3-5 agent traces** for sales agents
- **2-3 approval requests** (e.g., "Sales Rep Agent requesting access to D365 Sales Core")
- **3-4 IQ signals** (e.g., "Pipeline velocity declining 15% in EMEA region")

## Open Questions

_None — all major decisions resolved through collaborative dialogue._

## Next Steps

→ `/ce-plan` to create the implementation plan with file changes and mock data design.
