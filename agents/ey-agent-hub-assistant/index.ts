import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

import {
  agentBlueprints,
  agentData,
  approvalRequests,
  iqSignals,
  mcpServers,
} from "../../lib/data"
import type { Agent, AgentBlueprint, ApprovalRequest, IQSignal, MCP } from "../../lib/types"

const catalogEntityTypes = [
  "all",
  "agents",
  "mcps",
  "blueprints",
  "approvals",
  "signals",
] as const

const detailsEntityTypes = ["agent", "mcp", "blueprint"] as const

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function matchesQuery(parts: ReadonlyArray<string | undefined>, query: string): boolean {
  return parts.some((part) => Boolean(part) && normalize(part ?? "").includes(query))
}

function formatMcpList(connectionIds: ReadonlyArray<string>): string {
  if (connectionIds.length === 0) {
    return "None"
  }

  return connectionIds
    .map((id) => mcpServers.find((mcp) => mcp.id === id)?.name ?? id)
    .join(", ")
}

function formatAgentSummary(item: Agent): string {
  return [
    `Agent: ${item.name} (${item.id})`,
    `Status: ${item.status} • Department: ${item.department}`,
    `Connected MCPs: ${formatMcpList(item.mcpConnections)}`,
    `Success rate: ${item.successRate}% • Requests handled: ${item.requestsHandled.toLocaleString()}`,
  ].join("\n")
}

function formatMcpSummary(item: MCP): string {
  return [
    `MCP: ${item.name} (${item.id})`,
    `Category: ${item.category} • Status: ${item.status} • Provider: ${item.provider}`,
    `Compliance: ${item.complianceLevel} • Classification: ${item.dataClassification}`,
    `Key capabilities: ${item.capabilities.join(", ")}`,
  ].join("\n")
}

function formatBlueprintSummary(item: AgentBlueprint): string {
  return [
    `Blueprint: ${item.name} (${item.id})`,
    `Status: ${item.status}`,
    `Capabilities: ${item.capabilities.join(", ")}`,
    `Required MCPs: ${formatMcpList(item.requiredMCPServers)}`,
  ].join("\n")
}

function formatApprovalSummary(item: ApprovalRequest): string {
  return [
    `Approval: ${item.title} (${item.id})`,
    `Stage: ${item.stage} • Type: ${item.type}`,
    `Entity: ${item.entityType} ${item.entityId}`,
    `Requestor: ${item.requestorName}`,
  ].join("\n")
}

function formatSignalSummary(item: IQSignal): string {
  return [
    `Signal: ${item.type} (${item.id})`,
    `Source: ${item.source} • Layer: ${item.layer} • Confidence: ${(item.confidence * 100).toFixed(0)}%`,
    `Content: ${item.content}`,
  ].join("\n")
}

function formatAgentDetails(item: Agent): string {
  const skillList = item.skills.length > 0
    ? item.skills
        .map((skill) => `${skill.name} (${skill.mcpName}${skill.isActive ? ", active" : ", inactive"})`)
        .join("; ")
    : "None"

  const identityDetails = item.entraIdentity
    ? [
        `Entra app: ${item.entraIdentity.appId}`,
        `Mailbox: ${item.entraIdentity.mailbox}`,
        `Permission grants: ${item.entraIdentity.permissions
          .map(
            (permission) =>
              `${permission.mcpId} [${permission.scopes.join(", ")}] (${permission.consentStatus})`,
          )
          .join("; ")}`,
      ].join("\n")
    : "Entra identity: Not configured"

  return [
    formatAgentSummary(item),
    `Description: ${item.description}`,
    `Skills: ${skillList}`,
    `Lifecycle: ${item.lifecycleStatus ?? "not set"} • Observability: ${item.observabilityEnabled ? "enabled" : "disabled"}`,
    identityDetails,
  ].join("\n")
}

function formatMcpDetails(item: MCP): string {
  return [
    formatMcpSummary(item),
    `Description: ${item.description}`,
    `Downloads: ${item.downloads.toLocaleString()} • Rating: ${item.rating.toFixed(1)} (${item.ratingCount} reviews)`,
    `Tags: ${item.tags.join(", ")}`,
    `Installed: ${item.isInstalled ? "yes" : "no"}${item.adminConsentRequired ? " • Admin consent required" : ""}`,
  ].join("\n")
}

function formatBlueprintDetails(item: AgentBlueprint): string {
  return [
    formatBlueprintSummary(item),
    `Description: ${item.description}`,
    `Security constraints: ${item.securityConstraints.join("; ")}`,
    `Compliance requirements: ${item.complianceRequirements.join("; ")}`,
    `Governance policies: ${item.governancePolicies.join(", ")}`,
  ].join("\n")
}

const searchCatalogTool = tool({
  description:
    "Search the EY Agent Hub demo catalog across agents, MCPs, governance approvals, blueprints, and intelligence signals.",
  inputSchema: z.object({
    query: z.string().min(2).describe("Keywords to search for in the EY Agent Hub catalog"),
    entityType: z
      .enum(catalogEntityTypes)
      .default("all")
      .describe("Optional area to limit the search to"),
    limit: z.number().int().min(1).max(8).default(5),
  }),
  execute: async ({ query, entityType, limit }) => {
    const normalizedQuery = normalize(query)
    const sections: string[] = []

    if (entityType === "all" || entityType === "agents") {
      const matches = agentData
        .filter((item) =>
          matchesQuery(
            [
              item.id,
              item.name,
              item.description,
              item.department,
              item.blueprintId,
              ...item.mcpConnections,
              ...item.skills.map((skill) => `${skill.name} ${skill.description} ${skill.mcpName}`),
            ],
            normalizedQuery,
          ),
        )
        .slice(0, limit)

      if (matches.length > 0) {
        sections.push(`Agents\n${matches.map(formatAgentSummary).join("\n\n")}`)
      }
    }

    if (entityType === "all" || entityType === "mcps") {
      const matches = mcpServers
        .filter((item) =>
          matchesQuery(
            [
              item.id,
              item.name,
              item.description,
              item.shortDescription,
              item.provider,
              item.category,
              item.complianceLevel,
              item.dataClassification,
              ...item.tags,
              ...item.capabilities,
            ],
            normalizedQuery,
          ),
        )
        .slice(0, limit)

      if (matches.length > 0) {
        sections.push(`MCPs\n${matches.map(formatMcpSummary).join("\n\n")}`)
      }
    }

    if (entityType === "all" || entityType === "blueprints") {
      const matches = agentBlueprints
        .filter((item) =>
          matchesQuery(
            [
              item.id,
              item.name,
              item.description,
              ...item.capabilities,
              ...item.requiredMCPServers,
              ...item.complianceRequirements,
            ],
            normalizedQuery,
          ),
        )
        .slice(0, limit)

      if (matches.length > 0) {
        sections.push(`Blueprints\n${matches.map(formatBlueprintSummary).join("\n\n")}`)
      }
    }

    if (entityType === "all" || entityType === "approvals") {
      const matches = approvalRequests
        .filter((item) =>
          matchesQuery(
            [
              item.id,
              item.title,
              item.description,
              item.requestorName,
              item.entityId,
              item.entityType,
              item.stage,
            ],
            normalizedQuery,
          ),
        )
        .slice(0, limit)

      if (matches.length > 0) {
        sections.push(`Approvals\n${matches.map(formatApprovalSummary).join("\n\n")}`)
      }
    }

    if (entityType === "all" || entityType === "signals") {
      const matches = iqSignals
        .filter((item) =>
          matchesQuery(
            [item.id, item.type, item.source, item.layer, item.content, item.agentId],
            normalizedQuery,
          ),
        )
        .slice(0, limit)

      if (matches.length > 0) {
        sections.push(`Signals\n${matches.map(formatSignalSummary).join("\n\n")}`)
      }
    }

    return {
      content: [
        {
          type: "text",
          text:
            sections.length > 0
              ? sections.join("\n\n---\n\n")
              : `No catalog matches found for “${query}”.`,
        },
      ],
    }
  },
})

const getPlatformOverviewTool = tool({
  description: "Return a quick overview of the EY Agent Hub demo platform.",
  inputSchema: z.object({}),
  execute: async () => {
    const activeAgents = agentData.filter((item) => item.status === "active").length
    const pendingApprovals = approvalRequests.filter(
      (item) => item.stage === "pending" || item.stage === "in-review",
    ).length
    const workIqMcps = mcpServers.filter((item) => item.isWorkIQ).length
    const installedMcps = mcpServers.filter((item) => item.isInstalled).length
    const averageSuccessRate =
      agentData.reduce((total, item) => total + item.successRate, 0) / agentData.length

    return {
      content: [
        {
          type: "text",
          text: [
            "EY Agent Hub overview",
            `Agents: ${agentData.length} total • ${activeAgents} active`,
            `MCPs: ${mcpServers.length} total • ${installedMcps} installed • ${workIqMcps} Work IQ integrations`,
            `Blueprints: ${agentBlueprints.length} total`,
            `Pending approvals: ${pendingApprovals}`,
            `IQ signals in feed: ${iqSignals.length}`,
            `Average agent success rate: ${averageSuccessRate.toFixed(1)}%`,
          ].join("\n"),
        },
      ],
    }
  },
})

const getEntityDetailsTool = tool({
  description: "Fetch detailed information for a specific agent, MCP, or blueprint by id or display name.",
  inputSchema: z.object({
    entityType: z.enum(detailsEntityTypes),
    idOrName: z.string().min(2).describe("The id or display name of the entity"),
  }),
  execute: async ({ entityType, idOrName }) => {
    const normalizedValue = normalize(idOrName)

    if (entityType === "agent") {
      const item = agentData.find(
        (candidate) =>
          normalize(candidate.id) === normalizedValue || normalize(candidate.name) === normalizedValue,
      )

      return {
        content: [
          {
            type: "text",
            text: item
              ? formatAgentDetails(item)
              : `No agent matched “${idOrName}”.`,
          },
        ],
      }
    }

    if (entityType === "mcp") {
      const item = mcpServers.find(
        (candidate) =>
          normalize(candidate.id) === normalizedValue || normalize(candidate.name) === normalizedValue,
      )

      return {
        content: [
          {
            type: "text",
            text: item
              ? formatMcpDetails(item)
              : `No MCP matched “${idOrName}”.`,
          },
        ],
      }
    }

    const item = agentBlueprints.find(
      (candidate) =>
        normalize(candidate.id) === normalizedValue || normalize(candidate.name) === normalizedValue,
    )

    return {
      content: [
        {
          type: "text",
          text: item
            ? formatBlueprintDetails(item)
            : `No blueprint matched “${idOrName}”.`,
        },
      ],
    }
  },
})

export default agent({
  model: "claude-sonnet-4-6",
  systemPrompt:
    "You are the EY Agent Hub Assistant. Help users explore the EY AI Agent Hub demo catalog. Always ground your answers in the available tools and clearly say when something is not present in the bundled dataset. Be concise, practical, and mention governance or integration caveats when they matter.",
  maxTurns: 8,
  tools: {
    getPlatformOverview: getPlatformOverviewTool,
    searchCatalog: searchCatalogTool,
    getEntityDetails: getEntityDetailsTool,
  },
  onFinish: async ({ cost, duration, turns }) => {
    console.log(`[ey-agent-hub-assistant] Finished ${turns} turns in ${duration}ms ($${cost.toFixed(4)})`)
  },
})