"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Server,
  Shield,
  GitBranch,
  Headphones,
  BarChart,
  Activity,
  TrendingUp,
  Boxes,
  Plus,
  Settings,
  Trash2,
  Power,
  Clock,
  Check,
  X,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { mcpServers } from "@/lib/data"
import { cn } from "@/lib/utils"
import type { Agent } from "@/lib/types"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  server: Server,
  shield: Shield,
  "git-branch": GitBranch,
  headphones: Headphones,
  "bar-chart": BarChart,
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400",
  inactive: "bg-red-500/20 text-red-400",
  training: "bg-amber-500/20 text-amber-400",
}

interface AgentDetailClientProps {
  agent: Agent
}

export function AgentDetailClient({ agent }: AgentDetailClientProps) {
  const [skills, setSkills] = useState(agent.skills || [])

  const Icon = iconMap[agent.icon] || Server
  const connectedMCPs = mcpServers.filter((mcp) =>
    agent.mcpConnections.includes(mcp.id)
  )

  const toggleSkill = (skillId: string) => {
    setSkills(
      skills.map((s) => (s.id === skillId ? { ...s, isActive: !s.isActive } : s))
    )
  }

  return (
    <AppShell>
      {/* Main Content */}
      <div className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Back Link */}
          <Link
            href="/agents"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Agents
          </Link>

          {/* Agent Header */}
          <div className="mb-8 flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary">
                <Icon className="h-8 w-8 text-accent" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground">
                    {agent.name}
                  </h1>
                  <Badge
                    variant="secondary"
                    className={cn(statusColors[agent.status], "border-transparent")}
                  >
                    {agent.status}
                  </Badge>
                </div>
                <p className="mt-1 text-muted-foreground">{agent.department}</p>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Boxes className="h-4 w-4" />
                    <span>{skills.length} skills</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    <span>
                      {agent.requestsHandled.toLocaleString()} requests
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>{agent.successRate}% success rate</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Settings className="h-4 w-4" />
                Configure
              </Button>
              {agent.status === "active" ? (
                <Button variant="destructive" className="gap-2">
                  <Power className="h-4 w-4" />
                  Deactivate
                </Button>
              ) : (
                <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                  <Power className="h-4 w-4" />
                  Activate
                </Button>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="mb-8 h-px bg-border" />

          {/* Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="skills">
                <TabsList className="bg-secondary">
                  <TabsTrigger value="skills" className="gap-2">
                    <Boxes className="h-4 w-4" />
                    Skills
                  </TabsTrigger>
                  <TabsTrigger value="mcps" className="gap-2">
                    <Server className="h-4 w-4" />
                    Connected Integrations
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="gap-2">
                    <Activity className="h-4 w-4" />
                    Activity
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="skills" className="mt-6">
                  <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">
                          Agent Skills
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Skills packaged from integrations that this agent can use
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="gap-2 bg-foreground text-background hover:bg-foreground/90"
                      >
                        <Plus className="h-4 w-4" />
                        Add Skill
                      </Button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-lg",
                                skill.isActive ? "bg-accent/20" : "bg-muted"
                              )}
                            >
                              <Boxes
                                className={cn(
                                  "h-5 w-5",
                                  skill.isActive
                                    ? "text-accent"
                                    : "text-muted-foreground"
                                )}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-foreground">
                                  {skill.name}
                                </p>
                                <Badge variant="secondary" className="text-xs">
                                  {skill.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                From {skill.mcpName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {skill.isActive ? "Active" : "Inactive"}
                              </span>
                              <Switch
                                checked={skill.isActive}
                                onCheckedChange={() => toggleSkill(skill.id)}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="mcps" className="mt-6">
                  <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">
                          Connected Integrations
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Integrations this agent is connected to
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="gap-2 bg-foreground text-background hover:bg-foreground/90"
                      >
                        <Plus className="h-4 w-4" />
                        Connect Integration
                      </Button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {connectedMCPs.map((mcp) => (
                        <Link
                          key={mcp.id}
                          href={`/mcp/${mcp.id}`}
                          className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4 transition-colors hover:border-accent/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                              <Server className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {mcp.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {mcp.shortDescription}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="bg-emerald-500/20 text-emerald-400 border-transparent"
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Connected
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold text-foreground">
                      Recent Activity
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Latest operations performed by this agent
                    </p>

                    <div className="mt-4 space-y-4">
                      {[
                        {
                          action: "Provisioned VM instance",
                          status: "success",
                          time: "2 mins ago",
                        },
                        {
                          action: "Compliance check completed",
                          status: "success",
                          time: "15 mins ago",
                        },
                        {
                          action: "Network configuration updated",
                          status: "success",
                          time: "1 hour ago",
                        },
                        {
                          action: "Failed to provision storage",
                          status: "failed",
                          time: "2 hours ago",
                        },
                        {
                          action: "User access granted",
                          status: "success",
                          time: "3 hours ago",
                        },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full",
                              activity.status === "success"
                                ? "bg-emerald-500/20"
                                : "bg-red-500/20"
                            )}
                          >
                            {activity.status === "success" ? (
                              <Check className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <X className="h-4 w-4 text-red-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {activity.action}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Agent Info */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground">
                  Agent Information
                </h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Created
                    </span>
                    <span className="text-sm text-foreground">
                      {agent.createdAt}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Last Active
                    </span>
                    <span className="text-sm text-foreground">
                      {agent.lastActive}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Department
                    </span>
                    <span className="text-sm text-foreground">
                      {agent.department}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground">Performance</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-medium text-foreground">
                        {agent.successRate}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${agent.successRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Requests Handled
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {agent.requestsHandled.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground">Quick Actions</h3>
                <div className="mt-4 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                  >
                    <Activity className="h-4 w-4" />
                    View Logs
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                  >
                    <BarChart className="h-4 w-4" />
                    Analytics
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                  >
                    <Clock className="h-4 w-4" />
                    Schedule
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
