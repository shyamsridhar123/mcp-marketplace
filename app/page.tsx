"use client"

import Link from "next/link"
import {
  Store,
  Bot,
  Sparkles,
  Workflow,
  Shield,
  Brain,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Zap,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { mcpServers, agentData } from "@/lib/data"
import { approvalRequests, iqSignals, agentBlueprints } from "@/lib/data"
import { motion } from "motion/react"

export default function DashboardPage() {
  const totalMcps = mcpServers.length
  const activeAgents = agentData.filter(a => a.status === "active").length
  const totalAgents = agentData.length
  const pendingApprovals = approvalRequests.filter(a => a.stage === "pending" || a.stage === "in-review").length
  const totalSignals = iqSignals.length
  const totalSkills = agentData.reduce((acc, a) => acc + (a.skills?.length || 0), 0)

  // Compute compliance score
  const complianceScores = agentData.map(a => {
    let score = 50
    if (a.observabilityEnabled) score += 20
    if (a.entraIdentity) score += 15
    if (a.blueprintId) score += 15
    return score
  })
  const avgCompliance = Math.round(complianceScores.reduce((s, v) => s + v, 0) / complianceScores.length)

  const kpis = [
    { label: "Total MCPs", value: totalMcps, icon: Store, trend: "+3 this month", trendColor: "text-[#4CAF82]" },
    { label: "Active Agents", value: `${activeAgents}/${totalAgents}`, icon: Bot, trend: "9 active", trendColor: "text-[#4CAF82]" },
    { label: "Pending Approvals", value: pendingApprovals, icon: AlertTriangle, trend: pendingApprovals > 0 ? "Action needed" : "All clear", trendColor: pendingApprovals > 0 ? "text-[#FFB547]" : "text-[#4CAF82]" },
    { label: "Compliance Score", value: `${avgCompliance}%`, icon: CheckCircle2, trend: avgCompliance >= 85 ? "Healthy" : "Needs attention", trendColor: avgCompliance >= 85 ? "text-[#4CAF82]" : "text-[#FFB547]" },
    { label: "IQ Signals", value: totalSignals, icon: Zap, trend: "3 layers active", trendColor: "text-[#47C2E1]" },
  ]

  const pillarCards = [
    { label: "Marketplace", icon: Store, href: "/marketplace", metric: `${totalMcps} MCPs`, sub: `${mcpServers.filter(m => m.isWorkIQ).length} Work IQ • ${mcpServers.filter(m => m.category === 'CRM').length} CRM`, color: "border-[#FFE600]/20" },
    { label: "Agents", icon: Bot, href: "/agents", metric: `${totalAgents} agents`, sub: `${activeAgents} active • ${agentData.filter(a => a.status === 'training').length} training`, color: "border-[#4CAF82]/20" },
    { label: "Skills", icon: Sparkles, href: "/skills", metric: `${totalSkills} skills`, sub: `${agentData.reduce((acc, a) => acc + a.skills.filter(s => s.isActive).length, 0)} active`, color: "border-[#47C2E1]/20" },
    { label: "Orchestration", icon: Workflow, href: "/canvas", metric: `${totalMcps + totalAgents} nodes`, sub: "Visual canvas", color: "border-[#FFB547]/20" },
    { label: "Governance", icon: Shield, href: "/governance", metric: `${pendingApprovals} pending`, sub: `${agentBlueprints.length} blueprints`, color: "border-[#FF8C69]/20" },
    { label: "Intelligence", icon: Brain, href: "/intelligence", metric: `${totalSignals} signals`, sub: "92% avg confidence", color: "border-[#FFE600]/20" },
  ]

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform overview — MCPs, agents, governance, and intelligence at a glance
          </p>
        </div>

        {/* KPI Row */}
        <div className="mb-8 grid grid-cols-5 gap-4">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{kpi.label}</span>
                  <Icon className="h-4 w-4 text-[#FFE600]" />
                </div>
                <p className="text-2xl font-semibold text-foreground">{kpi.value}</p>
                <p className={`text-xs mt-1 ${kpi.trendColor}`}>{kpi.trend}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Pillar Cards */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Quick Access</h2>
          <div className="grid grid-cols-3 gap-4">
            {pillarCards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.35, ease: "easeOut" }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Link
                    href={card.href}
                    className={`group rounded-lg border bg-card p-5 block transition-colors hover:border-[#FFE600]/40 hover:bg-secondary/30 ${card.color}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFE600]/10">
                          <Icon className="h-5 w-5 text-[#FFE600]" />
                        </div>
                        <h3 className="font-medium text-foreground">{card.label}</h3>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-lg font-semibold text-foreground">{card.metric}</p>
                    <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Recent Activity</h2>
          <div className="rounded-lg border border-border bg-card divide-y divide-border">
            {[
              { action: "Sales Rep Agent deployed to production", time: "2 minutes ago", type: "success" },
              { action: "Work IQ Mail MCP activated with admin consent", time: "15 minutes ago", type: "success" },
              { action: "HR Onboarding Blueprint submitted for review", time: "1 hour ago", type: "info" },
              { action: "Compliance Sentinel flagged policy violation on Lead Gen Agent", time: "2 hours ago", type: "warning" },
              { action: "Dynamics 365 Sales Core access approved for Sales team", time: "3 hours ago", type: "success" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.05, duration: 0.3 }}
                className="flex items-center gap-3 px-4 py-3"
              >
                <div className={`h-2 w-2 rounded-full shrink-0 ${item.type === "success" ? "bg-[#4CAF82]" : item.type === "warning" ? "bg-[#FFB547]" : "bg-[#47C2E1]"}`} />
                <p className="text-sm text-foreground flex-1">{item.action}</p>
                <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}
