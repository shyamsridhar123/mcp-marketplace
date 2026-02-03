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
  status: 'approved' | 'pending' | 'rejected'
  complianceLevel: 'high' | 'medium' | 'low'
  lastUpdated: string
  capabilities: string[]
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted'
  icon: string
  tags: string[]
  documentation?: string
  endpoints?: string[]
  isInstalled?: boolean
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
}

export type MCPCategory =
  | 'Infrastructure'
  | 'Compliance'
  | 'Analytics'
  | 'Communication'
  | 'Database'
  | 'Security'
  | 'DevOps'
  | 'AI/ML'
  | 'Productivity'
  | 'Custom'

export interface GovernancePolicy {
  id: string
  name: string
  description: string
  rules: PolicyRule[]
  appliedTo: string[]
  status: 'active' | 'draft' | 'deprecated'
  createdBy: string
  createdAt: string
}

export interface PolicyRule {
  id: string
  type: 'data-access' | 'rate-limit' | 'authentication' | 'compliance'
  condition: string
  action: string
}
