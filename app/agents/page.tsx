"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Plus,
  MoreHorizontal,
  Cpu,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Boxes,
  ChevronRight,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AppShell } from "@/components/app-shell"
import { GlossaryTooltip } from "@/components/glossary-tooltip"
import { agentData, agentBlueprints } from "@/lib/data"
import { cn } from "@/lib/utils"

const statusConfig = {
  active: {
    icon: CheckCircle2,
    label: "Active",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pulseClass: "bg-emerald-500",
  },
  training: {
    icon: Clock,
    label: "Training",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    pulseClass: "bg-amber-500",
  },
  inactive: {
    icon: AlertCircle,
    label: "Inactive",
    badgeClass: "bg-muted text-muted-foreground border-border",
    pulseClass: "bg-gray-500",
  },
}

const lifecycleColors: Record<string, string> = {
  draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  review: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  approved: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  suspended: 'bg-red-500/10 text-red-400 border-red-500/20',
  retired: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "training">("all")

  const filteredAgents = agentData.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const activeCount = agentData.filter((a) => a.status === "active").length
  const totalRequests = agentData.reduce((sum, a) => sum + a.requestsHandled, 0)
  const avgSuccessRate = agentData.reduce((sum, a) => sum + a.successRate, 0) / agentData.length

  return (
    <AppShell>
      {/* Main Content */}
      <div className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Page Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Agents
              </h1>
              <p className="mt-1 text-muted-foreground">
                <GlossaryTooltip term="agent">
                  Deploy and manage AI agents
                </GlossaryTooltip>{" "}
                with custom skills
              </p>
            </div>
            <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
              <Plus className="h-4 w-4" />
              Create Agent
            </Button>
          </div>

          {/* Divider */}
          <div className="mb-6 h-px bg-border" />

          {/* Stats Row with Live Indicators */}
          <div className="mb-8 grid grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden">
              <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-accent/5" />
              <p className="text-sm text-muted-foreground">Total Agents</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{agentData.length}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden">
              <div className="absolute right-3 top-3 flex items-center gap-1 text-xs text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live
              </div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-400">{activeCount}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Requests Handled</p>
                <span className="flex items-center text-xs text-emerald-400">
                  <ArrowUpRight className="h-3 w-3" />
                  12%
                </span>
              </div>
              <p className="mt-1 text-2xl font-semibold text-foreground">{totalRequests.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Avg Success Rate</p>
                <span className="flex items-center text-xs text-emerald-400">
                  <ArrowUpRight className="h-3 w-3" />
                  3%
                </span>
              </div>
              <p className="mt-1 text-2xl font-semibold text-foreground">{avgSuccessRate.toFixed(1)}%</p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 bg-secondary/50 pl-10 border-transparent focus:border-border text-sm"
              />
            </div>
            <div className="flex gap-1 rounded-lg border border-border p-1">
              {(["all", "active", "training", "inactive"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                    statusFilter === status
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Agent Cards */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredAgents.map((agent) => {
              const status = statusConfig[agent.status as keyof typeof statusConfig]
              const StatusIcon = status.icon

              return (
                <Link
                  key={agent.id}
                  href={`/agents/${agent.id}`}
                  className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/50 hover:bg-secondary/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/20 relative">
                        <Cpu className="h-5 w-5 text-accent" />
                        {/* Live status pulse */}
                        {agent.status === "active" && (
                          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-card"></span>
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{agent.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{agent.department}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={status.badgeClass}>
                      {status.label}
                    </Badge>
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                    {agent.description}
                  </p>

                  {/* Blueprint & Lifecycle badges */}
                  {(agent.blueprintId || agent.lifecycleStatus) && (
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      {agent.blueprintId && (() => {
                        const bp = agentBlueprints.find(b => b.id === agent.blueprintId)
                        return bp ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent border border-accent/20">
                            {bp.name}
                          </span>
                        ) : null
                      })()}
                      {agent.lifecycleStatus && (
                        <Badge variant="outline" className={cn("text-[10px] capitalize", lifecycleColors[agent.lifecycleStatus] || '')}>
                          {agent.lifecycleStatus}
                        </Badge>
                      )}
                      {agent.observabilityEnabled && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-violet-500/10 px-1.5 py-0.5 text-[10px] text-violet-400" title="OpenTelemetry enabled">
                          <Activity className="h-2.5 w-2.5" /> OTel
                        </span>
                      )}
                      {agent.entraIdentity && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[10px] text-blue-400" title="Entra Identity">
                          🛡️ Entra
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Boxes className="h-3.5 w-3.5" />
                      <span>{agent.skills.length} skills</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>{agent.successRate}% success</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-4">
                    {agent.skills.slice(0, 2).map((skill) => (
                      <span
                        key={skill.id}
                        className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {agent.skills.length > 2 && (
                      <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">
                        +{agent.skills.length - 2} more
                      </span>
                    )}
                    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Link>
              )
            })}

            {/* Create New Agent Card */}
            <button
              type="button"
              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center transition-colors hover:border-accent/50 hover:bg-secondary/30"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary">
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">Create New Agent</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Deploy a custom AI agent
              </p>
            </button>
          </div>

          {/* Empty State */}
          {filteredAgents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Cpu className="mb-4 h-10 w-10 text-muted-foreground" />
              <h3 className="text-sm font-medium text-foreground">No agents found</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Try adjusting your search or create a new agent
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
