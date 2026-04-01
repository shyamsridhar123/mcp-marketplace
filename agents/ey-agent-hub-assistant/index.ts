import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

import {
  approvalStageFilters,
  briefingAudiences,
  getApprovalQueueText,
  getEntityDetailsText,
  getExecutiveBriefingText,
  getHotspotsText,
  getJourneyMapText,
  getPlatformOverviewText,
  getSearchCatalogText,
  hotspotFilters,
  journeyIds,
  searchEntityTypes,
} from "./grounding"

function textResult(text: string) {
  return {
    content: [{ type: "text" as const, text }],
  }
}

export default agent({
  model: "claude-sonnet-4-6",
  maxTurns: 14,
  systemPrompt: `You are Ask the Hub, the enterprise operating copilot inside an EY-themed AI marketplace.

Your job is to help users understand agents, MCP connections, approvals, blueprint readiness, business narratives, journeys, rollout blockers, and operational risk.

The workspace uses curated platform-aligned scenario data. Treat tool output as the source of truth for this experience. Never invent agents, MCPs, approvals, metrics, regions, or initiatives that were not returned by a tool.

How to work:
- Prefer tools before answering.
- Use searchCatalog first when the user uses an ambiguous name or fuzzy description.
- Use getPlatformOverview for a quick operating summary.
- Use getExecutiveBriefing for leadership, sales, governance, or operations rollups.
- Use getApprovalQueue for approval and governance queue questions.
- Use getHotspots when the user asks what needs attention, what is blocked, or what is at risk.
- Use getJourneyMap for “how does this work” or end-to-end workflow questions.
- Use getEntityDetails for specific agents, MCPs, approvals, blueprints, initiatives, journeys, or hotspots.

When you answer:
- Be concise, grounded, and action-oriented.
- Include exact names, owners, stages, and next steps when available.
- If something cannot be found, say so plainly and offer the closest search matches.
`,
  tools: {
    getPlatformOverview: tool({
      description: "Return a concise overview of the platform, active programs, and what needs attention.",
      inputSchema: z.object({}),
      execute: async () => textResult(getPlatformOverviewText()),
    }),
    searchCatalog: tool({
      description: "Search across agents, MCPs, approvals, blueprints, initiatives, journeys, and hotspots.",
      inputSchema: z.object({
        query: z.string().min(2),
        entityType: z.enum(searchEntityTypes).optional(),
      }),
      execute: async ({ query, entityType }) =>
        textResult(getSearchCatalogText(query, entityType)),
    }),
    getEntityDetails: tool({
      description: "Get the detail view for a specific agent, MCP, approval, blueprint, initiative, journey, or hotspot.",
      inputSchema: z.object({
        query: z.string().min(2),
      }),
      execute: async ({ query }) => textResult(getEntityDetailsText(query)),
    }),
    getExecutiveBriefing: tool({
      description: "Get a leadership-style briefing for executive, sales, governance, or operations audiences.",
      inputSchema: z.object({
        audience: z.enum(briefingAudiences).optional(),
      }),
      execute: async ({ audience }) =>
        textResult(getExecutiveBriefingText(audience ?? "executive")),
    }),
    getApprovalQueue: tool({
      description: "Inspect the approval queue by stage and optional domain filter.",
      inputSchema: z.object({
        stage: z.enum(approvalStageFilters).optional(),
        domain: z.string().min(2).optional(),
      }),
      execute: async ({ stage, domain }) =>
        textResult(getApprovalQueueText(stage ?? "attention", domain)),
    }),
    getHotspots: tool({
      description: "List the main rollout, sales, Work IQ, governance, or platform hotspots that need attention.",
      inputSchema: z.object({
        category: z.enum(hotspotFilters).optional(),
      }),
      execute: async ({ category }) =>
        textResult(getHotspotsText(category ?? "all")),
    }),
    getJourneyMap: tool({
      description: "Explain an end-to-end workflow for seller, knowledge worker, governance review, or onboarding scenarios.",
      inputSchema: z.object({
        journey: z.enum(journeyIds),
      }),
      execute: async ({ journey }) => textResult(getJourneyMapText(journey)),
    }),
  },
})