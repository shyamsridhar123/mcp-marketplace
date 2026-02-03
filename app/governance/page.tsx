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
import { governancePolicies, mcpServers } from "@/lib/data"
import { cn } from "@/lib/utils"

const ruleTypeColors: Record<string, string> = {
  "data-access": "bg-blue-500/20 text-blue-400",
  "rate-limit": "bg-amber-500/20 text-amber-400",
  authentication: "bg-emerald-500/20 text-emerald-400",
  compliance: "bg-violet-500/20 text-violet-400",
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
              <TabsTrigger value="approvals" className="gap-2">
                <Clock className="h-4 w-4" />
                Pending Approvals
                {pendingApprovals.length > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-xs text-amber-400">
                    {pendingApprovals.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-2">
                <Eye className="h-4 w-4" />
                Audit Log
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
              {/* Kanban-style Approval Workflow */}
              <div className="grid grid-cols-3 gap-4">
                {/* Pending Review Column */}
                <div className="rounded-xl border border-border bg-card">
                  <div className="border-b border-border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        <h3 className="font-semibold text-foreground">Pending Review</h3>
                      </div>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                        {pendingApprovals.length}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-2 space-y-2 max-h-96 overflow-y-auto">
                    {pendingApprovals.length > 0 ? (
                      pendingApprovals.map((mcp) => (
                        <div
                          key={mcp.id}
                          className="rounded-lg border border-border bg-background p-3 hover:border-accent/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary shrink-0">
                              <Server className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground text-sm truncate">{mcp.name}</p>
                              <p className="text-xs text-muted-foreground">{mcp.provider}</p>
                              <div className="mt-2 flex items-center gap-2">
                                <Badge variant="outline" className={cn(
                                  "text-[10px]",
                                  mcp.complianceLevel === "high" ? "border-emerald-500/30 text-emerald-400" :
                                  mcp.complianceLevel === "medium" ? "border-amber-500/30 text-amber-400" :
                                  "border-red-500/30 text-red-400"
                                )}>
                                  {mcp.complianceLevel} compliance
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex gap-1">
                            <Button size="sm" variant="outline" className="flex-1 h-7 text-xs bg-transparent">
                              <Eye className="h-3 w-3 mr-1" />
                              Review
                            </Button>
                            <Button size="sm" className="h-7 w-7 p-0 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="destructive" className="h-7 w-7 p-0">
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-2" />
                        <p className="text-sm text-muted-foreground">No pending reviews</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* In Review Column */}
                <div className="rounded-xl border border-border bg-card">
                  <div className="border-b border-border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <h3 className="font-semibold text-foreground">In Review</h3>
                      </div>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                        0
                      </Badge>
                    </div>
                  </div>
                  <div className="p-2 space-y-2 max-h-96 overflow-y-auto">
                    <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">Drag items here</p>
                    </div>
                  </div>
                </div>

                {/* Approved Column */}
                <div className="rounded-xl border border-border bg-card">
                  <div className="border-b border-border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <h3 className="font-semibold text-foreground">Approved</h3>
                      </div>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        {mcpServers.filter(m => m.status === "approved" || m.isInstalled).length}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-2 space-y-2 max-h-96 overflow-y-auto">
                    {mcpServers.filter(m => m.isInstalled).slice(0, 3).map((mcp) => (
                      <div
                        key={mcp.id}
                        className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/20 shrink-0">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">{mcp.name}</p>
                            <p className="text-xs text-muted-foreground">{mcp.provider}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="audit" className="mt-6">
              <div className="rounded-xl border border-border bg-card">
                <div className="border-b border-border p-4">
                  <h3 className="font-semibold text-foreground">Audit Log</h3>
                  <p className="text-sm text-muted-foreground">
                    Track all governance-related activities
                  </p>
                </div>

                <div className="divide-y divide-border">
                  {[
                    {
                      action: "Policy updated",
                      target: "Data Classification Policy",
                      user: "Security Team",
                      time: "2 hours ago",
                      type: "policy",
                    },
                    {
                      action: "MCP approved",
                      target: "Axiom Logging",
                      user: "Compliance Team",
                      time: "1 day ago",
                      type: "approval",
                    },
                    {
                      action: "Rule added",
                      target: "Rate Limiting Policy",
                      user: "Platform Team",
                      time: "2 days ago",
                      type: "rule",
                    },
                    {
                      action: "MCP rejected",
                      target: "Unsafe MCP",
                      user: "Security Team",
                      time: "3 days ago",
                      type: "rejection",
                    },
                    {
                      action: "Policy created",
                      target: "Compliance Verification",
                      user: "Compliance Team",
                      time: "1 week ago",
                      type: "policy",
                    },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center gap-4 p-4">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          log.type === "approval"
                            ? "bg-emerald-500/20"
                            : log.type === "rejection"
                              ? "bg-red-500/20"
                              : "bg-blue-500/20"
                        )}
                      >
                        {log.type === "approval" ? (
                          <Unlock className="h-4 w-4 text-emerald-400" />
                        ) : log.type === "rejection" ? (
                          <Lock className="h-4 w-4 text-red-400" />
                        ) : (
                          <Settings className="h-4 w-4 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{log.action}</span>
                          {" - "}
                          <span className="text-muted-foreground">
                            {log.target}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.user} · {log.time}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppShell>
  )
}
