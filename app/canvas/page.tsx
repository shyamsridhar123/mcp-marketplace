"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Package,
  Bot,
  Sparkles,
  Server,
  CheckCircle2,
  Workflow,
  ChevronDown,
  ChevronUp,
  Settings,
  Zap,
  Play,
  Copy,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AppShell } from "@/components/app-shell"
import { agentData, mcpServers } from "@/lib/data"
import { agentBlueprints } from "@/lib/data"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"

// Build agent compositions from real data — each agent is a hub with skills pointing to MCPs
function buildCompositions() {
  return agentData
    .filter(a => a.skills.length > 0 && a.status !== "inactive")
    .map(agent => {
      const blueprint = agentBlueprints.find(b => b.id === agent.blueprintId)
      // group skills by their source MCP
      const mcpGroups = new Map<string, { mcp: typeof mcpServers[0] | undefined; skills: typeof agent.skills }>()
      for (const skill of agent.skills) {
        const existing = mcpGroups.get(skill.mcpId)
        if (existing) {
          existing.skills.push(skill)
        } else {
          mcpGroups.set(skill.mcpId, {
            mcp: mcpServers.find(m => m.id === skill.mcpId),
            skills: [skill],
          })
        }
      }
      return {
        agent,
        blueprint,
        mcpGroups: Array.from(mcpGroups.values()),
        totalMcps: mcpGroups.size,
      }
    })
}

const statusColors: Record<string, string> = {
  active: "text-[#4CAF82] bg-[#4CAF82]/10 border-[#4CAF82]/20",
  training: "text-[#FFB547] bg-[#FFB547]/10 border-[#FFB547]/20",
  inactive: "text-[#9898A0] bg-[#9898A0]/10 border-[#9898A0]/20",
}

export default function OrchestrationPage() {
  const compositions = buildCompositions()
  const [expandedAgent, setExpandedAgent] = useState<string | null>(compositions[0]?.agent.id || null)
  const [selectedDept, setSelectedDept] = useState<string>("all")

  const departments = ["all", ...new Set(compositions.map(c => c.agent.department))]
  const filtered = selectedDept === "all" ? compositions : compositions.filter(c => c.agent.department === selectedDept)

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Workflow className="h-6 w-6 text-[#FFE600]" />
              Orchestration
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              See how agents compose skills and MCPs — package compositions for deployment
            </p>
          </div>
          <Button className="gap-2 bg-[#FFE600] text-[#1A1A24] hover:bg-[#FFE600]/90 font-medium">
            <Plus className="h-4 w-4" />
            New Composition
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          {[
            { label: "Agent Compositions", value: compositions.length, color: "text-[#4CAF82]" },
            { label: "Skills Connected", value: compositions.reduce((s, c) => s + c.agent.skills.length, 0), color: "text-[#FFE600]" },
            { label: "MCPs in Use", value: new Set(compositions.flatMap(c => c.mcpGroups.map(g => g.mcp?.id))).size, color: "text-[#47C2E1]" },
            { label: "Blueprints Applied", value: new Set(compositions.map(c => c.blueprint?.id).filter(Boolean)).size, color: "text-[#FFB547]" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              className="rounded-lg border border-border bg-card p-4"
            >
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={cn("mt-1 text-2xl font-semibold", stat.color)}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Department Filter */}
        <div className="mb-6 flex gap-1 rounded-lg border border-border p-1 w-fit">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                selectedDept === dept ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Composition Cards */}
        <div className="space-y-4">
          {filtered.map((comp, idx) => {
            const isExpanded = expandedAgent === comp.agent.id
            return (
              <motion.div
                key={comp.agent.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.06, duration: 0.3 }}
                className="rounded-lg border border-border bg-card overflow-hidden"
              >
                {/* Header Row */}
                <button
                  onClick={() => setExpandedAgent(isExpanded ? null : comp.agent.id)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-secondary/20 transition-colors"
                >
                  {/* Agent Icon */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#4CAF82]/10 shrink-0">
                    <Bot className="h-5 w-5 text-[#4CAF82]" />
                  </div>

                  {/* Agent Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-medium text-foreground">{comp.agent.name}</h3>
                      <Badge variant="outline" className={cn("text-[10px]", statusColors[comp.agent.status])}>{comp.agent.status}</Badge>
                      {comp.blueprint && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/20">{comp.blueprint.name}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{comp.agent.department}</p>
                  </div>

                  {/* Composition Summary — hub-spoke preview */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Sparkles className="h-3 w-3 text-[#FFE600]" />
                      <span>{comp.agent.skills.length} skills</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Server className="h-3 w-3 text-[#47C2E1]" />
                      <span>{comp.totalMcps} MCPs</span>
                    </div>
                    {comp.agent.requestsHandled > 0 && (
                      <span className="text-xs text-muted-foreground">{comp.agent.requestsHandled.toLocaleString()} requests</span>
                    )}
                  </div>

                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </button>

                {/* Expanded: Hub-Spoke Composition View */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border p-5">
                        {/* Hub-Spoke Layout: Agent in center, MCP groups fan out */}
                        <div className="flex gap-6">
                          {/* Agent Hub (Left) */}
                          <div className="w-48 shrink-0">
                            <div className="rounded-lg border-2 border-[#4CAF82]/30 bg-[#4CAF82]/5 p-4 text-center">
                              <div className="flex justify-center mb-2">
                                <div className="h-12 w-12 rounded-full bg-[#4CAF82]/15 flex items-center justify-center">
                                  <Bot className="h-6 w-6 text-[#4CAF82]" />
                                </div>
                              </div>
                              <p className="text-sm font-medium text-foreground">{comp.agent.name}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">{comp.agent.department}</p>
                              {comp.agent.entraIdentity && (
                                <p className="text-[10px] text-[#47C2E1] mt-1">🛡️ Entra Identity</p>
                              )}
                              <div className="mt-3 pt-3 border-t border-[#4CAF82]/20">
                                <p className="text-[10px] text-muted-foreground">{comp.agent.successRate}% success</p>
                                <p className="text-[10px] text-muted-foreground">{comp.agent.requestsHandled.toLocaleString()} requests</p>
                              </div>
                            </div>
                          </div>

                          {/* Skills → MCPs (Right, fanning out) */}
                          <div className="flex-1 space-y-3">
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Skills → MCP Sources</h4>
                            {comp.mcpGroups.map((group, gi) => (
                              <motion.div
                                key={group.mcp?.id || gi}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: gi * 0.08 }}
                                className="flex items-stretch gap-3"
                              >
                                {/* Skills for this MCP */}
                                <div className="flex-1 space-y-1.5">
                                  {group.skills.map(skill => (
                                    <div key={skill.id} className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
                                      <div className="h-5 w-5 rounded bg-[#FFE600]/15 flex items-center justify-center shrink-0">
                                        <Sparkles className="h-3 w-3 text-[#FFE600]" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-foreground truncate">{skill.name}</p>
                                        <p className="text-[10px] text-muted-foreground truncate">{skill.description}</p>
                                      </div>
                                      <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", skill.isActive ? "bg-[#4CAF82]" : "bg-[#9898A0]")} />
                                    </div>
                                  ))}
                                </div>

                                {/* Arrow */}
                                <div className="flex items-center shrink-0 px-1">
                                  <div className="flex items-center text-muted-foreground/30">
                                    <div className="w-4 h-px bg-border" />
                                    <Zap className="h-3 w-3 text-[#47C2E1]/50" />
                                    <div className="w-4 h-px bg-border" />
                                  </div>
                                </div>

                                {/* MCP Source */}
                                <div className="w-44 shrink-0 flex items-center">
                                  <div className="rounded-md border border-[#47C2E1]/20 bg-[#47C2E1]/5 px-3 py-2 w-full">
                                    <div className="flex items-center gap-2">
                                      <div className="h-6 w-6 rounded bg-[#47C2E1]/15 flex items-center justify-center shrink-0">
                                        <Server className="h-3 w-3 text-[#47C2E1]" />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-xs font-medium text-foreground truncate">{group.mcp?.name || "Unknown"}</p>
                                        <p className="text-[10px] text-muted-foreground">{group.mcp?.category}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between border-t border-border pt-4 mt-5">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{comp.agent.skills.length} skills from {comp.totalMcps} MCPs</span>
                            {comp.blueprint && <span>· Blueprint: {comp.blueprint.name}</span>}
                            {comp.agent.observabilityEnabled && <span>· OTel enabled</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <Link href={`/agents/${comp.agent.id}`}>
                              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 bg-transparent">
                                <Eye className="h-3 w-3" /> View Agent
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 bg-transparent">
                              <Copy className="h-3 w-3" /> Clone
                            </Button>
                            <Button size="sm" className="gap-1.5 text-xs h-8 bg-[#FFE600] text-[#1A1A24] hover:bg-[#FFE600]/90">
                              <Package className="h-3 w-3" /> Package
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
