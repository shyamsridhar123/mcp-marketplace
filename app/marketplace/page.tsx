"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Grid3X3,
  List,
  Plus,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Star,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AppShell } from "@/components/app-shell"
import { OnboardingWizard } from "@/components/onboarding-wizard"
import { GlossaryTooltip, InlineHelp } from "@/components/glossary-tooltip"
import { mcpServers, agentData, governancePolicies } from "@/lib/data"
import { Mail, Calendar, Users, FileText } from "lucide-react"

const workIQIcons: Record<string, typeof Mail> = {
  mail: Mail,
  calendar: Calendar,
  teams: Users,
  sharepoint: FileText,
}

const categories = [
  { id: "all", label: "All Categories", count: mcpServers.length },
  { id: "ai", label: "AI", count: mcpServers.filter(s => s.category === "AI/ML").length },
  { id: "analytics", label: "Analytics", count: mcpServers.filter(s => s.category === "Analytics").length },
  { id: "crm", label: "CRM", count: mcpServers.filter(s => s.category === "CRM").length },
  { id: "database", label: "Database", count: mcpServers.filter(s => s.category === "Database").length },
  { id: "devtools", label: "DevTools", count: mcpServers.filter(s => s.category === "DevTools").length },
  { id: "logging", label: "Logging", count: mcpServers.filter(s => s.category === "Logging").length },
  { id: "infrastructure", label: "Infrastructure", count: mcpServers.filter(s => s.category === "Infrastructure").length },
  { id: "productivity", label: "Productivity", count: mcpServers.filter(s => s.category === "Productivity").length },
  { id: "security", label: "Security", count: mcpServers.filter(s => s.category === "Security").length },
  { id: "communication", label: "Communication", count: mcpServers.filter(s => s.category === "Communication").length },
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [showOnboarding, setShowOnboarding] = useState(true)

  const filteredServers = mcpServers.filter((server) => {
    const matchesSearch =
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" ||
      server.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const installedCount = mcpServers.filter((s) => s.isInstalled).length
  const activeAgentCount = agentData.filter((a) => a.status === "active").length
  const skillCount = agentData.reduce((acc, a) => acc + (a.skills?.length || 0), 0)
  const policyCount = governancePolicies.filter((p) => p.status === "active").length

  // Calculate trending/popular MCPs
  const trendingMcps = [...mcpServers]
    .filter(s => !s.isWorkIQ)
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 3)

  const workIQServers = mcpServers.filter(s => s.isWorkIQ)

  return (
    <AppShell>
      {/* Main Content */}
      <div className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Onboarding Wizard */}
          {showOnboarding && (
            <div className="mb-8">
              <OnboardingWizard
                installedMcpCount={installedCount}
                activeAgentCount={activeAgentCount}
                skillCount={skillCount}
                policyCount={policyCount}
                onDismiss={() => setShowOnboarding(false)}
              />
            </div>
          )}

          {/* Page Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Integrations
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                <GlossaryTooltip term="integration">
                  Browse MCP servers
                </GlossaryTooltip>{" "}
                — the building blocks that power agent skills
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" className="gap-2">
                <Download className="h-4 w-4" />
                Installed
                <Badge
                  variant="outline"
                  className="ml-1 border-border bg-background"
                >
                  {installedCount}
                </Badge>
              </Button>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Become a Provider
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-6 h-px bg-border" />

          {/* Work IQ Featured Section */}
          <section className="mb-8">
            <div className="rounded-xl border border-accent/30 bg-gradient-to-r from-accent/10 via-accent/5 to-background p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFE600]">
                  <span className="text-xs font-bold text-white">IQ</span>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Work IQ MCP Servers</h2>
                  <p className="text-xs text-muted-foreground">Powered by Microsoft Agent 365 — Enterprise intelligence layer</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {workIQServers.map((mcp) => {
                  const ServiceIcon = workIQIcons[mcp.workIQService || 'mail'] || Mail
                  return (
                    <Link
                      key={mcp.id}
                      href={`/mcp/${mcp.id}`}
                      className="group flex flex-col rounded-lg border border-border/50 bg-card/50 p-4 transition-all hover:border-accent/50 hover:bg-card"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20">
                          <ServiceIcon className="h-4 w-4 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{mcp.name}</p>
                          <p className="text-[10px] text-muted-foreground">{mcp.provider}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{mcp.shortDescription}</p>
                      <div className="mt-auto flex items-center gap-2">
                        {mcp.status === 'active' ? (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">Activated</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">Pending Consent</Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground ml-auto">{mcp.downloads.toLocaleString()} installs</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Trending Section */}
          <section className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-medium text-foreground">Trending Now</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {trendingMcps.map((mcp, index) => (
                <Link
                  key={mcp.id}
                  href={`/mcp/${mcp.id}`}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-accent/50 hover:shadow-md"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/20 text-sm font-bold text-accent">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{mcp.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      <span>{mcp.rating}</span>
                      <span>·</span>
                      <span>{mcp.downloads.toLocaleString()} installs</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Layout with Sidebar */}
          <div className="flex gap-10">
            {/* Category Sidebar */}
            <aside className="w-52 shrink-0">
              <div className="sticky top-28">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Categories
                </h3>
                <nav className="space-y-0.5">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedCategory === category.id
                          ? "bg-accent/15 text-accent"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <span>{category.label}</span>
                      <span className="text-xs opacity-60">{category.count}</span>
                    </button>
                  ))}
                </nav>

                {/* Quick Help */}
                <div className="mt-6">
                  <InlineHelp topic="integration" />
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Search */}
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search integration..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 bg-secondary/50 pl-10 border-transparent focus:border-border text-sm"
                  />
                </div>
              </div>

              {/* Native Integrations */}
              <section className="mb-12">
                <div className="mb-4">
                  <h2 className="text-base font-medium text-foreground">
                    Native Integrations
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    A collection of first-party services you can easily add to
                    your project.{" "}
                    <Link
                      href="/docs"
                      className="inline-flex items-center gap-1 text-foreground hover:underline"
                    >
                      Learn more
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Featured Integration Card */}
                  <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-accent/10 via-background to-background p-6">
                    <Button
                      size="sm"
                      className="absolute right-4 top-4 bg-foreground text-background hover:bg-foreground/90"
                    >
                      Install
                    </Button>
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                      <div className="h-6 w-6 rounded-md bg-accent" />
                    </div>
                    <h3 className="mb-1 text-base font-medium text-foreground">
                      Nexus Analytics
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Build. Measure. Ship.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      2 Million Events in Free Tier
                    </p>
                  </div>

                  {/* Become Provider Card */}
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-secondary">
                      <Plus className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="mb-1 text-sm text-foreground">
                      Join the <span className="font-medium">Nexus Marketplace</span>
                    </p>
                    <p className="mb-4 max-w-[200px] text-xs text-muted-foreground">
                      Reach developers in the ecosystem and offer your solution
                      to millions of users.
                    </p>
                    <Button variant="outline" size="sm">
                      Become a Provider
                    </Button>
                  </div>
                </div>
              </section>

              {/* Connectable Accounts */}
              <section>
                <div className="mb-4">
                  <h2 className="text-base font-medium text-foreground">
                    Connectable Accounts
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    A collection of third-party services you can add to your
                    project.{" "}
                    <Link
                      href="/docs"
                      className="inline-flex items-center gap-1 text-foreground hover:underline"
                    >
                      Learn more
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card">
                  {filteredServers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Search className="mb-4 h-8 w-8 text-muted-foreground" />
                      <h3 className="text-sm font-medium text-foreground">
                        No integrations found
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Try adjusting your search or filter
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {filteredServers.map((server) => (
                        <Link
                          key={server.id}
                          href={`/mcp/${server.id}`}
                          className="group flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-secondary/30"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                server.category === "Monitoring"
                                  ? "bg-[#FFE600]/20"
                                  : server.category === "Database"
                                    ? "bg-orange-500/20"
                                    : server.category === "Development"
                                      ? "bg-emerald-500/20"
                                      : server.category === "Infrastructure"
                                        ? "bg-blue-500/20"
                                        : server.category === "Compliance"
                                          ? "bg-pink-500/20"
                                          : "bg-cyan-500/20"
                              }`}
                            >
                              <div
                                className={`h-4 w-4 rounded ${
                                  server.category === "Monitoring"
                                    ? "bg-[#FFE600]"
                                    : server.category === "Database"
                                      ? "bg-orange-500"
                                      : server.category === "Development"
                                        ? "bg-emerald-500"
                                        : server.category === "Infrastructure"
                                          ? "bg-blue-500"
                                          : server.category === "Compliance"
                                            ? "bg-pink-500"
                                            : "bg-cyan-500"
                                }`}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">
                                  {server.name}
                                </span>
                                <span className="text-muted-foreground">·</span>
                                <span className="truncate text-sm text-muted-foreground">
                                  {server.description}
                                </span>
                              </div>
                            </div>
                            {(server.status === "pending" ||
                              server.status === "inactive") && (
                              <Badge
                                variant="outline"
                                className="ml-2 shrink-0 border-accent/30 bg-accent/10 text-accent"
                              >
                                Pro / Enterprise
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 bg-transparent"
                          >
                            {server.status === "active" ? "Manage" : "Add"}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
