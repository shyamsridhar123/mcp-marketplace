"use client"

import Link from "next/link"
import {
  BarChart3,
  TrendingUp,
  Activity,
  Server,
  Users,
  ArrowUp,
  ArrowDown,
  Cpu,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AppShell } from "@/components/app-shell"
import { mcpServers, agentData } from "@/lib/data"

const totalDownloads = mcpServers.reduce((sum, m) => sum + m.downloads, 0)
const totalRequests = agentData.reduce((sum, a) => sum + a.requestsHandled, 0)
const avgSuccessRate =
  agentData.reduce((sum, a) => sum + a.successRate, 0) / agentData.length

export default function AnalyticsPage() {
  return (
    <AppShell>
      {/* Main Content */}
      <div className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Analytics
            </h1>
            <p className="mt-1 text-muted-foreground">
              Monitor usage, performance, and trends
            </p>
          </div>

          {/* Divider */}
          <div className="mb-6 h-px bg-border" />

          {/* Key Metrics */}
          <div className="mb-8 grid grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                  <Server className="h-5 w-5 text-accent" />
                </div>
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <ArrowUp className="h-3 w-3" />
                  12%
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground">
                {mcpServers.length}
              </p>
              <p className="text-sm text-muted-foreground">Total Integrations</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                  <Activity className="h-5 w-5 text-blue-400" />
                </div>
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <ArrowUp className="h-3 w-3" />
                  8%
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground">
                {agentData.length}
              </p>
              <p className="text-sm text-muted-foreground">Active Agents</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                  <TrendingUp className="h-5 w-5 text-amber-400" />
                </div>
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <ArrowUp className="h-3 w-3" />
                  24%
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground">
                {totalRequests.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Requests</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="flex items-center gap-1 text-xs text-red-400">
                  <ArrowDown className="h-3 w-3" />
                  2%
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground">
                {avgSuccessRate.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* MCP Usage Chart */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground">
                Downloads by Category
              </h3>
              <p className="text-sm text-muted-foreground">
                Distribution of integration installations
              </p>

              <div className="mt-6 space-y-4">
                {[
                  { category: "Logging", downloads: 75678, percentage: 35 },
                  { category: "Database", downloads: 41479, percentage: 25 },
                  { category: "DevTools", downloads: 25678, percentage: 20 },
                  { category: "Analytics", downloads: 4532, percentage: 12 },
                  { category: "Other", downloads: 12000, percentage: 8 },
                ].map((item) => (
                  <div key={item.category}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{item.category}</span>
                      <span className="text-muted-foreground">
                        {item.downloads.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Performance */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground">Agent Performance</h3>
              <p className="text-sm text-muted-foreground">
                Top performing agents by success rate
              </p>

              <div className="mt-6 space-y-4">
                {agentData
                  .sort((a, b) => b.successRate - a.successRate)
                  .map((agent) => (
                    <div key={agent.id} className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Activity className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">
                            {agent.name}
                          </p>
                          <span className="text-sm font-medium text-accent">
                            {agent.successRate}%
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${agent.successRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Skills Usage */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground">
                Skills by Category
              </h3>
              <p className="text-sm text-muted-foreground">
                Distribution of skills across categories
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { category: "Logging", count: 4, color: "bg-[#FFE600]" },
                  { category: "Database", count: 3, color: "bg-orange-500" },
                  { category: "DevTools", count: 2, color: "bg-emerald-500" },
                  { category: "Analytics", count: 2, color: "bg-amber-500" },
                ].map((item) => (
                  <div
                    key={item.category}
                    className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3"
                  >
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.category}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.count} skills
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground">Request Volume</h3>
              <p className="text-sm text-muted-foreground">
                Requests handled per agent
              </p>

              <div className="mt-6 space-y-4">
                {agentData
                  .sort((a, b) => b.requestsHandled - a.requestsHandled)
                  .map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                          <Users className="h-4 w-4 text-accent" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {agent.name}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {agent.requestsHandled.toLocaleString()} requests
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

