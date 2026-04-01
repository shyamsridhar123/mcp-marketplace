"use client"

import { useState } from "react"
import {
  Plus,
  Play,
  Package,
  ArrowRight,
  Bot,
  Sparkles,
  Server,
  CheckCircle2,
  Clock,
  Workflow,
  ChevronDown,
  ChevronUp,
  Trash2,
  Settings,
  Zap,
  Brain,
  Shield,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AppShell } from "@/components/app-shell"
import { mcpServers, agentData } from "@/lib/data"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"

interface WorkflowStep {
  id: string
  type: "agent" | "skill" | "mcp"
  entityId: string
  name: string
  description: string
  icon: string
  category?: string
}

interface WorkflowDef {
  id: string
  name: string
  description: string
  status: "draft" | "active" | "paused"
  steps: WorkflowStep[]
  createdAt: string
  runs: number
  successRate: number
}

const prebuiltWorkflows: WorkflowDef[] = [
  {
    id: "wf-sales-pipeline",
    name: "Sales Pipeline Automation",
    description: "Qualify leads → enrich contacts → update CRM → notify sales team",
    status: "active",
    steps: [
      { id: "s1", type: "mcp", entityId: "d365-copilot-sales", name: "D365 Copilot for Sales", description: "Score and qualify incoming leads", icon: "message-square", category: "CRM" },
      { id: "s2", type: "skill", entityId: "s24", name: "Contact Enrichment", description: "Enrich contact profiles from email signals", icon: "sparkles" },
      { id: "s3", type: "agent", entityId: "lead-gen-agent", name: "Lead Generation Agent", description: "Process qualified leads into CRM", icon: "target" },
      { id: "s4", type: "mcp", entityId: "d365-sales-core", name: "D365 Sales", description: "Update opportunity and pipeline", icon: "briefcase", category: "CRM" },
      { id: "s5", type: "mcp", entityId: "workiq-teams-mcp", name: "Work IQ Teams", description: "Notify sales channel with deal alert", icon: "users", category: "Productivity" },
    ],
    createdAt: "2026-03-15",
    runs: 234,
    successRate: 96.8,
  },
  {
    id: "wf-meeting-sync",
    name: "Meeting-to-CRM Sync",
    description: "Capture meeting notes → extract action items → log to CRM opportunity",
    status: "active",
    steps: [
      { id: "s1", type: "mcp", entityId: "workiq-calendar-mcp", name: "Work IQ Calendar", description: "Capture meeting notes and attendees", icon: "calendar", category: "Productivity" },
      { id: "s2", type: "agent", entityId: "knowledge-worker-agent", name: "Knowledge Worker Agent", description: "Extract key decisions and action items", icon: "brain" },
      { id: "s3", type: "skill", entityId: "s20", name: "Meeting-to-CRM Sync", description: "Map meeting outcomes to CRM fields", icon: "sparkles" },
      { id: "s4", type: "mcp", entityId: "d365-sales-core", name: "D365 Sales", description: "Update opportunity with meeting notes", icon: "briefcase", category: "CRM" },
    ],
    createdAt: "2026-03-20",
    runs: 156,
    successRate: 98.2,
  },
  {
    id: "wf-compliance-scan",
    name: "Compliance Monitoring",
    description: "Scan systems → detect violations → enforce policies → generate report",
    status: "active",
    steps: [
      { id: "s1", type: "mcp", entityId: "betterstack-mcp", name: "Better Stack", description: "Collect system logs for analysis", icon: "terminal", category: "Logging" },
      { id: "s2", type: "agent", entityId: "compliance-sentinel", name: "Compliance Sentinel", description: "Analyze logs against compliance rules", icon: "shield-check" },
      { id: "s3", type: "skill", entityId: "s12", name: "Policy Enforcement", description: "Apply automated policy enforcement", icon: "sparkles" },
      { id: "s4", type: "mcp", entityId: "mongodb-mcp", name: "MongoDB Atlas", description: "Store compliance report in audit database", icon: "database", category: "Database" },
    ],
    createdAt: "2026-02-28",
    runs: 1847,
    successRate: 99.5,
  },
  {
    id: "wf-forecast",
    name: "Revenue Forecast Generation",
    description: "Pull pipeline data → analyze velocity → generate forecast → share with leadership",
    status: "draft",
    steps: [
      { id: "s1", type: "mcp", entityId: "d365-sales-core", name: "D365 Sales", description: "Extract current pipeline and deal data", icon: "briefcase", category: "CRM" },
      { id: "s2", type: "mcp", entityId: "d365-sales-insights", name: "D365 Sales Insights", description: "Analyze deal velocity and win rates", icon: "trending-up", category: "CRM" },
      { id: "s3", type: "agent", entityId: "sales-manager-agent", name: "Sales Manager Agent", description: "Generate quarterly forecast with confidence", icon: "bar-chart" },
      { id: "s4", type: "mcp", entityId: "workiq-teams-mcp", name: "Work IQ Teams", description: "Post forecast summary to leadership channel", icon: "users", category: "Productivity" },
    ],
    createdAt: "2026-03-28",
    runs: 0,
    successRate: 0,
  },
]

const stepTypeConfig = {
  agent: { color: "bg-[#4CAF82]", label: "Agent", icon: Bot },
  skill: { color: "bg-[#FFE600]", label: "Skill", icon: Sparkles },
  mcp: { color: "bg-[#47C2E1]", label: "MCP", icon: Server },
}

const statusConfig = {
  active: { label: "Active", color: "text-[#4CAF82] bg-[#4CAF82]/10 border-[#4CAF82]/20" },
  draft: { label: "Draft", color: "text-[#FFB547] bg-[#FFB547]/10 border-[#FFB547]/20" },
  paused: { label: "Paused", color: "text-[#9898A0] bg-[#9898A0]/10 border-[#9898A0]/20" },
}

// Available resources for the palette
const availableAgents = agentData.filter(a => a.status === "active").slice(0, 6)
const availableMcps = mcpServers.filter(m => m.isInstalled).slice(0, 8)
const availableSkills = agentData.flatMap(a => a.skills.filter(s => s.isActive)).slice(0, 8)

export default function OrchestrationPage() {
  const [workflows, setWorkflows] = useState(prebuiltWorkflows)
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>("wf-sales-pipeline")
  const [showPalette, setShowPalette] = useState(false)
  const [paletteTab, setPaletteTab] = useState<"agents" | "skills" | "mcps">("agents")
  const [searchQuery, setSearchQuery] = useState("")

  const toggleWorkflow = (id: string) => {
    setExpandedWorkflow(expandedWorkflow === id ? null : id)
  }

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
              Compose agents, skills, and MCPs into automated workflows — then package and deploy
            </p>
          </div>
          <Button
            className="gap-2 bg-[#FFE600] text-[#1A1A24] hover:bg-[#FFE600]/90 font-medium"
            onClick={() => setShowPalette(true)}
          >
            <Plus className="h-4 w-4" />
            New Workflow
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          {[
            { label: "Active Workflows", value: workflows.filter(w => w.status === "active").length, trend: "Running", color: "text-[#4CAF82]" },
            { label: "Total Runs", value: workflows.reduce((s, w) => s + w.runs, 0).toLocaleString(), trend: "Last 30 days", color: "text-[#47C2E1]" },
            { label: "Avg Success Rate", value: `${(workflows.filter(w => w.runs > 0).reduce((s, w) => s + w.successRate, 0) / workflows.filter(w => w.runs > 0).length).toFixed(1)}%`, trend: "Across workflows", color: "text-[#4CAF82]" },
            { label: "Draft Workflows", value: workflows.filter(w => w.status === "draft").length, trend: "Pending deploy", color: "text-[#FFB547]" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="rounded-lg border border-border bg-card p-4"
            >
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className={`text-xs mt-1 ${stat.color}`}>{stat.trend}</p>
            </motion.div>
          ))}
        </div>

        {/* Workflow List */}
        <div className="space-y-4">
          {workflows.map((workflow, wfIndex) => {
            const isExpanded = expandedWorkflow === workflow.id
            const wfStatus = statusConfig[workflow.status]

            return (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + wfIndex * 0.08, duration: 0.3 }}
                className="rounded-lg border border-border bg-card overflow-hidden"
              >
                {/* Workflow Header */}
                <button
                  onClick={() => toggleWorkflow(workflow.id)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFE600]/10 shrink-0">
                    <Workflow className="h-5 w-5 text-[#FFE600]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-medium text-foreground">{workflow.name}</h3>
                      <Badge variant="outline" className={cn("text-[10px]", wfStatus.color)}>{wfStatus.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{workflow.description}</p>
                  </div>

                  {/* Step Preview */}
                  <div className="flex items-center gap-1 shrink-0">
                    {workflow.steps.map((step, i) => (
                      <div key={step.id} className="flex items-center">
                        <div className={cn("h-6 w-6 rounded-full flex items-center justify-center", stepTypeConfig[step.type].color + "/20")} title={step.name}>
                          {(() => { const I = stepTypeConfig[step.type].icon; return <I className={cn("h-3 w-3", step.type === "agent" ? "text-[#4CAF82]" : step.type === "skill" ? "text-[#FFE600]" : "text-[#47C2E1]")} /> })()}
                        </div>
                        {i < workflow.steps.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground/30 mx-0.5" />}
                      </div>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                    {workflow.runs > 0 && (
                      <>
                        <span>{workflow.runs} runs</span>
                        <span className="text-[#4CAF82]">{workflow.successRate}%</span>
                      </>
                    )}
                  </div>

                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </button>

                {/* Expanded Workflow Detail */}
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
                        {/* Flow Visualization */}
                        <div className="mb-6">
                          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Workflow Steps</h4>
                          <div className="flex items-stretch gap-0">
                            {workflow.steps.map((step, i) => {
                              const config = stepTypeConfig[step.type]
                              const StepIcon = config.icon
                              return (
                                <div key={step.id} className="flex items-stretch">
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex flex-col items-center w-44"
                                  >
                                    {/* Step Number + Type */}
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-[10px] text-muted-foreground font-mono">{String(i + 1).padStart(2, '0')}</span>
                                      <Badge variant="outline" className="text-[10px]">{config.label}</Badge>
                                    </div>

                                    {/* Step Card */}
                                    <div className={cn(
                                      "rounded-lg border p-3 w-full transition-all hover:border-[#FFE600]/40",
                                      "bg-card border-border"
                                    )}>
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className={cn("h-7 w-7 rounded-md flex items-center justify-center shrink-0", config.color + "/15")}>
                                          <StepIcon className={cn("h-3.5 w-3.5",
                                            step.type === "agent" ? "text-[#4CAF82]" :
                                            step.type === "skill" ? "text-[#FFE600]" :
                                            "text-[#47C2E1]"
                                          )} />
                                        </div>
                                        <p className="text-xs font-medium text-foreground truncate">{step.name}</p>
                                      </div>
                                      <p className="text-[10px] text-muted-foreground leading-relaxed">{step.description}</p>
                                    </div>
                                  </motion.div>

                                  {/* Arrow Connector */}
                                  {i < workflow.steps.length - 1 && (
                                    <div className="flex items-center px-1 pt-6">
                                      <div className="flex items-center">
                                        <div className="w-6 h-px bg-border" />
                                        <ArrowRight className="h-3 w-3 text-muted-foreground/50 -ml-1" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between border-t border-border pt-4">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Created {workflow.createdAt}</span>
                            <span>·</span>
                            <span>{workflow.steps.length} steps</span>
                            <span>·</span>
                            <span>{workflow.steps.filter(s => s.type === "agent").length} agents, {workflow.steps.filter(s => s.type === "mcp").length} MCPs, {workflow.steps.filter(s => s.type === "skill").length} skills</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 bg-transparent">
                              <Copy className="h-3 w-3" /> Clone
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 bg-transparent">
                              <Settings className="h-3 w-3" /> Configure
                            </Button>
                            {workflow.status === "draft" ? (
                              <Button size="sm" className="gap-1.5 text-xs h-8 bg-[#FFE600] text-[#1A1A24] hover:bg-[#FFE600]/90">
                                <Package className="h-3 w-3" /> Package & Deploy
                              </Button>
                            ) : (
                              <Button size="sm" className="gap-1.5 text-xs h-8 bg-[#4CAF82] text-white hover:bg-[#4CAF82]/90">
                                <Play className="h-3 w-3" /> Run Now
                              </Button>
                            )}
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

        {/* Resource Palette (slide-up panel) */}
        <AnimatePresence>
          {showPalette && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-60 right-0 z-50 border-t border-border bg-card shadow-2xl rounded-t-xl"
              style={{ maxHeight: "50vh" }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-foreground">Add to Workflow</h3>
                    <p className="text-xs text-muted-foreground">Select agents, skills, or MCPs to compose your workflow</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowPalette(false)}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* Palette Tabs */}
                <div className="flex gap-1 mb-4 rounded-lg border border-border p-1 w-fit">
                  {([
                    { id: "agents" as const, label: "Agents", icon: Bot, count: availableAgents.length },
                    { id: "skills" as const, label: "Skills", icon: Sparkles, count: availableSkills.length },
                    { id: "mcps" as const, label: "MCPs", icon: Server, count: availableMcps.length },
                  ]).map((tab) => {
                    const TabIcon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setPaletteTab(tab.id)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                          paletteTab === tab.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <TabIcon className="h-3.5 w-3.5" />
                        {tab.label}
                        <span className="text-muted-foreground ml-1">{tab.count}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Palette Grid */}
                <div className="grid grid-cols-4 gap-2 max-h-[25vh] overflow-y-auto">
                  {paletteTab === "agents" && availableAgents.map((agent) => (
                    <button key={agent.id} className="flex items-center gap-2 rounded-lg border border-border bg-background p-3 text-left hover:border-[#4CAF82]/40 transition-colors">
                      <div className="h-8 w-8 rounded-md bg-[#4CAF82]/10 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-[#4CAF82]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{agent.name}</p>
                        <p className="text-[10px] text-muted-foreground">{agent.department}</p>
                      </div>
                    </button>
                  ))}
                  {paletteTab === "skills" && availableSkills.map((skill) => (
                    <button key={skill.id} className="flex items-center gap-2 rounded-lg border border-border bg-background p-3 text-left hover:border-[#FFE600]/40 transition-colors">
                      <div className="h-8 w-8 rounded-md bg-[#FFE600]/10 flex items-center justify-center shrink-0">
                        <Sparkles className="h-4 w-4 text-[#FFE600]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{skill.name}</p>
                        <p className="text-[10px] text-muted-foreground">From {skill.mcpName}</p>
                      </div>
                    </button>
                  ))}
                  {paletteTab === "mcps" && availableMcps.map((mcp) => (
                    <button key={mcp.id} className="flex items-center gap-2 rounded-lg border border-border bg-background p-3 text-left hover:border-[#47C2E1]/40 transition-colors">
                      <div className="h-8 w-8 rounded-md bg-[#47C2E1]/10 flex items-center justify-center shrink-0">
                        <Server className="h-4 w-4 text-[#47C2E1]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{mcp.name}</p>
                        <p className="text-[10px] text-muted-foreground">{mcp.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  )
}
