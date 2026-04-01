"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { agentData, mcpServers } from "@/lib/data"
import { agentTraces, iqSignals, agentBlueprints, dlpPolicies, approvalRequests } from "@/lib/data"
import {
  Brain, Activity, Shield, Eye, TrendingUp, Zap, Clock, CheckCircle2,
  AlertTriangle, BarChart3, Layers, Cpu, MemoryStick, Server, Bot, Sparkles,
  ArrowUpRight, ArrowDownRight, Search, XCircle, Timer, Hash,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"

// ─── Computed Metrics ────────────────────────────

function useMetrics() {
  return useMemo(() => {
    const totalTraces = agentTraces.length
    const successTraces = agentTraces.filter(t => t.result === "success").length
    const failedTraces = agentTraces.filter(t => t.result === "failure").length
    const avgLatency = Math.round(agentTraces.reduce((s, t) => s + t.durationMs, 0) / totalTraces)
    const p95Latency = Math.round([...agentTraces].sort((a, b) => b.durationMs - a.durationMs)[Math.floor(totalTraces * 0.05)]?.durationMs || 0)

    // Per-agent metrics
    const agentMetrics = agentData.map(agent => {
      const traces = agentTraces.filter(t => t.agentId === agent.id)
      const success = traces.filter(t => t.result === "success").length
      const avgDur = traces.length ? Math.round(traces.reduce((s, t) => s + t.durationMs, 0) / traces.length) : 0
      const blueprint = agentBlueprints.find(b => b.id === agent.blueprintId)

      // Compliance score
      let compliance = 40
      if (agent.observabilityEnabled) compliance += 20
      if (agent.entraIdentity) compliance += 20
      if (agent.blueprintId) compliance += 10
      if (agent.lifecycleStatus === "active") compliance += 10

      return {
        agent,
        traceCount: traces.length,
        successRate: traces.length ? Math.round((success / traces.length) * 100) : 0,
        avgLatency: avgDur,
        blueprint,
        compliance,
        mcpCount: agent.mcpConnections.length,
        skillCount: agent.skills.length,
      }
    }).sort((a, b) => b.traceCount - a.traceCount)

    // MCP usage
    const mcpUsage = mcpServers.filter(m => m.isInstalled).map(mcp => {
      const agents = agentData.filter(a => a.mcpConnections.includes(mcp.id))
      const traces = agentTraces.filter(t => t.toolServerName === mcp.name)
      return { mcp, agentCount: agents.length, traceCount: traces.length }
    }).sort((a, b) => b.agentCount - a.agentCount)

    return {
      totalTraces, successTraces, failedTraces, avgLatency, p95Latency,
      successRate: Math.round((successTraces / totalTraces) * 100),
      agentMetrics, mcpUsage,
      totalAgents: agentData.length,
      activeAgents: agentData.filter(a => a.status === "active").length,
      totalMcps: mcpServers.filter(m => m.isInstalled).length,
      pendingApprovals: approvalRequests.filter(a => a.stage === "pending" || a.stage === "in-review").length,
      activePolicies: dlpPolicies.filter(p => p.status === "active").length,
      totalSignals: iqSignals.length,
    }
  }, [])
}

// ─── Animated Metric Card ────────────────────────

function MetricCard({ label, value, icon: Icon, trend, trendUp, delay, color }: {
  label: string; value: string | number; icon: typeof Activity; trend?: string; trendUp?: boolean; delay: number; color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      className="rounded-lg border border-border bg-card p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
        <Icon className={cn("h-4 w-4", color)} />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {trend && (
        <div className={cn("flex items-center gap-1 mt-1 text-[10px]", trendUp ? "text-[#4CAF82]" : "text-[#FF6B6B]")}>
          {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend}
        </div>
      )}
    </motion.div>
  )
}

// ─── Trace Row ───────────────────────────────────

function TraceRow({ trace, index }: { trace: typeof agentTraces[0]; index: number }) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="border-b border-border hover:bg-secondary/20 transition-colors"
    >
      <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{new Date(trace.timestamp).toLocaleTimeString()}</td>
      <td className="px-3 py-2">
        <Link href={`/agents/${trace.agentId}`} className="text-xs text-foreground hover:text-[#FFE600] transition-colors">{trace.agentName}</Link>
      </td>
      <td className="px-3 py-2"><Badge variant="outline" className="text-[9px] capitalize">{trace.traceType.replace("_", " ")}</Badge></td>
      <td className="px-3 py-2 text-xs text-foreground">{trace.toolServerName || "—"}</td>
      <td className="px-3 py-2">
        <span className={cn("flex items-center gap-1 text-[10px] font-medium",
          trace.result === "success" ? "text-[#4CAF82]" : trace.result === "failure" ? "text-[#FF6B6B]" : "text-[#FFB547]"
        )}>
          <span className={cn("h-1.5 w-1.5 rounded-full",
            trace.result === "success" ? "bg-[#4CAF82]" : trace.result === "failure" ? "bg-[#FF6B6B]" : "bg-[#FFB547]"
          )} />
          {trace.result}
        </span>
      </td>
      <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground text-right">
        <span className={cn(trace.durationMs > 1000 ? "text-[#FFB547]" : trace.durationMs > 2000 ? "text-[#FF6B6B]" : "")}>
          {trace.durationMs}ms
        </span>
      </td>
      <td className="px-3 py-2 text-[10px] text-muted-foreground">{trace.initiatedBy || "system"}</td>
    </motion.tr>
  )
}

// ─── Main Page ───────────────────────────────────

export default function IntelligencePage() {
  const m = useMetrics()
  const [traceFilter, setTraceFilter] = useState<"all" | "success" | "failure">("all")

  const filteredTraces = traceFilter === "all" ? agentTraces :
    agentTraces.filter(t => t.result === traceFilter)

  const dataSignals = iqSignals.filter(s => s.layer === "data")
  const memorySignals = iqSignals.filter(s => s.layer === "memory")
  const inferenceSignals = iqSignals.filter(s => s.layer === "inference")

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Brain className="h-6 w-6 text-[#FFE600]" />
            Intelligence & Observability
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enterprise governance analytics — trace every agent action, monitor performance, enforce compliance
          </p>
        </div>

        {/* KPI Row */}
        <div className="mb-6 grid grid-cols-6 gap-3">
          <MetricCard label="Total Traces" value={m.totalTraces} icon={Activity} trend="+16 today" trendUp delay={0} color="text-[#47C2E1]" />
          <MetricCard label="Success Rate" value={`${m.successRate}%`} icon={CheckCircle2} trend="+2.1% vs last week" trendUp delay={0.06} color="text-[#4CAF82]" />
          <MetricCard label="Avg Latency" value={`${m.avgLatency}ms`} icon={Timer} trend="P95: {m.p95Latency}ms" trendUp delay={0.12} color="text-[#FFB547]" />
          <MetricCard label="Active Agents" value={`${m.activeAgents}/${m.totalAgents}`} icon={Bot} delay={0.18} color="text-[#4CAF82]" />
          <MetricCard label="MCP Tools" value={m.totalMcps} icon={Server} delay={0.24} color="text-[#47C2E1]" />
          <MetricCard label="IQ Signals" value={m.totalSignals} icon={Zap} trend="3 layers active" trendUp delay={0.3} color="text-[#FFE600]" />
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="traces" className="space-y-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="traces" className="gap-1.5 text-xs"><Activity className="h-3.5 w-3.5" /> Traces</TabsTrigger>
            <TabsTrigger value="agents" className="gap-1.5 text-xs"><Bot className="h-3.5 w-3.5" /> Agent Health</TabsTrigger>
            <TabsTrigger value="mcps" className="gap-1.5 text-xs"><Server className="h-3.5 w-3.5" /> MCP Usage</TabsTrigger>
            <TabsTrigger value="compliance" className="gap-1.5 text-xs"><Shield className="h-3.5 w-3.5" /> Compliance</TabsTrigger>
            <TabsTrigger value="signals" className="gap-1.5 text-xs"><Zap className="h-3.5 w-3.5" /> IQ Signals</TabsTrigger>
          </TabsList>

          {/* ── Traces Tab (LangSmith-inspired) ── */}
          <TabsContent value="traces">
            <div className="rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground font-mono">Agent Trace Explorer</h3>
                  <Badge variant="outline" className="text-[9px]">{filteredTraces.length} traces</Badge>
                </div>
                <div className="flex gap-1 rounded-md border border-border p-0.5">
                  {(["all", "success", "failure"] as const).map(f => (
                    <button key={f} onClick={() => setTraceFilter(f)}
                      className={cn("px-2.5 py-1 text-[10px] rounded capitalize transition-colors",
                        traceFilter === f ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}>{f}</button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/30">
                      {["Time", "Agent", "Type", "Tool Server", "Result", "Latency", "Initiated By"].map(h => (
                        <th key={h} className="px-3 py-2 text-left text-[10px] font-medium text-muted-foreground font-mono">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{filteredTraces.map((t, i) => <TraceRow key={t.id} trace={t} index={i} />)}</tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* ── Agent Health Tab ── */}
          <TabsContent value="agents">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {m.agentMetrics.map((am, i) => (
                <motion.div
                  key={am.agent.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-[#4CAF82]/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-[#4CAF82]" />
                      </div>
                      <div>
                        <Link href={`/agents/${am.agent.id}`} className="text-xs font-medium text-foreground hover:text-[#FFE600] transition-colors">{am.agent.name}</Link>
                        <p className="text-[9px] text-muted-foreground">{am.agent.department}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("text-[9px]",
                      am.agent.status === "active" ? "text-[#4CAF82] border-[#4CAF82]/30" : "text-[#FFB547] border-[#FFB547]/30"
                    )}>{am.agent.status}</Badge>
                  </div>

                  {/* Mini metrics */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">{am.traceCount}</p>
                      <p className="text-[8px] text-muted-foreground">Traces</p>
                    </div>
                    <div className="text-center">
                      <p className={cn("text-sm font-semibold", am.successRate >= 95 ? "text-[#4CAF82]" : am.successRate >= 85 ? "text-[#FFB547]" : "text-[#FF6B6B]")}>{am.successRate}%</p>
                      <p className="text-[8px] text-muted-foreground">Success</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">{am.avgLatency}ms</p>
                      <p className="text-[8px] text-muted-foreground">Avg Latency</p>
                    </div>
                    <div className="text-center">
                      <p className={cn("text-sm font-semibold", am.compliance >= 90 ? "text-[#4CAF82]" : am.compliance >= 70 ? "text-[#FFB547]" : "text-[#FF6B6B]")}>{am.compliance}%</p>
                      <p className="text-[8px] text-muted-foreground">Compliance</p>
                    </div>
                  </div>

                  {/* Health bar */}
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${am.successRate}%` }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
                      className={cn("h-full rounded-full", am.successRate >= 95 ? "bg-[#4CAF82]" : am.successRate >= 85 ? "bg-[#FFB547]" : "bg-[#FF6B6B]")}
                    />
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-[8px] text-muted-foreground">
                    <span>{am.skillCount} skills</span><span>·</span>
                    <span>{am.mcpCount} MCPs</span>
                    {am.blueprint && <><span>·</span><span className="text-[#FFE600]">{am.blueprint.name}</span></>}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ── MCP Usage Tab ── */}
          <TabsContent value="mcps">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {m.mcpUsage.map((mu, i) => (
                <motion.div
                  key={mu.mcp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-lg bg-[#47C2E1]/10 flex items-center justify-center">
                      <Server className="h-4 w-4 text-[#47C2E1]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/mcp/${mu.mcp.id}`} className="text-xs font-medium text-foreground hover:text-[#FFE600] transition-colors truncate block">{mu.mcp.name}</Link>
                      <p className="text-[9px] text-muted-foreground">{mu.mcp.category} · {mu.mcp.provider}</p>
                    </div>
                    {mu.mcp.isWorkIQ && <Badge variant="outline" className="text-[8px] text-[#FFE600] border-[#FFE600]/30">Work IQ</Badge>}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="rounded-md bg-secondary/50 p-2 text-center">
                      <p className="text-sm font-semibold text-[#4CAF82]">{mu.agentCount}</p>
                      <p className="text-[8px] text-muted-foreground">Agents</p>
                    </div>
                    <div className="rounded-md bg-secondary/50 p-2 text-center">
                      <p className="text-sm font-semibold text-[#47C2E1]">{mu.traceCount}</p>
                      <p className="text-[8px] text-muted-foreground">Traces</p>
                    </div>
                    <div className="rounded-md bg-secondary/50 p-2 text-center">
                      <p className="text-sm font-semibold text-foreground">{mu.mcp.complianceLevel}</p>
                      <p className="text-[8px] text-muted-foreground">Compliance</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {mu.mcp.capabilities.slice(0, 3).map(c => (
                      <span key={c} className="text-[7px] bg-[#47C2E1]/10 text-[#47C2E1] px-1.5 py-0.5 rounded">{c}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ── Compliance Tab ── */}
          <TabsContent value="compliance">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Compliance Scorecards */}
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#FFE600]" /> Agent Compliance Scores
                </h3>
                <div className="space-y-2.5">
                  {m.agentMetrics.map((am, i) => (
                    <motion.div
                      key={am.agent.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3"
                    >
                      <Link href={`/agents/${am.agent.id}`} className="text-[10px] text-foreground w-36 truncate hover:text-[#FFE600]">{am.agent.name}</Link>
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${am.compliance}%` }}
                          transition={{ delay: 0.2 + i * 0.04, duration: 0.5 }}
                          className={cn("h-full rounded-full",
                            am.compliance >= 90 ? "bg-[#4CAF82]" : am.compliance >= 70 ? "bg-[#FFB547]" : "bg-[#FF6B6B]"
                          )}
                        />
                      </div>
                      <span className={cn("text-[10px] font-medium w-10 text-right",
                        am.compliance >= 90 ? "text-[#4CAF82]" : am.compliance >= 70 ? "text-[#FFB547]" : "text-[#FF6B6B]"
                      )}>{am.compliance}%</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Governance Summary */}
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-[#47C2E1]" /> Governance Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-md bg-secondary/50 p-3">
                      <p className="text-lg font-bold text-[#FFE600]">{agentBlueprints.length}</p>
                      <p className="text-[9px] text-muted-foreground">Active Blueprints</p>
                    </div>
                    <div className="rounded-md bg-secondary/50 p-3">
                      <p className="text-lg font-bold text-[#47C2E1]">{m.activePolicies}</p>
                      <p className="text-[9px] text-muted-foreground">DLP Policies</p>
                    </div>
                    <div className="rounded-md bg-secondary/50 p-3">
                      <p className={cn("text-lg font-bold", m.pendingApprovals > 0 ? "text-[#FFB547]" : "text-[#4CAF82]")}>{m.pendingApprovals}</p>
                      <p className="text-[9px] text-muted-foreground">Pending Approvals</p>
                    </div>
                    <div className="rounded-md bg-secondary/50 p-3">
                      <p className="text-lg font-bold text-[#4CAF82]">{agentData.filter(a => a.entraIdentity).length}</p>
                      <p className="text-[9px] text-muted-foreground">Entra Identities</p>
                    </div>
                  </div>
                </div>

                {/* Compliance Factors */}
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Scoring Factors</h3>
                  <div className="space-y-2">
                    {[
                      { label: "OpenTelemetry Enabled", count: agentData.filter(a => a.observabilityEnabled).length, total: agentData.length, color: "bg-[#47C2E1]" },
                      { label: "Entra Identity", count: agentData.filter(a => a.entraIdentity).length, total: agentData.length, color: "bg-[#4CAF82]" },
                      { label: "Blueprint Assigned", count: agentData.filter(a => a.blueprintId).length, total: agentData.length, color: "bg-[#FFE600]" },
                      { label: "Active Lifecycle", count: agentData.filter(a => a.lifecycleStatus === "active").length, total: agentData.length, color: "bg-[#FFB547]" },
                    ].map((f, i) => (
                      <div key={f.label} className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground w-40">{f.label}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(f.count / f.total) * 100}%` }}
                            transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                            className={cn("h-full rounded-full", f.color)}
                          />
                        </div>
                        <span className="text-[10px] text-foreground w-12 text-right">{f.count}/{f.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── IQ Signals Tab ── */}
          <TabsContent value="signals">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Data Signals", signals: dataSignals, color: "text-[#47C2E1]", bg: "bg-[#47C2E1]/10", border: "border-[#47C2E1]/20", barColor: "bg-[#47C2E1]", icon: Layers },
                { label: "Organizational Memory", signals: memorySignals, color: "text-[#FFE600]", bg: "bg-[#FFE600]/10", border: "border-[#FFE600]/20", barColor: "bg-[#FFE600]", icon: MemoryStick },
                { label: "Inference Activity", signals: inferenceSignals, color: "text-[#4CAF82]", bg: "bg-[#4CAF82]/10", border: "border-[#4CAF82]/20", barColor: "bg-[#4CAF82]", icon: Cpu },
              ].map((panel, pi) => {
                const PanelIcon = panel.icon
                return (
                  <motion.div
                    key={panel.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + pi * 0.12 }}
                    className={cn("rounded-lg border p-4", panel.border, panel.bg)}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <PanelIcon className={cn("h-4 w-4", panel.color)} />
                      <h3 className={cn("text-sm font-semibold", panel.color)}>{panel.label}</h3>
                      <Badge variant="outline" className="ml-auto text-[9px]">{panel.signals.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {panel.signals.map((signal, si) => (
                        <motion.div
                          key={signal.id}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + pi * 0.1 + si * 0.05 }}
                          className="rounded-md bg-background/50 p-2.5 border border-border/50"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="text-[8px] px-1.5">{signal.type}</Badge>
                            <span className="text-[8px] text-muted-foreground">{new Date(signal.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-[10px] text-foreground/80 leading-relaxed">{signal.content}</p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="h-1 flex-1 rounded-full bg-border overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${signal.confidence * 100}%` }}
                                transition={{ delay: 0.5 + si * 0.05, duration: 0.4 }}
                                className={cn("h-full rounded-full", panel.barColor)}
                              />
                            </div>
                            <span className="text-[9px] text-muted-foreground">{Math.round(signal.confidence * 100)}%</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}

