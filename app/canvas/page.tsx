"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Plus, Bot, Sparkles, Server, Workflow, X, Play, Package,
  ChevronDown, ChevronRight, CheckCircle2, Clock, Loader2,
  Zap, GripVertical, RotateCcw, Search, Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AppShell } from "@/components/app-shell"
import { agentData, mcpServers } from "@/lib/data"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"

// ─── The real model ──────────────────────────
// An Agent is the hub. It has Skills. Each Skill wraps an MCP.
// The agent invokes skills in any order — not a pipeline.
// This screen lets you: pick an agent, see its graph, add/remove
// skills, see which MCPs power them, and test the composition.

interface TestStep {
  label: string
  status: "pending" | "running" | "success"
  duration?: number
}

// Pre-configured agent compositions for demo
const demoConfigs = [
  {
    id: "touchpoint",
    name: "Touch Point Agent",
    description: "Configure a Sales Rep Agent to capture every customer interaction across email, calendar, and CRM",
    agentId: "sales-rep-agent",
    testScenario: "Customer follow-up after a demo call",
    testSteps: [
      "📧 Agent checks Work IQ Mail for recent thread with Contoso Ltd...",
      "Found 3 emails — last reply 2 days ago, sentiment: positive",
      "📅 Agent checks Work IQ Calendar for upcoming meetings...",
      "Meeting scheduled tomorrow at 2PM — 4 attendees",
      "💬 Agent runs Conversation Intelligence on email thread...",
      "Extracted: pricing concern, competitor mention (Acme), decision timeline Q1",
      "📝 Agent logs touchpoint to D365 Sales via Activity Logging...",
      "CRM updated: 3 emails, 1 upcoming meeting, 2 action items",
      "✓ Touchpoint capture complete — agent decides no further action needed",
    ],
  },
  {
    id: "hygiene",
    name: "Sales Hygiene Agent",
    description: "Configure a Sales Manager Agent to audit pipeline quality, flag issues, and post reports",
    agentId: "sales-manager-agent",
    testScenario: "Weekly pipeline hygiene audit",
    testSteps: [
      "📊 Agent reads pipeline from D365 Sales...",
      "Loaded 47 opportunities worth $4.2M total",
      "🔍 Agent runs Pipeline Management skill...",
      "Found: 8 deals stale >30 days, 3 with no next step",
      "📈 Agent runs Revenue Forecasting...",
      "Forecast: $2.1M likely (was $2.4M) — 3 deals downgraded",
      "Agent decides: also need contact completeness check...",
      "👤 Runs Contact Enrichment — 12 opps missing primary email",
      "📣 Posts hygiene report to Teams via Work IQ Teams...",
      "✓ Report sent: 25 issues across 47 opportunities",
    ],
  },
  {
    id: "content-search",
    name: "Content Intelligence",
    description: "Configure a Knowledge Worker Agent with semantic search to find, summarize, and curate content",
    agentId: "knowledge-worker-agent",
    testScenario: "Find all content about Q1 product strategy",
    testSteps: [
      "🔍 Agent calls Semantic Search MCP with query: 'Q1 product strategy'...",
      "Searched 1,247 documents across SharePoint and Teams",
      "Found 34 relevant results (top match: 94% relevance)",
      "📄 Agent runs Document Insights on top 10 results...",
      "Extracted key themes: pricing changes, EMEA expansion, partner program",
      "📧 Agent checks Work IQ Mail for related threads...",
      "Found 8 email threads discussing strategy decisions",
      "Agent decides: compile briefing from all sources...",
      "📝 Generates executive summary with 3 key decisions, 5 action items",
      "✓ Content package ready — 34 docs indexed, 10 summarized",
    ],
  },
  {
    id: "campaign",
    name: "Campaign Orchestrator",
    description: "Configure a Lead Gen Agent to plan and launch targeted campaigns using CRM and engagement data",
    agentId: "lead-gen-agent",
    testScenario: "Launch Q1 enterprise upsell campaign",
    testSteps: [
      "🔍 Agent calls Semantic Search for similar past campaigns...",
      "Best match: 'Q3 Enterprise Upsell' — 34% conversion rate",
      "📊 Agent reads D365 Sales for target accounts...",
      "2,340 contacts across 890 enterprise accounts",
      "💬 Agent runs Conversation Intelligence on recent engagements...",
      "Scoring: 340 high-engagement, 650 medium, 1,350 low",
      "Agent decides: personalize for high-engagement segment first...",
      "✏️ Runs Contact Enrichment on 340 high-priority contacts...",
      "Enriched 312 profiles with title, company size, last interaction",
      "✓ Campaign ready: 340 contacts personalized, queued for launch",
    ],
  },
  {
    id: "deal-intel",
    name: "Deal Intelligence",
    description: "Configure a Sales Manager Agent to surface deal risks by searching across all communication channels",
    agentId: "sales-manager-agent",
    testScenario: "Analyze risk for top 5 deals by value",
    testSteps: [
      "📊 Agent reads D365 Sales for top 5 opportunities by value...",
      "Total pipeline: $3.8M across 5 deals",
      "🔍 Agent calls Semantic Search across emails + meetings for each deal...",
      "Searched 400+ communications across all 5 accounts",
      "📅 Agent checks calendars for meeting frequency trend...",
      "Warning: Contoso — no meeting in 21 days (was weekly)",
      "💬 Agent runs Conversation Intelligence on all threads...",
      "Risk signals: Contoso sentiment declining, Fabrikam competitor mention",
      "📈 Agent updates forecast — downgrades 2 deals...",
      "✓ Deal brief: 2 at-risk ($1.2M), 3 on-track ($2.6M)",
    ],
  },
]

export default function OrchestrationPage() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null)
  const [testRunning, setTestRunning] = useState(false)
  const [testSteps, setTestSteps] = useState<TestStep[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const currentDemo = demoConfigs.find(d => d.id === selectedDemo)
  const currentAgent = currentDemo ? agentData.find(a => a.id === currentDemo.agentId) : null

  // Build the graph for the selected agent
  const agentGraph = useMemo(() => {
    if (!currentAgent) return null
    const skills = currentAgent.skills
    const mcpIds = [...new Set(skills.map(s => s.mcpId).concat(currentAgent.mcpConnections))]
    const mcps = mcpIds.map(id => mcpServers.find(m => m.id === id)).filter(Boolean)
    return { agent: currentAgent, skills, mcps: mcps as typeof mcpServers }
  }, [currentAgent])

  // Run test
  const runTest = (steps: string[]) => {
    setTestRunning(true)
    setTestSteps(steps.map(s => ({ label: s, status: "pending" as const })))
    steps.forEach((_, i) => {
      setTimeout(() => {
        setTestSteps(prev => prev.map((s, j) => ({
          ...s,
          status: j < i ? "success" : j === i ? "running" : "pending",
          duration: j < i ? Math.floor(Math.random() * 500 + 80) : undefined,
        })))
      }, i * 900)
    })
    setTimeout(() => {
      setTestSteps(prev => prev.map(s => ({ ...s, status: "success", duration: s.duration || Math.floor(Math.random() * 500 + 80) })))
      setTestRunning(false)
    }, steps.length * 900)
  }

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden w-full">
        {/* Left: Demo Picker + Agent Palette */}
        <div className="w-72 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Workflow className="h-4 w-4 text-[#FFE600]" />
              Orchestration
            </h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Select a composition — see how the agent uses skills and MCPs
            </p>
          </div>

          {/* Search */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search compositions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-7 text-xs pl-7 bg-background border-border"
              />
            </div>
          </div>

          {/* Demo list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {demoConfigs
              .filter(d => !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(demo => (
              <button
                key={demo.id}
                onClick={() => { setSelectedDemo(demo.id); setTestSteps([]); setTestRunning(false) }}
                className={cn(
                  "w-full text-left rounded-md border p-2.5 transition-all",
                  selectedDemo === demo.id
                    ? "border-[#FFE600]/50 bg-[#FFE600]/5"
                    : "border-border hover:border-[#FFE600]/30"
                )}
              >
                <p className="text-xs font-medium text-foreground">{demo.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{demo.description}</p>
                <div className="mt-1.5 flex items-center gap-1 text-[9px] text-muted-foreground">
                  <Bot className="h-3 w-3 text-[#4CAF82]" />
                  {agentData.find(a => a.id === demo.agentId)?.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Agent Graph Visualization */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="h-10 border-b border-border bg-background flex items-center justify-between px-4 shrink-0">
            <span className="text-xs text-muted-foreground">
              {currentDemo ? currentDemo.name : "Select a composition"}
            </span>
            {currentDemo && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="h-7 text-[10px] gap-1 bg-[#FFE600] text-[#1A1A24] hover:bg-[#FFE600]/90"
                  onClick={() => runTest(currentDemo.testSteps)}
                  disabled={testRunning}
                >
                  {testRunning ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                  {testRunning ? "Running..." : `Test: "${currentDemo.testScenario}"`}
                </Button>
              </div>
            )}
          </div>

          {/* Graph Area */}
          <div className="flex-1 overflow-auto bg-[#1A1A24] relative"
            style={{ backgroundImage: "radial-gradient(circle, #3B3B47 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          >
            {!agentGraph ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Workflow className="h-14 w-14 text-muted-foreground/15 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground/40">Select a composition from the left</p>
                  <p className="text-xs text-muted-foreground/30 mt-1">The agent graph will appear here</p>
                </div>
              </div>
            ) : (
              <div className="relative p-8" style={{ minWidth: 900, minHeight: 500 }}>
                {/* SVG connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                  {/* Agent → Skill connections */}
                  {agentGraph.skills.map((skill, i) => {
                    const agentX = 400, agentY = 220
                    const skillX = 100, skillY = 60 + i * 90
                    const mx = (agentX + skillX) / 2
                    return (
                      <path
                        key={`a-s-${skill.id}`}
                        d={`M ${agentX + 32} ${agentY + 40} C ${mx + 32} ${agentY + 40}, ${mx + 32} ${skillY + 24}, ${skillX + 200} ${skillY + 24}`}
                        fill="none" stroke="#FFE600" strokeWidth="1.5" opacity="0.3"
                        strokeDasharray="4 4"
                      />
                    )
                  })}
                  {/* Skill → MCP connections */}
                  {agentGraph.skills.map((skill, i) => {
                    const skillX = 100, skillY = 60 + i * 90
                    const mcp = agentGraph.mcps.find(m => m.id === skill.mcpId)
                    if (!mcp) return null
                    const mcpIdx = agentGraph.mcps.indexOf(mcp)
                    const mcpX = 700, mcpY = 60 + mcpIdx * 100
                    return (
                      <path
                        key={`s-m-${skill.id}`}
                        d={`M ${skillX + 32} ${skillY + 24} C ${skillX - 30} ${skillY + 24}, ${mcpX + 250} ${mcpY + 28}, ${mcpX + 32} ${mcpY + 28}`}
                        fill="none" stroke="#47C2E1" strokeWidth="1.5" opacity="0.25"
                      />
                    )
                  })}
                </svg>

                {/* Skills Column (Left) */}
                <div className="absolute" style={{ left: 40, top: 40, zIndex: 2 }}>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-[#FFE600]" /> Skills
                  </p>
                  <div className="space-y-3">
                    {agentGraph.skills.map((skill, i) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="w-48 rounded-md border border-[#FFE600]/20 bg-[#FFE600]/5 p-2.5"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="h-3.5 w-3.5 text-[#FFE600] shrink-0" />
                          <p className="text-[11px] font-medium text-foreground truncate">{skill.name}</p>
                        </div>
                        <p className="text-[9px] text-muted-foreground">{skill.description}</p>
                        <div className="mt-1.5 flex items-center gap-1">
                          <div className={cn("h-1.5 w-1.5 rounded-full", skill.isActive ? "bg-[#4CAF82]" : "bg-[#9898A0]")} />
                          <span className="text-[8px] text-muted-foreground">{skill.isActive ? "Active" : "Inactive"}</span>
                          <span className="text-[8px] text-muted-foreground ml-auto">→ {skill.mcpName}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Agent Hub (Center) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="absolute"
                  style={{ left: 340, top: 160, zIndex: 3 }}
                >
                  <div className="w-52 rounded-lg border-2 border-[#4CAF82]/40 bg-[#4CAF82]/10 p-4 text-center shadow-lg shadow-[#4CAF82]/5">
                    <div className="flex justify-center mb-2">
                      <div className="h-14 w-14 rounded-full bg-[#4CAF82]/20 flex items-center justify-center ring-2 ring-[#4CAF82]/30">
                        <Bot className="h-7 w-7 text-[#4CAF82]" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{agentGraph.agent.name}</p>
                    <p className="text-[10px] text-muted-foreground">{agentGraph.agent.department}</p>
                    <div className="mt-2 flex justify-center gap-3 text-[9px]">
                      <span className="text-[#FFE600]">{agentGraph.skills.length} skills</span>
                      <span className="text-[#47C2E1]">{agentGraph.mcps.length} MCPs</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#4CAF82]/20 text-[9px] text-muted-foreground">
                      Agent reasons about <strong className="text-foreground">when</strong> to use each skill
                    </div>
                  </div>
                </motion.div>

                {/* MCPs Column (Right) */}
                <div className="absolute" style={{ left: 660, top: 40, zIndex: 2 }}>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
                    <Server className="h-3 w-3 text-[#47C2E1]" /> MCP Tools
                  </p>
                  <div className="space-y-3">
                    {agentGraph.mcps.map((mcp, i) => (
                      <motion.div
                        key={mcp.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        className="w-48 rounded-md border border-[#47C2E1]/20 bg-[#47C2E1]/5 p-2.5"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Server className="h-3.5 w-3.5 text-[#47C2E1] shrink-0" />
                          <p className="text-[11px] font-medium text-foreground truncate">{mcp.name}</p>
                        </div>
                        <p className="text-[9px] text-muted-foreground">{mcp.shortDescription}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {mcp.capabilities.slice(0, 2).map(c => (
                            <span key={c} className="text-[8px] bg-[#47C2E1]/10 text-[#47C2E1] px-1 py-0.5 rounded">{c}</span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-8 flex items-center gap-4 text-[9px] text-muted-foreground" style={{ zIndex: 5 }}>
                  <div className="flex items-center gap-1"><div className="w-6 h-px bg-[#FFE600] opacity-50" style={{ borderTop: "1.5px dashed #FFE600" }} /> Agent invokes skill (any order)</div>
                  <div className="flex items-center gap-1"><div className="w-6 h-px bg-[#47C2E1] opacity-40" /> Skill uses MCP tool</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Test Runner + Details */}
        <div className="w-72 border-l border-border bg-card flex flex-col shrink-0">
          {currentDemo && agentGraph ? (
            <>
              <div className="p-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">{currentDemo.name}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">{currentDemo.description}</p>
              </div>

              {/* Composition */}
              <div className="p-3 border-b border-border">
                <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">How it works</h4>
                <p className="text-[10px] text-foreground leading-relaxed">
                  The <strong className="text-[#4CAF82]">{agentGraph.agent.name}</strong> has{" "}
                  <strong className="text-[#FFE600]">{agentGraph.skills.length} skills</strong> connected to{" "}
                  <strong className="text-[#47C2E1]">{agentGraph.mcps.length} MCPs</strong>.
                  When given a task, the agent <em>reasons</em> about which skills to invoke, in what order,
                  and may call the same skill multiple times or skip skills entirely.
                </p>
              </div>

              {/* Skills List */}
              <div className="p-3 border-b border-border">
                <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Available Skills</h4>
                <div className="space-y-1">
                  {agentGraph.skills.map(skill => (
                    <div key={skill.id} className="flex items-center gap-2 text-[10px]">
                      <Sparkles className="h-3 w-3 text-[#FFE600] shrink-0" />
                      <span className="text-foreground truncate flex-1">{skill.name}</span>
                      <span className="text-muted-foreground text-[8px]">{skill.mcpName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Runner */}
              <div className="flex-1 overflow-y-auto p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Test: {currentDemo.testScenario}
                  </h4>
                  {testSteps.length > 0 && !testRunning && (
                    <Button variant="ghost" size="sm" className="h-5 text-[9px] px-1" onClick={() => runTest(currentDemo.testSteps)}>
                      <RotateCcw className="h-2.5 w-2.5 mr-0.5" /> Rerun
                    </Button>
                  )}
                </div>

                {testSteps.length === 0 ? (
                  <div className="text-center py-8">
                    <Play className="h-8 w-8 text-muted-foreground/15 mx-auto mb-2" />
                    <p className="text-[10px] text-muted-foreground">Click "Test" to simulate</p>
                    <p className="text-[9px] text-muted-foreground/60 mt-1">Watch the agent reason and invoke skills</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {testSteps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={cn(
                          "flex items-start gap-2 rounded px-2 py-1.5 text-[10px]",
                          step.status === "running" && "bg-[#FFE600]/5",
                          step.status === "success" && "bg-[#4CAF82]/5",
                        )}
                      >
                        <div className="mt-0.5 shrink-0">
                          {step.status === "pending" && <Clock className="h-3 w-3 text-muted-foreground/25" />}
                          {step.status === "running" && <Loader2 className="h-3 w-3 text-[#FFE600] animate-spin" />}
                          {step.status === "success" && <CheckCircle2 className="h-3 w-3 text-[#4CAF82]" />}
                        </div>
                        <p className={cn(
                          "flex-1 leading-relaxed",
                          step.status === "pending" ? "text-muted-foreground/30" :
                          step.status === "running" ? "text-[#FFE600]" : "text-foreground"
                        )}>{step.label}</p>
                        {step.duration && <span className="text-[8px] text-muted-foreground shrink-0">{step.duration}ms</span>}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Package button after test passes */}
                {testSteps.length > 0 && !testRunning && testSteps.every(s => s.status === "success") && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                    <Button className="w-full gap-2 bg-[#FFE600] text-[#1A1A24] hover:bg-[#FFE600]/90 font-medium text-xs">
                      <Package className="h-3.5 w-3.5" /> Package & Deploy
                    </Button>
                    <p className="text-[9px] text-muted-foreground text-center mt-1">All tests passed — ready for governance</p>
                  </motion.div>
                )}
              </div>

              {/* Agent Link */}
              <div className="p-3 border-t border-border">
                <Link href={`/agents/${currentDemo.agentId}`}>
                  <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs h-7 bg-transparent">
                    <Eye className="h-3 w-3" /> View Agent Details
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <Package className="h-10 w-10 text-muted-foreground/15 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Select a composition</p>
                <p className="text-[9px] text-muted-foreground/60 mt-1">See the agent graph and run tests</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
