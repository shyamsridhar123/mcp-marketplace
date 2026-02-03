import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Star,
  Download,
  Shield,
  Clock,
  ExternalLink,
  Check,
  Plus,
  Settings,
  Code,
  FileText,
  Users,
  Activity,
  Bell,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppShell } from "@/components/app-shell"
import { mcpServers, agentData } from "@/lib/data"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Integrations" },
  { href: "/agents", label: "Agents" },
  { href: "/skills", label: "Skills" },
  { href: "/governance", label: "Governance" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
]

const complianceLevelColors: Record<string, string> = {
  high: "bg-emerald-500/20 text-emerald-400",
  medium: "bg-amber-500/20 text-amber-400",
  low: "bg-red-500/20 text-red-400",
}

const dataClassificationColors: Record<string, string> = {
  public: "bg-emerald-500/20 text-emerald-400",
  internal: "bg-blue-500/20 text-blue-400",
  confidential: "bg-amber-500/20 text-amber-400",
  restricted: "bg-red-500/20 text-red-400",
}

export default async function MCPDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const mcp = mcpServers.find((m) => m.id === id)

  if (!mcp) {
    notFound()
  }

  const connectedAgents = agentData.filter((agent) =>
    agent.mcpConnections.includes(mcp.id)
  )

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Logging: "bg-violet-500/20",
      Database: "bg-orange-500/20",
      DevTools: "bg-emerald-500/20",
      Analytics: "bg-blue-500/20",
    }
    return colors[category] || "bg-muted"
  }

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
          {/* Back Link */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>

          {/* Header */}
          <div className="mb-8 flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl",
                  getCategoryColor(mcp.category)
                )}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-lg",
                    mcp.category === "Logging"
                      ? "bg-violet-500"
                      : mcp.category === "Database"
                        ? "bg-orange-500"
                        : mcp.category === "DevTools"
                          ? "bg-emerald-500"
                          : "bg-blue-500"
                  )}
                />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-foreground">
                    {mcp.name}
                  </h1>
                  {mcp.isInstalled && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Installed
                    </Badge>
                  )}
                  {mcp.status === "pending" && (
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-400 border-amber-500/20"
                    >
                      Pending Approval
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-muted-foreground">{mcp.provider}</p>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground">
                      {mcp.rating}
                    </span>
                    <span className="text-muted-foreground">
                      ({mcp.ratingCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>{mcp.downloads.toLocaleString()} installs</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Updated {mcp.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {mcp.isInstalled ? (
                <>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Settings className="h-4 w-4" />
                    Configure
                  </Button>
                  <Button variant="outline" className="text-destructive hover:text-destructive bg-transparent">
                    Uninstall
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <ExternalLink className="h-4 w-4" />
                    Documentation
                  </Button>
                  <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                    <Plus className="h-4 w-4" />
                    Install MCP
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="mb-8 h-px bg-border" />

          {/* Content */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview">
                <TabsList className="bg-secondary/50 border border-border">
                  <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-background">
                    <FileText className="h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="capabilities" className="gap-2 data-[state=active]:bg-background">
                    <Code className="h-4 w-4" />
                    Capabilities
                  </TabsTrigger>
                  <TabsTrigger value="agents" className="gap-2 data-[state=active]:bg-background">
                    <Users className="h-4 w-4" />
                    Connected Agents
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="text-base font-medium text-foreground">
                      Description
                    </h2>
                    <p className="mt-3 leading-relaxed text-muted-foreground">
                      {mcp.description}
                    </p>

                    <h3 className="mt-6 text-base font-medium text-foreground">
                      Tags
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {mcp.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="bg-secondary/50 text-muted-foreground border-border"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="capabilities" className="mt-6">
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="text-base font-medium text-foreground">
                      Available Capabilities
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      These capabilities can be packaged as skills for your
                      agents
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {mcp.capabilities.map((capability) => (
                        <div
                          key={capability}
                          className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-4"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                            <Check className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {capability}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Available as skill
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="agents" className="mt-6">
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="text-base font-medium text-foreground">
                      Connected Agents
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Agents currently using this MCP
                    </p>
                    {connectedAgents.length > 0 ? (
                      <div className="mt-4 space-y-3">
                        {connectedAgents.map((agent) => (
                          <Link
                            key={agent.id}
                            href={`/agents/${agent.id}`}
                            className="flex items-center gap-4 rounded-xl border border-border bg-secondary/30 p-4 transition-colors hover:border-accent/50"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                              <Activity className="h-5 w-5 text-accent" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">
                                {agent.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {agent.department}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                agent.status === "active"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : agent.status === "training"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                    : "bg-muted text-muted-foreground border-border"
                              )}
                            >
                              {agent.status}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl border border-dashed border-border p-8 text-center">
                        <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">
                          No agents connected yet
                        </p>
                        <Button
                          className="mt-4 bg-foreground text-background hover:bg-foreground/90"
                          size="sm"
                        >
                          Connect an Agent
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Compliance Info */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-medium text-foreground">
                  Compliance & Governance
                </h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Compliance Level
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        complianceLevelColors[mcp.complianceLevel],
                        "border-transparent font-medium"
                      )}
                    >
                      <Shield className="mr-1 h-3 w-3" />
                      {mcp.complianceLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Data Classification
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        dataClassificationColors[mcp.dataClassification],
                        "border-transparent font-medium capitalize"
                      )}
                    >
                      {mcp.dataClassification}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        mcp.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : mcp.status === "pending"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-muted text-muted-foreground",
                        "border-transparent font-medium capitalize"
                      )}
                    >
                      {mcp.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Version Info */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-medium text-foreground">
                  Version Information
                </h3>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Current Version</span>
                    <span className="font-medium text-foreground">
                      v{mcp.version}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="text-foreground">{mcp.lastUpdated}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="text-foreground">{mcp.category}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-medium text-foreground">Quick Actions</h3>
                <div className="mt-4 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                  >
                    <Code className="h-4 w-4" />
                    View API Reference
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                  >
                    <FileText className="h-4 w-4" />
                    Download Spec
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                  >
                    <Shield className="h-4 w-4" />
                    View Policies
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
