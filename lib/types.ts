export interface MCP {
  id: string
  name: string
  description: string
  shortDescription: string
  category: MCPCategory
  provider: string
  version: string
  downloads: number
  rating: number
  ratingCount: number
  status: 'active' | 'pending' | 'rejected'
  complianceLevel: 'high' | 'medium' | 'low'
  lastUpdated: string
  capabilities: string[]
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted'
  icon: string
  tags: string[]
  documentation?: string
  endpoints?: string[]
  isInstalled?: boolean
  isWorkIQ?: boolean
  workIQService?: 'mail' | 'calendar' | 'teams' | 'sharepoint'
  adminConsentRequired?: boolean
}

export interface Agent {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'training'
  department: string
  skills: Skill[]
  mcpConnections: string[]
  createdAt: string
  lastActive: string
  requestsHandled: number
  successRate: number
  icon: string
  blueprintId?: string
  entraIdentity?: EntraIdentity
  lifecycleStatus?: 'draft' | 'review' | 'approved' | 'active' | 'suspended' | 'retired'
  notificationChannels?: string[]
  observabilityEnabled?: boolean
}

export interface EntraIdentity {
  objectId: string
  appId: string
  tenantId: string
  mailbox: string
  permissions: EntraPermission[]
}

export interface EntraPermission {
  mcpId: string
  scopes: string[]
  consentType: 'admin' | 'user'
  consentStatus: 'granted' | 'pending' | 'denied'
}

export interface Skill {
  id: string
  name: string
  description: string
  mcpId: string
  mcpName: string
  category: MCPCategory
  isActive: boolean
  configuration?: Record<string, unknown>
  version?: string
}

export type MCPCategory =
  | 'Infrastructure'
  | 'Compliance'
  | 'Analytics'
  | 'Communication'
  | 'CRM'
  | 'Database'
  | 'DevTools'
  | 'Logging'
  | 'Security'
  | 'DevOps'
  | 'AI/ML'
  | 'Productivity'
  | 'Custom'

export interface BasePolicy {
  id: string
  name: string
  description: string
  appliedTo: string[]
  status: 'active' | 'draft' | 'deprecated'
  createdBy: string
  createdAt: string
}

export interface GovernancePolicy extends BasePolicy {
  rules: PolicyRule[]
}

export interface PolicyRule {
  id: string
  type: 'data-access' | 'rate-limit' | 'authentication' | 'compliance'
  condition: string
  action: string
}

export interface AgentBlueprint {
  id: string
  name: string
  description: string
  capabilities: string[]
  requiredMCPServers: string[]
  securityConstraints: string[]
  complianceRequirements: string[]
  governancePolicies: string[]
  status: 'draft' | 'review' | 'approved' | 'active' | 'suspended' | 'retired'
  createdBy: string
  createdAt: string
  approvedBy?: string
  approvedAt?: string
}

export interface DLPPolicy extends BasePolicy {
  level: 'tenant' | 'environment' | 'agent'
  rules: DLPRule[]
  enforcement: 'block' | 'warn' | 'audit'
}

export interface DLPRule {
  id: string
  type: 'connector-restriction' | 'data-boundary' | 'channel-block' | 'sensitivity-label'
  condition: string
  action: string
  dataClassifications?: Array<'public' | 'internal' | 'confidential' | 'restricted'>
}

export interface IQSignal {
  id: string
  source: 'work-iq' | 'foundry-iq' | 'fabric-iq'
  layer: 'data' | 'memory' | 'inference'
  type: string
  content: string
  agentId?: string
  timestamp: string
  confidence: number
}

export interface AgentTrace {
  id: string
  agentId: string
  agentName: string
  traceType: 'invocation' | 'tool_execution' | 'inference' | 'notification'
  toolServerName?: string
  parameters?: Record<string, unknown>
  result: 'success' | 'failure' | 'timeout'
  durationMs: number
  timestamp: string
  initiatedBy?: string
}

export interface ApprovalRequest {
  id: string
  type: 'agent-registration' | 'mcp-access' | 'blueprint-activation' | 'policy-change'
  title: string
  description: string
  requestorId: string
  requestorName: string
  approverId?: string
  approverName?: string
  stage: 'pending' | 'in-review' | 'approved' | 'rejected'
  entityId: string
  entityType: 'agent' | 'mcp' | 'blueprint' | 'policy'
  submittedAt: string
  reviewedAt?: string
  comments?: string
}

