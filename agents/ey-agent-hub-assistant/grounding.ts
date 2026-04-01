import {
  agentBlueprints,
  agentData,
  agentTraces,
  approvalRequests,
  dlpPolicies,
  iqSignals,
  mcpData,
} from "../../lib/data"
import type {
  Agent,
  AgentBlueprint,
  AgentTrace,
  ApprovalRequest,
  DLPPolicy,
  IQSignal,
  MCP,
} from "../../lib/types"

export interface PriorityInitiative {
  readonly id: string
  readonly name: string
  readonly theme: "adoption" | "sales" | "governance" | "operations"
  readonly stage: "green" | "amber" | "red"
  readonly owner: string
  readonly summary: string
  readonly kpis: readonly string[]
  readonly risks: readonly string[]
  readonly nextMilestone: string
  readonly relatedAgentIds: readonly string[]
  readonly relatedMcpIds: readonly string[]
}

export interface RegionalPerformance {
  readonly id: string
  readonly region: "Americas" | "EMEA" | "APAC"
  readonly health: "green" | "amber" | "red"
  readonly summary: string
  readonly netNewRevenue: string
  readonly stalledDeals: number
  readonly adoptionScore: number
  readonly recommendedAction: string
}

export interface OperationalHotspot {
  readonly id: string
  readonly title: string
  readonly category: "sales" | "governance" | "work-iq" | "platform"
  readonly severity: "high" | "medium" | "low"
  readonly summary: string
  readonly evidence: readonly string[]
  readonly recommendedAction: string
  readonly relatedEntityIds: readonly string[]
}

export interface ExperienceJourney {
  readonly id: string
  readonly name: string
  readonly persona: string
  readonly summary: string
  readonly steps: readonly string[]
  readonly successSignal: string
  readonly riskSignal: string
  readonly relatedAgentIds: readonly string[]
  readonly relatedMcpIds: readonly string[]
}

export interface SearchResult {
  readonly entityType: SearchEntityType
  readonly entityId: string
  readonly title: string
  readonly summary: string
  readonly score: number
}

export const briefingAudiences = [
  "executive",
  "sales",
  "governance",
  "operations",
] as const

export const approvalStageFilters = [
  "all",
  "attention",
  "pending",
  "in-review",
  "approved",
  "rejected",
] as const

export const hotspotFilters = [
  "all",
  "sales",
  "governance",
  "work-iq",
  "platform",
] as const

export const journeyIds = [
  "seller",
  "knowledge-worker",
  "governance-review",
  "onboarding",
] as const

export const searchEntityTypes = [
  "agent",
  "mcp",
  "approval",
  "blueprint",
  "initiative",
  "journey",
  "hotspot",
] as const

export type BriefingAudience = (typeof briefingAudiences)[number]
export type ApprovalStageFilter = (typeof approvalStageFilters)[number]
export type HotspotFilter = (typeof hotspotFilters)[number]
export type JourneyId = (typeof journeyIds)[number]
export type SearchEntityType = (typeof searchEntityTypes)[number]

const priorityInitiatives: readonly PriorityInitiative[] = [
  {
    id: "initiative-workiq-rollout",
    name: "Work IQ Rollout Wave 2",
    theme: "adoption",
    stage: "amber",
    owner: "Alex Haliburton",
    summary:
      "Expand Work IQ-powered daily briefing patterns from pilot teams into shared services, sales enablement, and HR without increasing DLP noise.",
    kpis: [
      "74% of daily brief requests now resolve without human escalation",
      "3 Work IQ services are already live in production scenarios",
      "Wave 2 launch is waiting on Teams channel approval coverage",
    ],
    risks: [
      "Teams publishing access is still pending for some rollout paths",
      "Confidentiality labels are inconsistent across some SharePoint knowledge packs",
    ],
    nextMilestone: "Approve channel-safe Teams rollout path by 2026-04-04",
    relatedAgentIds: ["knowledge-worker-agent", "hr-onboarding-agent"],
    relatedMcpIds: [
      "workiq-mail-mcp",
      "workiq-calendar-mcp",
      "workiq-teams-mcp",
      "workiq-sharepoint-mcp",
    ],
  },
  {
    id: "initiative-sales-recovery",
    name: "EMEA Sales Recovery Sprint",
    theme: "sales",
    stage: "red",
    owner: "Mike Chen",
    summary:
      "Recover EMEA pipeline velocity by combining seller follow-up automation, manager forecasting, and opportunity heat scoring before quarter close.",
    kpis: [
      "12 deals are stalled in negotiation for 14+ days",
      "$2.3M is currently flagged as revenue at risk",
      "Lead follow-up recommendations already cover 5 high-value opportunities",
    ],
    risks: [
      "Pipeline velocity is down 15% in EMEA",
      "Conversation intelligence access is still not fully approved for every growth scenario",
    ],
    nextMilestone: "Clear stalled negotiation follow-ups before Friday regional forecast review",
    relatedAgentIds: ["sales-rep-agent", "sales-manager-agent", "lead-gen-agent"],
    relatedMcpIds: [
      "d365-sales-core",
      "d365-sales-insights",
      "d365-copilot-sales",
      "workiq-calendar-mcp",
      "workiq-mail-mcp",
    ],
  },
  {
    id: "initiative-governance-fast-lane",
    name: "Governance Fast Lane",
    theme: "governance",
    stage: "green",
    owner: "James Wilson",
    summary:
      "Shorten approval cycle times for low-risk connector and blueprint changes while keeping auditability and policy checkpoints intact.",
    kpis: [
      "Rate-limit threshold update shipped through approval in 1 business day",
      "Approval queue is concentrated in 4 items that still need active review",
      "Blueprint alignment is now explicit for every sales-focused agent",
    ],
    risks: [
      "HR onboarding activation still depends on one unresolved permission grant",
      "Some approval requests still rely on manual narrative updates instead of prefilled evidence",
    ],
    nextMilestone: "Move HR onboarding registration from in-review to approved with scoped SharePoint consent",
    relatedAgentIds: ["hr-onboarding-agent", "sales-rep-agent", "lead-gen-agent"],
    relatedMcpIds: ["workiq-sharepoint-mcp", "d365-copilot-sales"],
  },
  {
    id: "initiative-ops-hardening",
    name: "Operational Hardening Sprint",
    theme: "operations",
    stage: "amber",
    owner: "David Kim",
    summary:
      "Tighten observability, reduce inference spikes, and turn noisy failures into guided remediation across platform-facing agents.",
    kpis: [
      "9 of 11 cataloged agents already have observability enabled",
      "Compliance Sentinel is healthy, but Compliance Agent latency is elevated",
      "Data Analytics Agent is still in training and lacks production-grade telemetry",
    ],
    risks: [
      "Compliance Agent latency is spiking above its normal baseline",
      "Data Analytics Agent failures are harder to diagnose because observability is disabled",
    ],
    nextMilestone: "Close the observability gap for training-stage agents before the next release wave",
    relatedAgentIds: ["compliance-agent", "compliance-sentinel", "data-agent", "devops-agent"],
    relatedMcpIds: ["axiom-mcp", "betterstack-mcp", "github-mcp"],
  },
] as const

const regionalPerformance: readonly RegionalPerformance[] = [
  {
    id: "region-americas",
    region: "Americas",
    health: "green",
    summary:
      "Pipeline coverage is healthy and Work IQ adoption is strongest in shared services and inside sales.",
    netNewRevenue: "$4.8M",
    stalledDeals: 4,
    adoptionScore: 89,
    recommendedAction: "Keep manager summaries automated and use the Americas playbook as the EMEA recovery baseline.",
  },
  {
    id: "region-emea",
    region: "EMEA",
    health: "red",
    summary:
      "Negotiation-stage opportunities are aging out and follow-up discipline is inconsistent across territory pods.",
    netNewRevenue: "$2.1M",
    stalledDeals: 12,
    adoptionScore: 72,
    recommendedAction: "Use seller + manager agents together to re-sequence outreach on the 5 highest-value dormant opportunities.",
  },
  {
    id: "region-apac",
    region: "APAC",
    health: "green",
    summary:
      "Adoption is steady, forecasts are within tolerance, and enablement teams are preparing for the next CRM automation wave.",
    netNewRevenue: "$3.2M",
    stalledDeals: 5,
    adoptionScore: 81,
    recommendedAction: "Promote the strongest APAC opportunity hygiene habits into the shared onboarding deck for new sellers.",
  },
] as const

const operationalHotspots: readonly OperationalHotspot[] = [
  {
    id: "hotspot-emea-pipeline",
    title: "EMEA pipeline drag is the loudest business risk",
    category: "sales",
    severity: "high",
    summary:
      "Pipeline velocity is slipping and high-value opportunities have gone quiet long enough to threaten quarter-close confidence.",
    evidence: [
      "Work IQ flagged 12 negotiation-stage deals stalled for 14+ days",
      "$2.3M at risk recommendation is already queued for seller follow-up",
      "EMEA adoption score trails Americas by 17 points",
    ],
    recommendedAction:
      "Pull a manager briefing, schedule guided follow-ups for dormant deals, and track recovery against the EMEA sprint milestone.",
    relatedEntityIds: [
      "sales-rep-agent",
      "sales-manager-agent",
      "lead-gen-agent",
      "initiative-sales-recovery",
      "region-emea",
    ],
  },
  {
    id: "hotspot-workiq-access",
    title: "Work IQ expansion is gated by selective connector approvals",
    category: "governance",
    severity: "medium",
    summary:
      "Wave 2 rollout work is largely ready, but a few approvals still gate channel publishing and richer collaboration flows.",
    evidence: [
      "DevOps Assistant is still waiting on Work IQ Teams access",
      "HR Onboarding Agent is still in-review because SharePoint scope approval is pending",
      "Lead Gen Agent still needs Copilot for Sales access to complete the full engagement loop",
    ],
    recommendedAction:
      "Prioritize the low-risk approvals with the biggest downstream reach: Teams notifications, HR onboarding documents, and sales engagement enrichment.",
    relatedEntityIds: [
      "apr-001",
      "apr-002",
      "apr-007",
      "initiative-workiq-rollout",
      "initiative-governance-fast-lane",
    ],
  },
  {
    id: "hotspot-compliance-latency",
    title: "Compliance Agent latency needs operational tuning",
    category: "platform",
    severity: "high",
    summary:
      "Inference latency has drifted far above the normal baseline, creating risk for time-sensitive monitoring flows.",
    evidence: [
      "Foundry-style signal reports 2300ms average latency versus a 145ms normal baseline",
      "Recent failure and timeout traces show performance instability across adjacent compliance paths",
      "Compliance Sentinel is healthy, which points to a localized tuning issue rather than a platform-wide outage",
    ],
    recommendedAction:
      "Treat this as a contained tuning sprint: inspect recent model/tool patterns, compare Sentinel vs Compliance execution paths, and restore the expected latency envelope.",
    relatedEntityIds: [
      "compliance-agent",
      "compliance-sentinel",
      "initiative-ops-hardening",
    ],
  },
  {
    id: "hotspot-hr-readiness",
    title: "HR onboarding is close to launch but not yet production-safe",
    category: "work-iq",
    severity: "medium",
    summary:
      "The onboarding experience is strategically valuable and already aligned to an OKR, but one approval bottleneck still blocks full release confidence.",
    evidence: [
      "HR Onboarding Agent is in review rather than active",
      "Blueprint activation is still pending",
      "SharePoint write permissions are still pending even though mail + database scopes are ready",
    ],
    recommendedAction:
      "Finish the SharePoint permission review, then graduate the blueprint and agent together as one controlled release.",
    relatedEntityIds: [
      "hr-onboarding-agent",
      "bp-hr-onboarding",
      "apr-001",
      "apr-003",
      "initiative-workiq-rollout",
    ],
  },
  {
    id: "hotspot-observability-gap",
    title: "Training-stage analytics still has an observability blind spot",
    category: "platform",
    severity: "medium",
    summary:
      "The Data Analytics Agent is useful for future intelligence scenarios, but failures are harder to explain because telemetry coverage is not yet enabled.",
    evidence: [
      "Data Analytics Agent success rate is the lowest in the fleet at 94.2%",
      "Recent inference trace failed",
      "Observability is explicitly disabled on the agent record",
    ],
    recommendedAction:
      "Enable observability before expanding the training program so every failure becomes a reusable learning signal.",
    relatedEntityIds: ["data-agent", "initiative-ops-hardening"],
  },
] as const

const experienceJourneys: readonly ExperienceJourney[] = [
  {
    id: "seller",
    name: "Seller recovery loop",
    persona: "Field seller and sales manager",
    summary:
      "Use CRM + Work IQ signals to spot stalled deals, prep the next touchpoint, and turn manager oversight into guided action.",
    steps: [
      "Lead Generation Agent enriches the account and flags buying signals from email activity.",
      "Sales Rep Agent converts meetings and conversations into CRM updates with clear follow-up tasks.",
      "Sales Manager Agent watches pipeline velocity, forecast drift, and stalled negotiations by region.",
      "The team uses the manager briefing to target dormant opportunities before revenue slips further.",
    ],
    successSignal: "Seller follow-ups concentrate on the riskiest opportunities instead of the loudest ones.",
    riskSignal: "Conversation intelligence or follow-up automation stalls because access approvals or adoption lag behind.",
    relatedAgentIds: ["lead-gen-agent", "sales-rep-agent", "sales-manager-agent"],
    relatedMcpIds: [
      "d365-sales-core",
      "d365-sales-insights",
      "d365-copilot-sales",
      "workiq-mail-mcp",
      "workiq-calendar-mcp",
    ],
  },
  {
    id: "knowledge-worker",
    name: "Knowledge worker daily briefing",
    persona: "Consultant or operations lead",
    summary:
      "Roll email, meetings, collaboration, and documents into a single daily operating brief without leaving the hub.",
    steps: [
      "Work IQ Mail identifies priority threads and unfinished actions.",
      "Work IQ Calendar prepares meeting context and conflict warnings.",
      "Work IQ SharePoint pulls the latest document context and knowledge updates.",
      "The Knowledge Worker Agent turns those signals into a concise working brief with next actions.",
    ],
    successSignal: "People start the day with one grounded view of priorities, conflicts, and document changes.",
    riskSignal: "The loop weakens when Teams publication or document boundary controls are not fully aligned.",
    relatedAgentIds: ["knowledge-worker-agent"],
    relatedMcpIds: [
      "workiq-mail-mcp",
      "workiq-calendar-mcp",
      "workiq-sharepoint-mcp",
      "workiq-teams-mcp",
    ],
  },
  {
    id: "governance-review",
    name: "Governance review fast lane",
    persona: "Platform approver or IT admin",
    summary:
      "Review the highest-impact approvals with enough context to unblock safe releases quickly.",
    steps: [
      "The approval queue groups pending and in-review items by downstream impact.",
      "Blueprint, connector, and DLP context is surfaced alongside the request narrative.",
      "High-impact low-risk requests get routed first to keep rollouts moving.",
      "Decision rationale feeds back into future request quality and approval speed.",
    ],
    successSignal: "Approvals become short, evidence-based decisions rather than manual archaeology.",
    riskSignal: "Good rollout work stays blocked because evidence is spread across tools and not summarized early.",
    relatedAgentIds: ["hr-onboarding-agent", "devops-agent", "lead-gen-agent"],
    relatedMcpIds: ["workiq-teams-mcp", "workiq-sharepoint-mcp", "d365-copilot-sales"],
  },
  {
    id: "onboarding",
    name: "New hire onboarding flow",
    persona: "HR operations and hiring manager",
    summary:
      "Coordinate welcome communications, document generation, and system readiness without leaving gaps in compliance review.",
    steps: [
      "HR Onboarding Agent drafts welcome communication and tracks onboarding milestones.",
      "SharePoint templates generate role-specific documents and checklists.",
      "Database-backed workflow state keeps task completion visible for HR operations.",
      "Governance review validates that the blueprint, permissions, and handling rules are ready for production.",
    ],
    successSignal: "Time-to-productivity drops because onboarding steps are sequenced instead of manually chased.",
    riskSignal: "One unresolved permission can hold the entire experience in review even when the workflow is otherwise ready.",
    relatedAgentIds: ["hr-onboarding-agent"],
    relatedMcpIds: ["workiq-mail-mcp", "workiq-sharepoint-mcp", "supabase-mcp"],
  },
] as const

const attentionStages = new Set<ApprovalRequest["stage"]>(["pending", "in-review"])
const workIqMcpIds = new Set(
  mcpData.filter((mcp) => mcp.isWorkIQ).map((mcp) => mcp.id),
)

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim()
}

function formatLabel(value: string): string {
  return value
    .split(/[-\s]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
}

function formatStageChip(value: string): string {
  return value === "in-review" ? "In review" : formatLabel(value)
}

function formatDateLabel(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toISOString().slice(0, 10)
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

function scoreMatch(query: string, values: readonly string[]): number {
  const normalizedQuery = normalizeText(query)
  if (!normalizedQuery) {
    return 0
  }

  const tokens = normalizedQuery.split(" ")
  let score = 0

  for (const value of values) {
    const normalizedValue = normalizeText(value)
    if (!normalizedValue) {
      continue
    }

    if (normalizedValue === normalizedQuery) {
      score += 120
    }

    if (normalizedValue.startsWith(normalizedQuery)) {
      score += 80
    }

    if (normalizedValue.includes(normalizedQuery)) {
      score += 45
    }

    for (const token of tokens) {
      if (normalizedValue.includes(token)) {
        score += token.length > 3 ? 8 : 4
      }
    }
  }

  return score
}

function formatBulletList(values: readonly string[]): string {
  if (values.length === 0) {
    return "- None currently"
  }

  return values.map((value) => `- ${value}`).join("\n")
}

function getConnectedMcps(agent: Agent): MCP[] {
  return mcpData.filter((mcp) => agent.mcpConnections.includes(mcp.id))
}

function getRelatedApprovals(entityId: string): ApprovalRequest[] {
  return approvalRequests.filter((approval) => approval.entityId === entityId)
}

function getRelatedSignals(agentId?: string): IQSignal[] {
  return iqSignals
    .filter((signal) => signal.agentId === agentId)
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
}

function getRecentTraces(agentId: string): AgentTrace[] {
  return agentTraces
    .filter((trace) => trace.agentId === agentId)
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
}

function getRelatedInitiatives(entityId: string): PriorityInitiative[] {
  return priorityInitiatives.filter(
    (initiative) =>
      initiative.relatedAgentIds.includes(entityId) ||
      initiative.relatedMcpIds.includes(entityId) ||
      initiative.id === entityId,
  )
}

function getRelatedHotspots(entityId: string): OperationalHotspot[] {
  return operationalHotspots.filter((hotspot) => hotspot.relatedEntityIds.includes(entityId))
}

function getPlatformSnapshot() {
  const activeAgents = agentData.filter((agent) => agent.status === "active")
  const installedMcps = mcpData.filter((mcp) => mcp.isInstalled)
  const workIqAgents = agentData.filter((agent) =>
    agent.mcpConnections.some((connection) => workIqMcpIds.has(connection)),
  )
  const attentionApprovals = approvalRequests.filter((approval) => attentionStages.has(approval.stage))
  const observabilityEnabled = agentData.filter((agent) => agent.observabilityEnabled).length

  return {
    activeAgents,
    installedMcps,
    workIqAgents,
    attentionApprovals,
    observabilityEnabled,
    departmentCount: new Set(activeAgents.map((agent) => agent.department)).size,
    installedWorkIqCount: installedMcps.filter((mcp) => mcp.isWorkIQ).length,
  }
}

function buildSearchResults(query: string, entityType?: SearchEntityType): SearchResult[] {
  const hits: SearchResult[] = []

  const maybePushHit = (candidate: SearchResult, allowedType: SearchEntityType) => {
    if (entityType && entityType !== allowedType) {
      return
    }

    if (candidate.score > 0) {
      hits.push(candidate)
    }
  }

  for (const agent of agentData) {
    maybePushHit(
      {
        entityType: "agent",
        entityId: agent.id,
        title: agent.name,
        summary: `${agent.department} • ${formatStageChip(agent.lifecycleStatus ?? agent.status)} • ${agent.mcpConnections.length} MCP connections`,
        score: scoreMatch(query, [agent.name, agent.id, agent.description, agent.department]),
      },
      "agent",
    )
  }

  for (const mcp of mcpData) {
    maybePushHit(
      {
        entityType: "mcp",
        entityId: mcp.id,
        title: mcp.name,
        summary: `${mcp.provider} • ${mcp.category} • ${mcp.isInstalled ? "Installed" : "Available"}`,
        score: scoreMatch(query, [mcp.name, mcp.id, mcp.description, ...mcp.tags]),
      },
      "mcp",
    )
  }

  for (const approval of approvalRequests) {
    maybePushHit(
      {
        entityType: "approval",
        entityId: approval.id,
        title: approval.title,
        summary: `${formatStageChip(approval.stage)} • ${approval.requestorName} • ${formatDateLabel(approval.submittedAt)}`,
        score: scoreMatch(query, [
          approval.title,
          approval.id,
          approval.description,
          approval.requestorName,
          approval.entityId,
        ]),
      },
      "approval",
    )
  }

  for (const blueprint of agentBlueprints) {
    maybePushHit(
      {
        entityType: "blueprint",
        entityId: blueprint.id,
        title: blueprint.name,
        summary: `${formatStageChip(blueprint.status)} • ${blueprint.capabilities.length} capabilities`,
        score: scoreMatch(query, [blueprint.name, blueprint.id, blueprint.description, ...blueprint.capabilities]),
      },
      "blueprint",
    )
  }

  for (const initiative of priorityInitiatives) {
    maybePushHit(
      {
        entityType: "initiative",
        entityId: initiative.id,
        title: initiative.name,
        summary: `${formatLabel(initiative.theme)} • ${formatLabel(initiative.stage)} • ${initiative.owner}`,
        score: scoreMatch(query, [initiative.name, initiative.id, initiative.summary, initiative.owner]),
      },
      "initiative",
    )
  }

  for (const journey of experienceJourneys) {
    maybePushHit(
      {
        entityType: "journey",
        entityId: journey.id,
        title: journey.name,
        summary: `${journey.persona} • ${journey.summary}`,
        score: scoreMatch(query, [journey.name, journey.id, journey.persona, journey.summary]),
      },
      "journey",
    )
  }

  for (const hotspot of operationalHotspots) {
    maybePushHit(
      {
        entityType: "hotspot",
        entityId: hotspot.id,
        title: hotspot.title,
        summary: `${formatLabel(hotspot.category)} • ${formatLabel(hotspot.severity)} severity`,
        score: scoreMatch(query, [hotspot.title, hotspot.id, hotspot.summary, ...hotspot.evidence]),
      },
      "hotspot",
    )
  }

  return hits.sort((left, right) => right.score - left.score).slice(0, 8)
}

function formatAgentDetails(agent: Agent): string {
  const connections = getConnectedMcps(agent)
  const approvals = [
    ...getRelatedApprovals(agent.id),
    ...(agent.blueprintId ? getRelatedApprovals(agent.blueprintId) : []),
  ]
  const signals = getRelatedSignals(agent.id).slice(0, 3)
  const traces = getRecentTraces(agent.id).slice(0, 3)
  const initiatives = getRelatedInitiatives(agent.id)
  const hotspots = getRelatedHotspots(agent.id)
  const permissionLines = agent.entraIdentity?.permissions.map((permission) => {
    const mcp = mcpData.find((candidate) => candidate.id === permission.mcpId)
    return `${mcp?.name ?? permission.mcpId}: ${permission.scopes.join(", ")} (${formatStageChip(permission.consentStatus)})`
  }) ?? []

  return [
    `### ${agent.name}`,
    `- Department: ${agent.department}`,
    `- Status: ${formatStageChip(agent.lifecycleStatus ?? agent.status)}`,
    `- Requests handled: ${agent.requestsHandled.toLocaleString("en-US")}`,
    `- Success rate: ${formatPercent(agent.successRate)}`,
    `- Observability: ${agent.observabilityEnabled ? "Enabled" : "Not enabled"}`,
    agent.notificationChannels?.length
      ? `- Notification channels: ${agent.notificationChannels.join(", ")}`
      : "- Notification channels: Not configured",
    "",
    "### What it is responsible for",
    agent.description,
    "",
    "### Connected MCPs",
    formatBulletList(
      connections.map(
        (mcp) => `${mcp.name} (${mcp.provider}) — ${mcp.shortDescription}`,
      ),
    ),
    "",
    "### Permissions and access",
    formatBulletList(permissionLines),
    "",
    "### Related initiatives",
    formatBulletList(
      initiatives.map(
        (initiative) => `${initiative.name} (${formatLabel(initiative.stage)}) — ${initiative.nextMilestone}`,
      ),
    ),
    "",
    "### Recent signals",
    formatBulletList(signals.map((signal) => signal.content)),
    "",
    "### Recent traces",
    formatBulletList(
      traces.map(
        (trace) => `${formatDateLabel(trace.timestamp)} • ${trace.traceType} • ${formatStageChip(trace.result)}`,
      ),
    ),
    "",
    "### Watch items",
    formatBulletList(
      hotspots.map((hotspot) => `${hotspot.title} — ${hotspot.recommendedAction}`),
    ),
    "",
    "### Related approvals",
    formatBulletList(
      approvals.map(
        (approval) => `${approval.title} (${formatStageChip(approval.stage)}) — ${approval.description}`,
      ),
    ),
  ].join("\n")
}

function formatMcpDetails(mcp: MCP): string {
  const connectedAgents = agentData.filter((agent) => agent.mcpConnections.includes(mcp.id))
  const initiatives = getRelatedInitiatives(mcp.id)
  const hotspots = getRelatedHotspots(mcp.id)

  return [
    `### ${mcp.name}`,
    `- Provider: ${mcp.provider}`,
    `- Category: ${mcp.category}`,
    `- Status: ${formatStageChip(mcp.status)}`,
    `- Installed: ${mcp.isInstalled ? "Yes" : "No"}`,
    `- Compliance level: ${formatLabel(mcp.complianceLevel)}`,
    `- Data classification: ${formatLabel(mcp.dataClassification)}`,
    `- Admin consent required: ${mcp.adminConsentRequired ? "Yes" : "No"}`,
    mcp.isWorkIQ && mcp.workIQService
      ? `- Work IQ service: ${formatLabel(mcp.workIQService)}`
      : "- Work IQ service: Not applicable",
    "",
    "### Capabilities",
    formatBulletList(mcp.capabilities),
    "",
    "### Connected agents",
    formatBulletList(
      connectedAgents.map(
        (agent) => `${agent.name} (${agent.department}) — ${formatStageChip(agent.lifecycleStatus ?? agent.status)}`,
      ),
    ),
    "",
    "### Related initiatives",
    formatBulletList(
      initiatives.map(
        (initiative) => `${initiative.name} — next milestone: ${initiative.nextMilestone}`,
      ),
    ),
    "",
    "### Watch items",
    formatBulletList(
      hotspots.map((hotspot) => `${hotspot.title} — ${hotspot.summary}`),
    ),
  ].join("\n")
}

function formatApprovalDetails(approval: ApprovalRequest): string {
  return [
    `### ${approval.title}`,
    `- Stage: ${formatStageChip(approval.stage)}`,
    `- Type: ${formatLabel(approval.type)}`,
    `- Requestor: ${approval.requestorName}`,
    `- Submitted: ${formatDateLabel(approval.submittedAt)}`,
    approval.approverName ? `- Approver: ${approval.approverName}` : "- Approver: Not assigned",
    `- Entity: ${approval.entityType} / ${approval.entityId}`,
    "",
    "### Request summary",
    approval.description,
    "",
    "### Notes",
    approval.comments ?? "No reviewer comments yet.",
  ].join("\n")
}

function formatBlueprintDetails(blueprint: AgentBlueprint): string {
  const linkedAgents = agentData.filter((agent) => agent.blueprintId === blueprint.id)
  const governingPolicies = dlpPolicies.filter((policy) =>
    blueprint.governancePolicies.includes(policy.id),
  )

  return [
    `### ${blueprint.name}`,
    `- Status: ${formatStageChip(blueprint.status)}`,
    `- Created by: ${blueprint.createdBy}`,
    blueprint.approvedBy ? `- Approved by: ${blueprint.approvedBy}` : "- Approved by: Pending",
    `- Compliance requirements: ${blueprint.complianceRequirements.join(", ")}`,
    "",
    "### Capabilities",
    formatBulletList(blueprint.capabilities),
    "",
    "### Required MCPs",
    formatBulletList(
      blueprint.requiredMCPServers.map((mcpId) => mcpData.find((mcp) => mcp.id === mcpId)?.name ?? mcpId),
    ),
    "",
    "### Security constraints",
    formatBulletList(blueprint.securityConstraints),
    "",
    "### Linked agents",
    formatBulletList(
      linkedAgents.map((agent) => `${agent.name} (${formatStageChip(agent.lifecycleStatus ?? agent.status)})`),
    ),
    "",
    "### Governing DLP policies",
    formatBulletList(
      governingPolicies.map((policy) => `${policy.name} (${formatStageChip(policy.status)})`),
    ),
  ].join("\n")
}

function formatInitiativeDetails(initiative: PriorityInitiative): string {
  return [
    `### ${initiative.name}`,
    `- Theme: ${formatLabel(initiative.theme)}`,
    `- Stage: ${formatLabel(initiative.stage)}`,
    `- Owner: ${initiative.owner}`,
    `- Next milestone: ${initiative.nextMilestone}`,
    "",
    "### Narrative",
    initiative.summary,
    "",
    "### KPI signals",
    formatBulletList(initiative.kpis),
    "",
    "### Risks",
    formatBulletList(initiative.risks),
  ].join("\n")
}

function formatJourneyDetails(journey: ExperienceJourney): string {
  return [
    `### ${journey.name}`,
    `- Persona: ${journey.persona}`,
    "",
    "### What this journey does",
    journey.summary,
    "",
    "### Flow",
    journey.steps.map((step, index) => `${index + 1}. ${step}`).join("\n"),
    "",
    "### Success signal",
    `- ${journey.successSignal}`,
    "",
    "### Risk signal",
    `- ${journey.riskSignal}`,
  ].join("\n")
}

function formatHotspotDetails(hotspot: OperationalHotspot): string {
  return [
    `### ${hotspot.title}`,
    `- Category: ${formatLabel(hotspot.category)}`,
    `- Severity: ${formatLabel(hotspot.severity)}`,
    "",
    "### Why it matters",
    hotspot.summary,
    "",
    "### Evidence",
    formatBulletList(hotspot.evidence),
    "",
    "### Recommended action",
    `- ${hotspot.recommendedAction}`,
  ].join("\n")
}

export function getPlatformOverviewText(): string {
  const snapshot = getPlatformSnapshot()
  const headlineHotspots = operationalHotspots.filter((hotspot) => hotspot.severity === "high")

  return [
    "### Platform snapshot",
    `- ${snapshot.activeAgents.length} active agents across ${snapshot.departmentCount} departments`,
    `- ${snapshot.installedMcps.length} installed MCP servers, including ${snapshot.installedWorkIqCount} live Work IQ services`,
    `- ${snapshot.workIqAgents.length} active agents currently rely on Work IQ-powered signals`,
    `- ${snapshot.attentionApprovals.length} approvals need active attention right now`,
    `- ${snapshot.observabilityEnabled} of ${agentData.length} agents have observability enabled`,
    "",
    "### Programs in motion",
    formatBulletList(
      priorityInitiatives.map(
        (initiative) => `${initiative.name} (${formatLabel(initiative.stage)}) — ${initiative.summary}`,
      ),
    ),
    "",
    "### Where attention is needed",
    formatBulletList(
      headlineHotspots.map(
        (hotspot) => `${hotspot.title} — ${hotspot.recommendedAction}`,
      ),
    ),
    "",
    "### Suggested follow-ups",
    formatBulletList([
      "Ask for the executive briefing to get the current business narrative.",
      "Ask for hotspots if you want the biggest blockers and recovery actions.",
      "Ask for the governance queue if you want the next approvals to unblock.",
    ]),
  ].join("\n")
}

export function getExecutiveBriefingText(audience: BriefingAudience): string {
  const snapshot = getPlatformSnapshot()
  const attentionApprovals = approvalRequests.filter((approval) => attentionStages.has(approval.stage))

  switch (audience) {
    case "sales":
      return [
        "### Sales briefing",
        `- 3 revenue-facing agents are active across sales and marketing scenarios`,
        `- ${regionalPerformance.find((region) => region.region === "EMEA")?.stalledDeals ?? 0} EMEA deals are stalled long enough to affect forecast confidence`,
        `- ${attentionApprovals.filter((approval) => approval.entityId.includes("d365") || approval.title.includes("Sales")).length} sales-adjacent approvals still need attention`,
        "",
        "### Regional performance",
        formatBulletList(
          regionalPerformance.map(
            (region) => `${region.region} (${formatLabel(region.health)}) — ${region.summary} Net new revenue: ${region.netNewRevenue}.`,
          ),
        ),
        "",
        "### Best next actions",
        formatBulletList([
          "Use the seller recovery loop on the 5 highest-value dormant opportunities first.",
          "Pair seller follow-ups with the manager forecast briefing so at-risk deals are handled in sequence.",
          "Clear the remaining conversation-intelligence approval so lead enrichment and outreach stay in the same loop.",
        ]),
      ].join("\n")

    case "governance":
      return [
        "### Governance briefing",
        `- ${attentionApprovals.length} approvals are still in the attention queue`,
        `- ${agentBlueprints.filter((blueprint) => blueprint.status !== "active").length} blueprints are not yet fully active`,
        `- ${dlpPolicies.length} DLP policies are shaping connector, data-boundary, and channel controls`,
        "",
        "### Queue summary",
        formatBulletList(
          attentionApprovals.map(
            (approval) => `${approval.title} (${formatStageChip(approval.stage)}) — ${approval.description}`,
          ),
        ),
        "",
        "### Highest-impact blockers",
        formatBulletList(
          operationalHotspots
            .filter((hotspot) => hotspot.category === "governance" || hotspot.category === "work-iq")
            .map((hotspot) => `${hotspot.title} — ${hotspot.recommendedAction}`),
        ),
      ].join("\n")

    case "operations":
      return [
        "### Operations briefing",
        `- ${snapshot.observabilityEnabled} of ${agentData.length} agents are observable today`,
        `- ${agentTraces.filter((trace) => trace.result !== "success").length} recent traces show failure or timeout behavior worth watching`,
        `- ${iqSignals.filter((signal) => signal.type.includes("anomaly") || signal.type.includes("incident")).length} signals call out operational drift or spikes`,
        "",
        "### What is unstable",
        formatBulletList(
          operationalHotspots
            .filter((hotspot) => hotspot.category === "platform")
            .map((hotspot) => `${hotspot.title} — ${hotspot.summary}`),
        ),
        "",
        "### Best next actions",
        formatBulletList([
          "Tune the Compliance Agent latency spike before it starts hiding true alerts.",
          "Enable observability on the training-stage analytics path so future failures become debuggable.",
          "Keep the DevOps Assistant ready for Teams-based release notifications once the approval lands.",
        ]),
      ].join("\n")

    case "executive":
    default:
      return [
        "### Executive briefing",
        `- ${snapshot.activeAgents.length} active agents are live across sales, compliance, productivity, platform, and support workflows`,
        `- ${snapshot.attentionApprovals.length} approvals still influence rollout speed`,
        `- The strongest upside is Work IQ adoption; the loudest risk is EMEA pipeline drag`,
        "",
        "### Narrative this week",
        formatBulletList([
          "Productivity and sales automation are both maturing, but only sales has a red-zone business signal right now.",
          "Governance is mostly keeping pace; the remaining queue is concentrated in high-leverage rollout requests rather than broad policy debt.",
          "Operational hardening is becoming the next scaling constraint because the platform needs deeper telemetry on a few weaker paths.",
        ]),
        "",
        "### Programs to watch",
        formatBulletList(
          priorityInitiatives.map(
            (initiative) => `${initiative.name} (${formatLabel(initiative.stage)}) — owned by ${initiative.owner}`,
          ),
        ),
      ].join("\n")
  }
}

export function getApprovalQueueText(
  stage: ApprovalStageFilter,
  domain?: string,
): string {
  let filteredApprovals = approvalRequests.filter((approval) => {
    if (stage === "all") {
      return true
    }

    if (stage === "attention") {
      return attentionStages.has(approval.stage)
    }

    return approval.stage === stage
  })

  if (domain) {
    filteredApprovals = filteredApprovals.filter(
      (approval) =>
        scoreMatch(domain, [
          approval.title,
          approval.description,
          approval.requestorName,
          approval.entityId,
        ]) > 0,
    )
  }

  if (filteredApprovals.length === 0) {
    return [
      "### Approval queue",
      `No approval requests matched stage \"${stage}\"${domain ? ` and filter \"${domain}\"` : ""}.`,
    ].join("\n")
  }

  return [
    "### Approval queue",
    `- ${filteredApprovals.length} request(s) matched the current filter`,
    "",
    formatBulletList(
      filteredApprovals.map(
        (approval) =>
          `${approval.title} (${formatStageChip(approval.stage)}) — ${approval.requestorName}; entity ${approval.entityId}; submitted ${formatDateLabel(approval.submittedAt)}`,
      ),
    ),
  ].join("\n")
}

export function getHotspotsText(category: HotspotFilter): string {
  const filteredHotspots = operationalHotspots.filter(
    (hotspot) => category === "all" || hotspot.category === category,
  )

  return [
    "### Operational hotspots",
    formatBulletList(
      filteredHotspots.map(
        (hotspot) =>
          `${hotspot.title} (${formatLabel(hotspot.severity)}) — ${hotspot.summary} Recommended action: ${hotspot.recommendedAction}`,
      ),
    ),
  ].join("\n")
}

export function getJourneyMapText(journeyId: JourneyId): string {
  const journey = experienceJourneys.find((candidate) => candidate.id === journeyId)

  if (!journey) {
    return `No journey matched \"${journeyId}\".`
  }

  return formatJourneyDetails(journey)
}

export function getSearchCatalogText(
  query: string,
  entityType?: SearchEntityType,
): string {
  const results = buildSearchResults(query, entityType)

  if (results.length === 0) {
    return [
      `No catalog entries matched \"${query}\".`,
      "Try a broader noun like sales, Work IQ, approval, onboarding, or pipeline.",
    ].join("\n")
  }

  return [
    `### Search results for \"${query}\"`,
    formatBulletList(
      results.map(
        (result) => `${formatLabel(result.entityType)} • ${result.title} — ${result.summary}`,
      ),
    ),
  ].join("\n")
}

export function getEntityDetailsText(query: string): string {
  const [bestMatch] = buildSearchResults(query)

  if (!bestMatch) {
    return [
      `No entity matched \"${query}\".`,
      getSearchCatalogText(query),
    ].join("\n\n")
  }

  switch (bestMatch.entityType) {
    case "agent": {
      const agent = agentData.find((candidate) => candidate.id === bestMatch.entityId)
      return agent ? formatAgentDetails(agent) : `Agent \"${bestMatch.entityId}\" was not found.`
    }
    case "mcp": {
      const mcp = mcpData.find((candidate) => candidate.id === bestMatch.entityId)
      return mcp ? formatMcpDetails(mcp) : `MCP \"${bestMatch.entityId}\" was not found.`
    }
    case "approval": {
      const approval = approvalRequests.find((candidate) => candidate.id === bestMatch.entityId)
      return approval
        ? formatApprovalDetails(approval)
        : `Approval \"${bestMatch.entityId}\" was not found.`
    }
    case "blueprint": {
      const blueprint = agentBlueprints.find((candidate) => candidate.id === bestMatch.entityId)
      return blueprint
        ? formatBlueprintDetails(blueprint)
        : `Blueprint \"${bestMatch.entityId}\" was not found.`
    }
    case "initiative": {
      const initiative = priorityInitiatives.find((candidate) => candidate.id === bestMatch.entityId)
      return initiative
        ? formatInitiativeDetails(initiative)
        : `Initiative \"${bestMatch.entityId}\" was not found.`
    }
    case "journey": {
      const journey = experienceJourneys.find((candidate) => candidate.id === bestMatch.entityId)
      return journey
        ? formatJourneyDetails(journey)
        : `Journey \"${bestMatch.entityId}\" was not found.`
    }
    case "hotspot": {
      const hotspot = operationalHotspots.find((candidate) => candidate.id === bestMatch.entityId)
      return hotspot
        ? formatHotspotDetails(hotspot)
        : `Hotspot \"${bestMatch.entityId}\" was not found.`
    }
    default:
      return `No formatter is available for \"${bestMatch.entityType}\".`
  }
}