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
  Bell,
  HelpCircle,
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
import { governancePolicies, mcpServers } from "@/lib/data"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Integrations" },
  { href: "/agents", label: "Agents" },
  { href: "/skills", label: "Skills" },
  { href: "/governance", label: "Governance" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
]

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

export default function GovernancePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPolicies = governancePolicies.filter(
    (policy) =>
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AppShell>
      {/* Header Navigation */}
      <header className="sticky top-12 z-40 border-b border-border bg-background">
        <div className="flex h-12 items-center justify-between px-6">
          <nav className="flex items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-3.5 text-sm font-medium transition-colors ${
                  item.href === "/governance"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {item.href === "/governance" && (
                  <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-foreground" />
                )}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2 text-xs bg-transparent"
            >
              Feedback
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-10">
          {/* Page Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Governance
              </h1>
              <p className="mt-1 text-muted-foreground">
                Manage policies, compliance, and MCP approvals
              </p>
            </div>
            <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
              <Plus className="h-4 w-4" />
              Create Policy
            </Button>
          </div>

          {/* Divider */}
          <div className="mb-8 h-px bg-border" />

          {/* Stats */}
          <div className="mb-8 grid grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Policies</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {complianceMetrics.totalPolicies}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Active Policies</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-400">
                {complianceMetrics.activePolicies}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">MCPs Compliant</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {complianceMetrics.mcpsCompliant}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Pending Reviews</p>
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
              <div className="rounded-xl border border-border bg-card">
                <div className="border-b border-border p-4">
                  <h3 className="font-semibold text-foreground">
                    Pending MCP Approvals
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    MCPs awaiting compliance review and approval
                  </p>
                </div>

                {pendingApprovals.length > 0 ? (
                  <div className="divide-y divide-border">
                    {pendingApprovals.map((mcp) => (
                      <div
                        key={mcp.id}
                        className="flex items-center justify-between p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                            <Server className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {mcp.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {mcp.provider}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge
                              variant="secondary"
                              className="bg-amber-500/20 text-amber-400 border-transparent"
                            >
                              <Clock className="mr-1 h-3 w-3" />
                              Pending Review
                            </Badge>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Submitted {mcp.lastUpdated}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 bg-transparent"
                            >
                              <Eye className="h-4 w-4" />
                              Review
                            </Button>
                            <Button
                              size="sm"
                              className="gap-1 bg-foreground text-background hover:bg-foreground/90"
                            >
                              <Check className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="gap-1"
                            >
                              <AlertTriangle className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                      <Check className="h-6 w-6 text-emerald-400" />
                    </div>
                    <p className="mt-3 font-medium text-foreground">
                      All caught up!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      No pending approvals
                    </p>
                  </div>
                )}
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
