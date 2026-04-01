"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Shield,
  FileText,
  AlertTriangle,
  Check,
  Clock,
  Search,
  MoreVertical,
  ChevronRight,
  Lock,
  Unlock,
  Eye,
  Settings,
  Server,
  Plus,
  X,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  GripVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AppShell } from "@/components/app-shell"
import { GlossaryTooltip } from "@/components/glossary-tooltip"
import { governancePolicies, mcpServers, agentBlueprints, dlpPolicies, agentTraces, approvalRequests, agentData } from "@/lib/data"
import { cn } from "@/lib/utils"

const ruleTypeColors: Record<string, string> = {
  "data-access": "bg-blue-500/20 text-blue-400",
  "rate-limit": "bg-amber-500/20 text-amber-400",
  authentication: "bg-emerald-500/20 text-emerald-400",
  compliance: "bg-[#47C2E1]/20 text-[#47C2E1]",
}

const dlpRuleColors: Record<string, string> = {
  'connector-restriction': 'bg-rose-500/20 text-rose-400',
  'data-boundary': 'bg-cyan-500/20 text-cyan-400',
  'channel-block': 'bg-amber-500/20 text-amber-400',
  'sensitivity-label': 'bg-[#47C2E1]/20 text-[#47C2E1]',
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400",
  draft: "bg-amber-500/20 text-amber-400",
  deprecated: "bg-red-500/20 text-red-400",
}

// Pending MCP approvals
const pendingApprovals = mcpServers.filter((m) => m.status === "pending")

// Compliance metrics
const complianceMetrics = {
  totalPolicies: governancePolicies.length,
  activePolicies: governancePolicies.filter((p) => p.status === "active").length,
  mcpsCompliant: mcpServers.filter((m) => m.complianceLevel === "high").length,
  pendingReviews: pendingApprovals.length,
}

// Approval workflow stages
const approvalStages = [
  { id: "pending", label: "Pending Review", count: pendingApprovals.length },
  { id: "in-review", label: "In Review", count: 0 },
  { id: "approved", label: "Approved", count: mcpServers.filter(m => m.status === "approved").length },
]

export default function GovernancePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null)

  const filteredPolicies = governancePolicies.filter(
    (policy) =>
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AppShell>
      {/* Main Content */}
      <div className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Page Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Governance
              </h1>
              <p className="mt-1 text-muted-foreground">
                <GlossaryTooltip term="policy">
                  Manage policies
                </GlossaryTooltip>, compliance, and MCP approvals
              </p>
            </div>
            <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
              <Plus className="h-4 w-4" />
              Create Policy
            </Button>
          </div>

          {/* Divider */}
          <div className="mb-6 h-px bg-border" />

          {/* Stats with contextual indicators */}
          <div className="mb-8 grid grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Policies</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {complianceMetrics.totalPolicies}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Active Policies</p>
                <Shield className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="mt-1 text-2xl font-semibold text-emerald-400">
                {complianceMetrics.activePolicies}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">MCPs Compliant</p>
                <CheckCircle2 className="h-4 w-4 text-accent" />
              </div>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {complianceMetrics.mcpsCompliant}
              </p>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-amber-400">Pending Reviews</p>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              </div>
              <p className="mt-1 text-2xl font-semibold text-amber-400">
                {complianceMetrics.pendingReviews}
              </p>
            </div>
          </div>

          <Tabs defaultValue="policies">
            <TabsList className="bg-secondary">
              <TabsTrigger value="policies" className="gap-2">
                <FileText className="h-4 w-4" />
                Policies
              </TabsTrigger>
              <TabsTrigger value="blueprints" className="gap-2">
                <Shield className="h-4 w-4" />
                Blueprints
              </TabsTrigger>
              <TabsTrigger value="approvals" className="gap-2">
                <Clock className="h-4 w-4" />
                Approvals
                {approvalRequests.filter(a => a.stage === 'pending' || a.stage === 'in-review').length > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-xs text-amber-400">
                    {approvalRequests.filter(a => a.stage === 'pending' || a.stage === 'in-review').length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-2">
                <Eye className="h-4 w-4" />
                Audit
              </TabsTrigger>
              <TabsTrigger value="compliance" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Compliance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="policies" className="mt-6">
              {/* Search */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search policies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 bg-secondary/50 pl-10 border-transparent focus:border-border text-sm"
                  />
                </div>
              </div>

              {/* Policies List */}
              <div className="space-y-4">
                {filteredPolicies.map((policy) => (
                  <div
                    key={policy.id}
                    className="rounded-xl border border-border bg-card p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                          <Shield className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">
                              {policy.name}
                            </h3>
                            <Badge
                              variant="secondary"
                              className={cn(
                                statusColors[policy.status],
                                "font-medium border-transparent"
                              )}
                            >
                              {policy.status}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {policy.description}
                          </p>
                          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Created by {policy.createdBy}</span>
                            <span>|</span>
                            <span>{policy.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Policy</DropdownMenuItem>
                          <DropdownMenuItem>View Rules</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Deprecate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-4 border-t border-border pt-4">
                      <p className="text-sm font-medium text-foreground">
                        Rules
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {policy.rules.map((rule) => (
                          <Badge
                            key={rule.id}
                            variant="secondary"
                            className={cn(
                              ruleTypeColors[rule.type],
                              "font-medium border-transparent"
                            )}
                          >
                            {rule.type}: {rule.condition}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-foreground">
                        Applied to
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {policy.appliedTo.map((mcpId) => {
                          const mcp = mcpServers.find((m) => m.id === mcpId)
                          return (
                            <Badge
                              key={mcpId}
                              variant="outline"
                              className="border-border"
                            >
                              {mcp?.name || mcpId}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="approvals" className="mt-6">
              <ApprovalsKanban />
            </TabsContent>

            <TabsContent value="audit" className="mt-6">
              <div className="rounded-xl border border-border bg-card">
                <div className="border-b border-border p-4">
                  <h3 className="font-semibold text-foreground font-mono">Advanced Hunting — Agent Tool Traces</h3>
                  <p className="text-sm text-muted-foreground">
                    Microsoft Defender-style trace inspection for all agent tool calls
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/50">
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground font-mono text-xs">Timestamp</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground font-mono text-xs">Agent</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground font-mono text-xs">Type</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground font-mono text-xs">Tool Server</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground font-mono text-xs">Result</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground font-mono text-xs">Duration</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground font-mono text-xs">Initiated By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {agentTraces.map((trace) => (
                        <tr key={trace.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{new Date(trace.timestamp).toLocaleString()}</td>
                          <td className="px-4 py-2 text-xs text-foreground">{trace.agentName}</td>
                          <td className="px-4 py-2"><Badge variant="outline" className="text-[10px] capitalize">{trace.traceType.replace('_', ' ')}</Badge></td>
                          <td className="px-4 py-2 text-xs text-foreground">{trace.toolServerName || '—'}</td>
                          <td className="px-4 py-2">
                            <span className={cn("inline-flex items-center gap-1 text-[10px] font-medium",
                              trace.result === 'success' ? 'text-emerald-400' : trace.result === 'failure' ? 'text-red-400' : 'text-amber-400'
                            )}>
                              <span className={cn("h-1.5 w-1.5 rounded-full",
                                trace.result === 'success' ? 'bg-emerald-500' : trace.result === 'failure' ? 'bg-red-500' : 'bg-amber-500'
                              )} />
                              {trace.result}
                            </span>
                          </td>
                          <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{trace.durationMs}ms</td>
                          <td className="px-4 py-2 text-xs text-muted-foreground">{trace.initiatedBy || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Blueprints Tab */}
            <TabsContent value="blueprints" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {agentBlueprints.map((bp) => {
                  const agentsUsing = agentData.filter(a => a.blueprintId === bp.id)
                  return (
                    <div key={bp.id} className="rounded-xl border border-border bg-card p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{bp.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{bp.description}</p>
                        </div>
                        <Badge variant="outline" className={cn("capitalize text-xs",
                          bp.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          bp.status === 'review' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        )}>{bp.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span>{bp.requiredMCPServers.length} required MCPs</span>
                        <span>·</span>
                        <span>{agentsUsing.length} agents using</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {bp.capabilities.slice(0, 3).map(cap => (
                          <span key={cap} className="rounded bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{cap}</span>
                        ))}
                        {bp.capabilities.length > 3 && <span className="rounded bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">+{bp.capabilities.length - 3}</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {agentData.map((agent) => {
                  const bp = agentBlueprints.find(b => b.id === agent.blueprintId)
                  const score = agent.observabilityEnabled ? (agent.successRate > 97 ? 95 : agent.successRate > 95 ? 85 : 72) : 60
                  return (
                    <div key={agent.id} className="rounded-xl border border-border bg-card p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground text-sm">{agent.name}</h4>
                        <span className={cn("text-sm font-semibold",
                          score >= 90 ? 'text-emerald-400' : score >= 70 ? 'text-amber-400' : 'text-red-400'
                        )}>{score}%</span>
                      </div>
                      {bp && <p className="text-xs text-muted-foreground mb-3">{bp.name}</p>}
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div className={cn("h-full rounded-full",
                          score >= 90 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                        )} style={{ width: `${score}%` }} />
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                        {agent.observabilityEnabled && <span className="bg-[#FFE600]/10 text-[#FFE600] px-1.5 py-0.5 rounded">OTel ✓</span>}
                        {agent.entraIdentity && <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">Entra ✓</span>}
                        {agent.blueprintId && <span className="bg-accent/10 text-accent px-1.5 py-0.5 rounded">Blueprint ✓</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppShell>
  )
}

// ─── Drag-and-Drop Approvals Kanban ───────────────────────────────

type ColumnId = "pending" | "in-review" | "approved" | "rejected"

interface KanbanCard {
  id: string
  name: string
  provider: string
  complianceLevel: string
  type: "mcp" | "agent" | "blueprint"
}

const columnConfig: Record<ColumnId, { label: string; dot: string; badgeCls: string; cardBorder: string }> = {
  pending: { label: "Pending Review", dot: "bg-[#FFB547]", badgeCls: "bg-[#FFB547]/10 text-[#FFB547] border-[#FFB547]/30", cardBorder: "border-border" },
  "in-review": { label: "In Review", dot: "bg-[#47C2E1]", badgeCls: "bg-[#47C2E1]/10 text-[#47C2E1] border-[#47C2E1]/30", cardBorder: "border-[#47C2E1]/30" },
  approved: { label: "Approved", dot: "bg-[#4CAF82]", badgeCls: "bg-[#4CAF82]/10 text-[#4CAF82] border-[#4CAF82]/30", cardBorder: "border-[#4CAF82]/30" },
  rejected: { label: "Rejected", dot: "bg-[#FF6B6B]", badgeCls: "bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30", cardBorder: "border-[#FF6B6B]/30" },
}

function buildInitialColumns(): Record<ColumnId, KanbanCard[]> {
  const pending = mcpServers.filter(m => m.status === "pending").map(m => ({
    id: m.id, name: m.name, provider: m.provider, complianceLevel: m.complianceLevel, type: "mcp" as const,
  }))
  const approved = mcpServers.filter(m => m.isInstalled).slice(0, 5).map(m => ({
    id: m.id + "-a", name: m.name, provider: m.provider, complianceLevel: m.complianceLevel, type: "mcp" as const,
  }))
  return { pending, "in-review": [], approved, rejected: [] }
}

function ApprovalsKanban() {
  const [columns, setColumns] = useState<Record<ColumnId, KanbanCard[]>>(buildInitialColumns)
  const [dragItem, setDragItem] = useState<{ card: KanbanCard; from: ColumnId } | null>(null)
  const [dragOverCol, setDragOverCol] = useState<ColumnId | null>(null)

  const handleDragStart = (card: KanbanCard, from: ColumnId) => (e: React.DragEvent) => {
    setDragItem({ card, from })
    e.dataTransfer.effectAllowed = "move"
    // Make the drag image slightly transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5"
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1"
    }
    setDragItem(null)
    setDragOverCol(null)
  }

  const handleDragOver = (col: ColumnId) => (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverCol(col)
  }

  const handleDragLeave = () => {
    setDragOverCol(null)
  }

  const handleDrop = (toCol: ColumnId) => (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverCol(null)
    if (!dragItem || dragItem.from === toCol) return

    setColumns(prev => {
      const next = { ...prev }
      next[dragItem.from] = prev[dragItem.from].filter(c => c.id !== dragItem.card.id)
      next[toCol] = [...prev[toCol], dragItem.card]
      return next
    })
    setDragItem(null)
  }

  const moveCard = (card: KanbanCard, from: ColumnId, to: ColumnId) => {
    setColumns(prev => {
      const next = { ...prev }
      next[from] = prev[from].filter(c => c.id !== card.id)
      next[to] = [...prev[to], card]
      return next
    })
  }

  const orderedColumns: ColumnId[] = ["pending", "in-review", "approved", "rejected"]

  return (
    <div className="grid grid-cols-4 gap-3">
      {orderedColumns.map(colId => {
        const cfg = columnConfig[colId]
        const cards = columns[colId]
        const isOver = dragOverCol === colId

        return (
          <div
            key={colId}
            className={cn(
              "rounded-lg border bg-card transition-all min-h-[300px]",
              isOver ? "border-[#FFE600]/50 bg-[#FFE600]/5" : "border-border"
            )}
            onDragOver={handleDragOver(colId)}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop(colId)}
          >
            {/* Column Header */}
            <div className="border-b border-border p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", cfg.dot)} />
                  <h3 className="text-sm font-semibold text-foreground">{cfg.label}</h3>
                </div>
                <Badge variant="outline" className={cn("text-[10px]", cfg.badgeCls)}>
                  {cards.length}
                </Badge>
              </div>
            </div>

            {/* Cards */}
            <div className="p-2 space-y-2">
              {cards.length > 0 ? cards.map(card => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={handleDragStart(card, colId)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "rounded-lg border bg-background p-3 cursor-grab active:cursor-grabbing transition-all hover:border-[#FFE600]/40 group select-none",
                    cfg.cardBorder
                  )}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground/30 mt-0.5 group-hover:text-muted-foreground shrink-0 transition-colors" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{card.name}</p>
                      <p className="text-[10px] text-muted-foreground">{card.provider}</p>
                      <Badge variant="outline" className={cn(
                        "text-[10px] mt-1.5",
                        card.complianceLevel === "high" ? "border-[#4CAF82]/30 text-[#4CAF82]" :
                        card.complianceLevel === "medium" ? "border-[#FFB547]/30 text-[#FFB547]" :
                        "border-[#FF6B6B]/30 text-[#FF6B6B]"
                      )}>
                        {card.complianceLevel}
                      </Badge>
                    </div>
                  </div>

                  {/* Quick action buttons per column */}
                  {colId === "pending" && (
                    <div className="mt-2 flex gap-1">
                      <Button size="sm" variant="outline" className="flex-1 h-6 text-[10px] bg-transparent" onClick={() => moveCard(card, colId, "in-review")}>
                        <Eye className="h-3 w-3 mr-1" /> Review
                      </Button>
                      <Button size="sm" className="h-6 w-6 p-0 bg-[#4CAF82]/20 text-[#4CAF82] hover:bg-[#4CAF82]/30" onClick={() => moveCard(card, colId, "approved")}>
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button size="sm" className="h-6 w-6 p-0 bg-[#FF6B6B]/20 text-[#FF6B6B] hover:bg-[#FF6B6B]/30" onClick={() => moveCard(card, colId, "rejected")}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {colId === "in-review" && (
                    <div className="mt-2 flex gap-1">
                      <Button size="sm" className="flex-1 h-6 text-[10px] bg-[#4CAF82]/20 text-[#4CAF82] hover:bg-[#4CAF82]/30" onClick={() => moveCard(card, colId, "approved")}>
                        <Check className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" className="flex-1 h-6 text-[10px] bg-[#FF6B6B]/20 text-[#FF6B6B] hover:bg-[#FF6B6B]/30" onClick={() => moveCard(card, colId, "rejected")}>
                        <X className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              )) : (
                <div className={cn(
                  "flex flex-col items-center justify-center py-8 text-center rounded-lg border border-dashed transition-colors",
                  isOver ? "border-[#FFE600]/50 bg-[#FFE600]/5" : "border-border"
                )}>
                  <p className="text-xs text-muted-foreground">
                    {isOver ? "Drop here" : "Drag cards here"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
