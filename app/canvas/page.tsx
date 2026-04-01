"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Bot, Sparkles, Server, Workflow, Play, Package,
  CheckCircle2, Clock, Loader2, Eye, RotateCcw, Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AppShell } from "@/components/app-shell"
import { agentData, mcpServers } from "@/lib/data"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"

interface TestStep { label: string; status: "pending" | "running" | "success"; duration?: number }

const demoConfigs = [
  {
    id: "touchpoint", name: "Touch Point Agent",
    description: "Capture every customer interaction across email, calendar, and CRM using Semantic Search",
    agentId: "sales-rep-agent", testScenario: "Customer follow-up after a demo call",
    testSteps: [
      "🔍 Semantic Search: finding all Contoso Ltd interactions...",
      "Found 14 touchpoints across email, calendar, CRM",
      "📧 Work IQ Mail: checking latest email thread...",
      "Sentiment: positive — last reply 2 days ago",
      "📅 Work IQ Calendar: upcoming meeting tomorrow 2PM",
      "💬 Conversation Intelligence: extracting insights...",
      "Pricing concern detected, competitor mention (Acme)",
      "📝 Activity Logging: writing 4 touchpoints to D365...",
      "✓ All channels captured — no gaps detected",
    ],
  },
  {
    id: "hygiene", name: "Sales Hygiene Agent",
    description: "Audit pipeline quality using Semantic Search to cross-reference CRM with communications",
    agentId: "sales-manager-agent", testScenario: "Weekly pipeline hygiene audit",
    testSteps: [
      "🔍 Semantic Search: cross-referencing 47 opps with all data...",
      "Matched opportunities with 200+ emails and 80 meetings",
      "📊 Pipeline Management: 8 deals stale >30 days",
      "📈 Revenue Forecasting: $2.1M likely (was $2.4M)",
      "Agent decides: also check contact completeness...",
      "👤 Contact Enrichment: 12 opps missing primary email",
      "📣 Work IQ Teams: posting hygiene report...",
      "✓ 25 issues flagged, enriched by semantic context",
    ],
  },
  {
    id: "content", name: "Content Intelligence",
    description: "Semantic search across docs, emails, and channels to find, summarize, and curate content",
    agentId: "knowledge-worker-agent", testScenario: "Find Q1 product strategy content",
    testSteps: [
      "🔍 Semantic Search: 'Q1 product strategy' across 1,247 docs...",
      "34 results found (top: 94% relevance)",
      "📄 Document Insights: extracting themes from top 10...",
      "Key themes: pricing, EMEA expansion, partner program",
      "📧 Email Summarization: 8 related email threads found...",
      "Agent decides: compile briefing from all sources...",
      "📝 Summary: 3 key decisions, 5 action items",
      "✓ Content package ready — 34 docs, 10 summarized",
    ],
  },
  {
    id: "campaign", name: "Campaign Orchestrator",
    description: "Use Semantic Search to find past campaigns, then segment and personalize outreach",
    agentId: "lead-gen-agent", testScenario: "Launch Q1 enterprise upsell campaign",
    testSteps: [
      "🔍 Semantic Search: finding similar past campaigns...",
      "Best match: 'Q3 Enterprise Upsell' — 34% conversion",
      "📊 D365 Sales: loading 2,340 target contacts...",
      "💬 Conversation Intelligence: scoring engagement...",
      "340 high, 650 medium, 1,350 low engagement",
      "Agent decides: personalize high-engagement first...",
      "✏️ Contact Enrichment: enriched 312 profiles",
      "✓ Campaign ready: 340 contacts queued for launch",
    ],
  },
  {
    id: "deal-intel", name: "Deal Intelligence",
    description: "Semantic Search across all deal communications to surface risks and update forecasts",
    agentId: "sales-manager-agent", testScenario: "Risk analysis for top 5 deals",
    testSteps: [
      "🔍 Semantic Search: scanning 400+ deal communications...",
      "Cross-referenced emails, meetings, and CRM for 5 deals",
      "📅 Calendar: Contoso — no meeting in 21 days (was weekly)",
      "💬 Conversation Intelligence: sentiment declining...",
      "Risk: Contoso down, Fabrikam competitor mention",
      "📈 Revenue Forecasting: downgrading 2 deals...",
      "Pipeline: $2.6M on-track, $1.2M at-risk",
      "✓ Deal brief generated — 2 at-risk flagged",
    ],
  },
]

// ─── Dynamic Graph Component ─────────────────────────────
// Uses refs + layout effect to measure real DOM positions

function AgentGraph({ agent, skills, mcps }: {
  agent: typeof agentData[0]
  skills: typeof agentData[0]["skills"]
  mcps: typeof mcpServers
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const agentRef = useRef<HTMLDivElement>(null)
  const skillRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const mcpRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [lines, setLines] = useState<Array<{ x1: number; y1: number; x2: number; y2: number; color: string; dashed: boolean }>>([])

  const computeLines = useCallback(() => {
    const container = containerRef.current
    const agentEl = agentRef.current
    if (!container || !agentEl) return

    const cr = container.getBoundingClientRect()
    const ar = agentEl.getBoundingClientRect()
    const aCx = ar.left - cr.left + ar.width / 2
    const aCy = ar.top - cr.top + ar.height / 2

    const newLines: typeof lines = []

    // Skill → Agent (dashed yellow)
    skillRefs.current.forEach((el) => {
      const sr = el.getBoundingClientRect()
      newLines.push({
        x1: sr.right - cr.left,
        y1: sr.top - cr.top + sr.height / 2,
        x2: ar.left - cr.left,
        y2: aCy,
        color: "#FFE600",
        dashed: true,
      })
    })

    // Agent → MCP (solid teal)
    mcpRefs.current.forEach((el) => {
      const mr = el.getBoundingClientRect()
      newLines.push({
        x1: ar.right - cr.left,
        y1: aCy,
        x2: mr.left - cr.left,
        y2: mr.top - cr.top + mr.height / 2,
        color: "#47C2E1",
        dashed: false,
      })
    })

    setLines(newLines)
  }, [])

  useEffect(() => {
    // Compute after mount + small delay for animations to settle
    const t1 = setTimeout(computeLines, 100)
    const t2 = setTimeout(computeLines, 500)
    window.addEventListener("resize", computeLines)
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener("resize", computeLines) }
  }, [computeLines, skills, mcps])

  const setSkillRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) skillRefs.current.set(id, el)
    else skillRefs.current.delete(id)
  }, [])

  const setMcpRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) mcpRefs.current.set(id, el)
    else mcpRefs.current.delete(id)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* SVG layer for connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <defs>
          <linearGradient id="g-yellow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFE600" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFE600" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="g-teal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#47C2E1" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#47C2E1" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {lines.map((line, i) => {
          const mx = (line.x1 + line.x2) / 2
          const path = `M ${line.x1} ${line.y1} C ${mx} ${line.y1}, ${mx} ${line.y2}, ${line.x2} ${line.y2}`
          return (
            <g key={i}>
              <path d={path} fill="none"
                stroke={line.dashed ? "url(#g-yellow)" : "url(#g-teal)"}
                strokeWidth="2"
                strokeDasharray={line.dashed ? "6 4" : "none"}
              />
              {line.dashed && (
                <path d={path} fill="none" stroke={line.color} strokeWidth="2" strokeDasharray="6 4" opacity="0.15">
                  <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.5s" repeatCount="indefinite" />
                </path>
              )}
              <circle r="3" fill={line.color} opacity="0.6">
                <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite" path={path} />
              </circle>
            </g>
          )
        })}
      </svg>

      {/* 3-column flexbox layout — positions are automatic */}
      <div className="flex items-start justify-between gap-6 px-6 py-8 h-full">
        {/* Skills */}
        <div className="flex flex-col gap-2.5 w-[220px] shrink-0 pt-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#FFE600]" /> Skills ({skills.length})
          </p>
          {skills.map((skill, i) => (
            <motion.div
              key={skill.id}
              ref={setSkillRef(skill.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 250 }}
              whileHover={{ scale: 1.03, x: 4 }}
              className="rounded-lg border border-[#FFE600]/25 bg-[#FFE600]/5 p-3 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="h-5 w-5 rounded bg-[#FFE600]/15 flex items-center justify-center shrink-0">
                  <Sparkles className="h-3 w-3 text-[#FFE600]" />
                </div>
                <p className="text-[11px] font-medium text-foreground truncate">{skill.name}</p>
              </div>
              <p className="text-[9px] text-muted-foreground line-clamp-2">{skill.description}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className={cn("h-1.5 w-1.5 rounded-full", skill.isActive ? "bg-[#4CAF82]" : "bg-[#9898A0]")} />
                  <span className="text-[8px] text-muted-foreground">{skill.isActive ? "Active" : "Off"}</span>
                </div>
                <span className="text-[8px] text-[#47C2E1]">→ {skill.mcpName}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Agent Hub */}
        <div className="flex items-center justify-center flex-1 pt-12">
          <motion.div
            ref={agentRef}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 180, damping: 15 }}
            className="w-[230px] rounded-xl border-2 border-[#4CAF82]/40 bg-gradient-to-b from-[#4CAF82]/15 to-[#4CAF82]/5 p-5 text-center shadow-xl shadow-[#4CAF82]/10 backdrop-blur-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="flex justify-center mb-3"
            >
              <div className="h-16 w-16 rounded-full bg-[#4CAF82]/20 flex items-center justify-center ring-2 ring-[#4CAF82]/30">
                <Bot className="h-8 w-8 text-[#4CAF82]" />
              </div>
            </motion.div>
            <p className="text-sm font-bold text-foreground">{agent.name}</p>
            <p className="text-[10px] text-muted-foreground">{agent.department}</p>
            <div className="mt-2 flex justify-center gap-4 text-[10px]">
              <span className="text-[#FFE600] font-medium">{skills.length} skills</span>
              <span className="text-[#47C2E1] font-medium">{mcps.length} MCPs</span>
            </div>
            <div className="mt-3 pt-2 border-t border-[#4CAF82]/20 text-[9px] text-muted-foreground">
              Decides <strong className="text-[#FFE600]">which</strong> skills to invoke and <strong className="text-[#FFE600]">when</strong>
            </div>
          </motion.div>
        </div>

        {/* MCPs */}
        <div className="flex flex-col gap-2.5 w-[220px] shrink-0 pt-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
            <Server className="h-3 w-3 text-[#47C2E1]" /> MCP Tools ({mcps.length})
          </p>
          {mcps.map((mcp, i) => (
            <motion.div
              key={mcp.id}
              ref={setMcpRef(mcp.id)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06, type: "spring", stiffness: 250 }}
              whileHover={{ scale: 1.03, x: -4 }}
              className="rounded-lg border border-[#47C2E1]/25 bg-[#47C2E1]/5 p-3 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="h-5 w-5 rounded bg-[#47C2E1]/15 flex items-center justify-center shrink-0">
                  <Server className="h-3 w-3 text-[#47C2E1]" />
                </div>
                <p className="text-[11px] font-medium text-foreground truncate">{mcp.name}</p>
              </div>
              <p className="text-[9px] text-muted-foreground">{mcp.shortDescription}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {mcp.capabilities.slice(0, 2).map(c => (
                  <span key={c} className="text-[7px] bg-[#47C2E1]/10 text-[#47C2E1] px-1 py-0.5 rounded">{c}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-6 flex items-center gap-5 text-[9px] text-muted-foreground/50">
        <div className="flex items-center gap-1.5">
          <svg width="20" height="2"><line x1="0" y1="1" x2="20" y2="1" stroke="#FFE600" strokeWidth="2" strokeDasharray="4 3" opacity="0.5" /></svg>
          Agent → Skill (on demand)
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="20" height="2"><line x1="0" y1="1" x2="20" y2="1" stroke="#47C2E1" strokeWidth="2" opacity="0.5" /></svg>
          Agent → MCP Tool
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="6" height="6"><circle cx="3" cy="3" r="2.5" fill="#FFE600" opacity="0.7" /></svg>
          Data flow
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────

export default function OrchestrationPage() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null)
  const [testRunning, setTestRunning] = useState(false)
  const [testSteps, setTestSteps] = useState<TestStep[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const currentDemo = demoConfigs.find(d => d.id === selectedDemo)
  const currentAgent = currentDemo ? agentData.find(a => a.id === currentDemo.agentId) : null

  const agentGraph = useMemo(() => {
    if (!currentAgent) return null
    const skills = currentAgent.skills
    const mcpIds = [...new Set(skills.map(s => s.mcpId).concat(currentAgent.mcpConnections))]
    const mcps = mcpIds.map(id => mcpServers.find(m => m.id === id)).filter(Boolean) as typeof mcpServers
    return { agent: currentAgent, skills, mcps }
  }, [currentAgent])

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
      }, i * 800)
    })
    setTimeout(() => {
      setTestSteps(prev => prev.map(s => ({ ...s, status: "success", duration: s.duration || Math.floor(Math.random() * 500 + 80) })))
      setTestRunning(false)
    }, steps.length * 800)
  }

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden w-full">
        {/* Left Panel */}
        <div className="w-64 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Workflow className="h-4 w-4 text-[#FFE600]" /> Orchestration
            </h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Select a composition to explore</p>
          </div>
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="h-7 text-xs pl-7 bg-background border-border" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {demoConfigs.filter(d => !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase())).map(demo => (
              <button
                key={demo.id}
                onClick={() => { setSelectedDemo(demo.id); setTestSteps([]); setTestRunning(false) }}
                className={cn(
                  "w-full text-left rounded-lg border p-2.5 transition-all",
                  selectedDemo === demo.id ? "border-[#FFE600]/50 bg-[#FFE600]/5" : "border-border hover:border-[#FFE600]/30"
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

        {/* Center: Graph */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-10 border-b border-border bg-background flex items-center justify-between px-4 shrink-0">
            <span className="text-xs text-muted-foreground">{currentDemo?.name || "Select a composition"}</span>
            {currentDemo && (
              <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#FFE600] text-[#1A1A24] hover:bg-[#FFE600]/90"
                onClick={() => runTest(currentDemo.testSteps)} disabled={testRunning}>
                {testRunning ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                {testRunning ? "Running..." : `Test: "${currentDemo.testScenario}"`}
              </Button>
            )}
          </div>
          <div className="flex-1 bg-[#1A1A24] relative overflow-auto"
            style={{ backgroundImage: "radial-gradient(circle, #3B3B47 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
            {!agentGraph ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Workflow className="h-14 w-14 text-muted-foreground/15 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground/40">Select a composition</p>
                </div>
              </div>
            ) : (
              <AgentGraph agent={agentGraph.agent} skills={agentGraph.skills} mcps={agentGraph.mcps} />
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-72 border-l border-border bg-card flex flex-col shrink-0">
          {currentDemo && agentGraph ? (
            <>
              <div className="p-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">{currentDemo.name}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">{currentDemo.description}</p>
              </div>
              <div className="p-3 border-b border-border">
                <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">How it works</h4>
                <p className="text-[10px] text-foreground leading-relaxed">
                  The <strong className="text-[#4CAF82]">{agentGraph.agent.name}</strong> has{" "}
                  <strong className="text-[#FFE600]">{agentGraph.skills.length} skills</strong> and{" "}
                  <strong className="text-[#47C2E1]">{agentGraph.mcps.length} MCPs</strong>.
                  It <em>reasons</em> about which to invoke — not a fixed sequence.
                </p>
              </div>
              <div className="p-3 border-b border-border">
                <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Skills</h4>
                <div className="space-y-1">
                  {agentGraph.skills.map(s => (
                    <div key={s.id} className="flex items-center gap-2 text-[10px]">
                      <Sparkles className="h-3 w-3 text-[#FFE600] shrink-0" />
                      <span className="text-foreground truncate flex-1">{s.name}</span>
                      <span className="text-[8px] text-muted-foreground">{s.mcpName}</span>
                    </div>
                  ))}
                </div>
              </div>
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
                    <p className="text-[10px] text-muted-foreground">Click Test to simulate</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {testSteps.map((step, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                        className={cn("flex items-start gap-2 rounded px-2 py-1.5 text-[10px]",
                          step.status === "running" && "bg-[#FFE600]/5", step.status === "success" && "bg-[#4CAF82]/5")}>
                        <div className="mt-0.5 shrink-0">
                          {step.status === "pending" && <Clock className="h-3 w-3 text-muted-foreground/25" />}
                          {step.status === "running" && <Loader2 className="h-3 w-3 text-[#FFE600] animate-spin" />}
                          {step.status === "success" && <CheckCircle2 className="h-3 w-3 text-[#4CAF82]" />}
                        </div>
                        <p className={cn("flex-1 leading-relaxed",
                          step.status === "pending" ? "text-muted-foreground/30" :
                          step.status === "running" ? "text-[#FFE600]" : "text-foreground")}>{step.label}</p>
                        {step.duration && <span className="text-[8px] text-muted-foreground shrink-0">{step.duration}ms</span>}
                      </motion.div>
                    ))}
                  </div>
                )}
                {testSteps.length > 0 && !testRunning && testSteps.every(s => s.status === "success") && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                    <Button className="w-full gap-2 bg-[#FFE600] text-[#1A1A24] hover:bg-[#FFE600]/90 font-medium text-xs">
                      <Package className="h-3.5 w-3.5" /> Package & Deploy
                    </Button>
                    <p className="text-[9px] text-muted-foreground text-center mt-1">All tests passed</p>
                  </motion.div>
                )}
              </div>
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
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
