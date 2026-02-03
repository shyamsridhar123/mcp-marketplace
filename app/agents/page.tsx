"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Plus,
  Bell,
  HelpCircle,
  MoreHorizontal,
  Cpu,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Boxes,
  ChevronRight,
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
import { agentData } from "@/lib/data"

const navItems = [
  { href: "/", label: "Integrations" },
  { href: "/agents", label: "Agents" },
  { href: "/skills", label: "Skills" },
  { href: "/governance", label: "Governance" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
]

const statusConfig = {
  active: {
    icon: CheckCircle2,
    label: "Active",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  training: {
    icon: Clock,
    label: "Training",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  inactive: {
    icon: AlertCircle,
    label: "Inactive",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
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
      {/* Header Navigation */}
      <header className="sticky top-12 z-40 border-b border-border bg-background">
        <div className="flex h-12 items-center justify-between px-6">
          <nav className="flex items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-3.5 text-sm font-medium transition-colors ${
                  item.href === "/agents"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {item.href === "/agents" && (
                  <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-foreground" />
                )}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-2 text-xs bg-transparent">
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
                Agents
              </h1>
              <p className="mt-1 text-muted-foreground">
                Deploy and manage AI agents with custom skills
              </p>
            </div>
            <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
              <Plus className="h-4 w-4" />
              Create Agent
            </Button>
          </div>

          {/* Divider */}
          <div className="mb-8 h-px bg-border" />

          {/* Stats Row */}
          <div className="mb-8 grid grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Agents</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{agentData.length}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-400">{activeCount}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Requests Handled</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{totalRequests.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Avg Success Rate</p>
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
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/20">
                        <Cpu className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{agent.name}</h3>
                          {agent.status === "active" && (
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                          )}
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
