"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Grid3X3,
  List,
  Plus,
  Bell,
  HelpCircle,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AppShell } from "@/components/app-shell"
import { mcpServers } from "@/lib/data"

const categories = [
  { id: "all", label: "All Categories" },
  { id: "ai", label: "AI" },
  { id: "analytics", label: "Analytics" },
  { id: "authentication", label: "Authentication" },
  { id: "cms", label: "CMS" },
  { id: "database", label: "Database" },
  { id: "devtools", label: "DevTools" },
  { id: "logging", label: "Logging" },
  { id: "monitoring", label: "Monitoring" },
  { id: "observability", label: "Observability" },
  { id: "security", label: "Security" },
  { id: "storage", label: "Storage" },
]

const navItems = [
  { href: "/", label: "Integrations" },
  { href: "/agents", label: "Agents" },
  { href: "/skills", label: "Skills" },
  { href: "/governance", label: "Governance" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  const filteredServers = mcpServers.filter((server) => {
    const matchesSearch =
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" ||
      server.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const installedCount = mcpServers.filter((s) => s.status === "active").length

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
                  item.href === "/"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {item.href === "/" && (
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
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Marketplace
            </h1>
            <div className="flex items-center gap-3">
              <Button variant="secondary" className="gap-2">
                Installed Integrations
                <Badge
                  variant="outline"
                  className="ml-1 border-border bg-background"
                >
                  {installedCount}
                </Badge>
              </Button>
              <Button variant="secondary">Integrations Console</Button>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-8 h-px bg-border" />

          {/* Layout with Sidebar */}
          <div className="flex gap-10">
            {/* Category Sidebar */}
            <aside className="w-48 shrink-0">
              <nav className="space-y-0.5">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      selectedCategory === category.id
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </nav>
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
                                  ? "bg-violet-500/20"
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
                                    ? "bg-violet-500"
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
