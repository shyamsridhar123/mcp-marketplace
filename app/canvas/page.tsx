"use client"

import { useState, useRef, useCallback } from "react"
import {
  Plus,
  Play,
  Package,
  Bot,
  Sparkles,
  Server,
  Workflow,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
  GripVertical,
  X,
  ChevronRight,
  Loader2,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AppShell } from "@/components/app-shell"
import { agentData, mcpServers } from "@/lib/data"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"

// ─── Types ───────────────────────────────────────────────────

interface CanvasItem {
  id: string
  instanceId: string
  type: "agent" | "skill" | "mcp"
  name: string
  description: string
  category?: string
  x: number
  y: number
}

interface Connection {
  fromId: string
  toId: string
}

interface TestStep {
  label: string
  status: "pending" | "running" | "success" | "error"
  duration?: number
}

interface PackageTemplate {
  id: string
  name: string
  description: string
  items: Omit<CanvasItem, "instanceId">[]
  connections: { fromIdx: number; toIdx: number }[]
  testSteps: string[]
}

// ─── Pre-built Demo Packages ─────────────────────────────────

const demoPackages: PackageTemplate[] = [
  {
    id: "touchpoint-agent",
    name: "Touch Point Agent",
    description: "Track every customer interaction — calls, emails, meetings — and auto-log them to CRM with sentiment and action items",
    items: [
      { id: "workiq-mail-mcp", type: "mcp", name: "Work IQ Mail", description: "Capture email interactions", x: 60, y: 40 },
      { id: "workiq-calendar-mcp", type: "mcp", name: "Work IQ Calendar", description: "Capture meeting touchpoints", x: 60, y: 180 },
      { id: "s21", type: "skill", name: "Conversation Intelligence", description: "Analyze sentiment & extract action items", x: 340, y: 40 },
      { id: "s20", type: "skill", name: "Meeting-to-CRM Sync", description: "Map meeting outcomes to CRM", x: 340, y: 180 },
      { id: "s19", type: "skill", name: "Activity Logging", description: "Log all touchpoints to timeline", x: 340, y: 320 },
      { id: "sales-rep-agent", type: "agent", name: "Sales Rep Agent", description: "Orchestrate touchpoint capture", x: 620, y: 140 },
      { id: "d365-sales-core", type: "mcp", name: "D365 Sales", description: "Write to CRM", x: 900, y: 140 },
    ],
    connections: [
      { fromIdx: 0, toIdx: 2 }, { fromIdx: 1, toIdx: 3 },
      { fromIdx: 2, toIdx: 5 }, { fromIdx: 3, toIdx: 5 }, { fromIdx: 4, toIdx: 5 },
      { fromIdx: 5, toIdx: 6 },
    ],
    testSteps: [
      "Connecting to Work IQ Mail...",
      "Scanning 3 recent customer emails...",
      "Extracting sentiment: Positive (2), Neutral (1)",
      "Connecting to Work IQ Calendar...",
      "Found 1 customer meeting with Contoso Ltd",
      "Extracting action items: 2 follow-ups identified",
      "Sales Rep Agent processing touchpoints...",
      "Logging 4 touchpoints to D365 Sales...",
      "✓ All touchpoints synced to CRM timeline",
    ],
  },
  {
    id: "sales-hygiene-agent",
    name: "Sales Hygiene Agent",
    description: "Audit CRM data quality — flag stale opportunities, missing contacts, incomplete fields, and duplicate records",
    items: [
      { id: "d365-sales-core", type: "mcp", name: "D365 Sales", description: "Read pipeline data", x: 60, y: 100 },
      { id: "d365-sales-insights", type: "mcp", name: "D365 Sales Insights", description: "Velocity & win rate data", x: 60, y: 260 },
      { id: "s18", type: "skill", name: "Pipeline Management", description: "Analyze deal stages & staleness", x: 340, y: 60 },
      { id: "s24", type: "skill", name: "Contact Enrichment", description: "Detect missing contact data", x: 340, y: 200 },
      { id: "s22", type: "skill", name: "Revenue Forecasting", description: "Flag unrealistic forecasts", x: 340, y: 340 },
      { id: "sales-manager-agent", type: "agent", name: "Sales Manager Agent", description: "Generate hygiene report", x: 620, y: 180 },
      { id: "workiq-teams-mcp", type: "mcp", name: "Work IQ Teams", description: "Post report to channel", x: 900, y: 180 },
    ],
    connections: [
      { fromIdx: 0, toIdx: 2 }, { fromIdx: 0, toIdx: 3 }, { fromIdx: 1, toIdx: 4 },
      { fromIdx: 2, toIdx: 5 }, { fromIdx: 3, toIdx: 5 }, { fromIdx: 4, toIdx: 5 },
      { fromIdx: 5, toIdx: 6 },
    ],
    testSteps: [
      "Connecting to D365 Sales...",
      "Scanning 47 open opportunities...",
      "Pipeline check: 8 deals stale >30 days",
      "Contact check: 12 opportunities missing primary contact email",
      "Connecting to D365 Sales Insights...",
      "Forecast check: 3 deals with >$100K flagged as unlikely",
      "Duplicate check: 2 potential duplicate accounts found",
      "Sales Manager Agent compiling report...",
      "Posting hygiene report to #sales-ops channel...",
      "✓ Report delivered: 25 issues flagged across 47 opportunities",
    ],
  },
  {
    id: "lead-qualification",
    name: "Lead Qualification Engine",
    description: "Score inbound leads from email engagement, enrich profiles, and auto-route qualified leads to sales reps",
    items: [
      { id: "workiq-mail-mcp", type: "mcp", name: "Work IQ Mail", description: "Track email engagement", x: 60, y: 100 },
      { id: "d365-copilot-sales", type: "mcp", name: "D365 Copilot for Sales", description: "Conversation analysis", x: 60, y: 260 },
      { id: "s24", type: "skill", name: "Contact Enrichment", description: "Enrich lead profiles", x: 340, y: 100 },
      { id: "s21", type: "skill", name: "Conversation Intelligence", description: "Score engagement signals", x: 340, y: 260 },
      { id: "lead-gen-agent", type: "agent", name: "Lead Gen Agent", description: "Qualify and route leads", x: 620, y: 180 },
      { id: "d365-sales-core", type: "mcp", name: "D365 Sales", description: "Create qualified leads in CRM", x: 900, y: 180 },
    ],
    connections: [
      { fromIdx: 0, toIdx: 2 }, { fromIdx: 1, toIdx: 3 },
      { fromIdx: 2, toIdx: 4 }, { fromIdx: 3, toIdx: 4 },
      { fromIdx: 4, toIdx: 5 },
    ],
    testSteps: [
      "Connecting to Work IQ Mail...",
      "Analyzing 15 inbound email threads...",
      "Enriching 8 new contact profiles...",
      "Connecting to D365 Copilot for Sales...",
      "Scoring engagement: 3 hot leads, 5 warm, 7 cold",
      "Lead Gen Agent qualifying leads...",
      "Routing 3 qualified leads to sales reps...",
      "Creating lead records in D365 Sales...",
      "✓ 3 qualified leads created, 5 in nurture queue",
    ],
  },
  {
    id: "content-hub",
    name: "Content Management Hub",
    description: "Semantic search across SharePoint docs, auto-tag content, generate summaries, and publish to internal knowledge base",
    items: [
      { id: "workiq-sharepoint-mcp", type: "mcp", name: "Work IQ SharePoint", description: "Semantic search across docs", x: 60, y: 60 },
      { id: "workiq-teams-mcp", type: "mcp", name: "Work IQ Teams", description: "Search team channel content", x: 60, y: 200 },
      { id: "semantic-search-mcp", type: "mcp", name: "Semantic Search", description: "Vector-based content discovery", x: 340, y: 60 },
      { id: "content-tag", type: "skill", name: "Auto-Tagging", description: "Classify and tag content", x: 340, y: 200 },
      { id: "content-summary", type: "skill", name: "Content Summarization", description: "Generate executive summaries", x: 340, y: 340 },
      { id: "knowledge-worker-agent", type: "agent", name: "Knowledge Worker Agent", description: "Curate and publish content", x: 620, y: 180 },
      { id: "mongodb-mcp", type: "mcp", name: "MongoDB Atlas", description: "Store in knowledge base", x: 900, y: 180 },
    ],
    connections: [
      { fromIdx: 0, toIdx: 2 }, { fromIdx: 1, toIdx: 2 },
      { fromIdx: 2, toIdx: 5 }, { fromIdx: 3, toIdx: 5 }, { fromIdx: 4, toIdx: 5 },
      { fromIdx: 5, toIdx: 6 },
    ],
    testSteps: [
      "Semantic search across 1,247 SharePoint documents...",
      "Indexing Teams channel content from 8 workspaces...",
      "Found 34 relevant documents matching 'Q1 strategy'",
      "Auto-tagging: Strategy (12), Finance (9), Operations (8), Other (5)",
      "Generating executive summaries for top 10 documents...",
      "Knowledge Worker Agent curating content package...",
      "Publishing to internal knowledge base...",
      "✓ Knowledge base updated: 34 docs indexed, 10 summaries generated",
    ],
  },
  {
    id: "campaign-orchestrator",
    name: "Marketing Campaign Orchestrator",
    description: "Plan campaigns using CRM data, segment audiences, generate personalized outreach, and track engagement across channels",
    items: [
      { id: "d365-sales-core", type: "mcp", name: "D365 Sales", description: "Customer segments & history", x: 60, y: 40 },
      { id: "d365-copilot-sales", type: "mcp", name: "D365 Copilot for Sales", description: "Engagement analytics", x: 60, y: 180 },
      { id: "workiq-mail-mcp", type: "mcp", name: "Work IQ Mail", description: "Email campaign delivery", x: 60, y: 320 },
      { id: "semantic-search-mcp", type: "mcp", name: "Semantic Search", description: "Find similar past campaigns", x: 340, y: 40 },
      { id: "audience-seg", type: "skill", name: "Audience Segmentation", description: "AI-powered customer segments", x: 340, y: 180 },
      { id: "personalization", type: "skill", name: "Content Personalization", description: "Tailor messaging per segment", x: 340, y: 320 },
      { id: "lead-gen-agent", type: "agent", name: "Lead Gen Agent", description: "Execute campaign workflow", x: 620, y: 180 },
      { id: "workiq-teams-mcp", type: "mcp", name: "Work IQ Teams", description: "Report results to marketing", x: 900, y: 180 },
    ],
    connections: [
      { fromIdx: 0, toIdx: 3 }, { fromIdx: 0, toIdx: 4 }, { fromIdx: 1, toIdx: 4 },
      { fromIdx: 2, toIdx: 5 }, { fromIdx: 3, toIdx: 6 }, { fromIdx: 4, toIdx: 6 },
      { fromIdx: 5, toIdx: 6 }, { fromIdx: 6, toIdx: 7 },
    ],
    testSteps: [
      "Semantic search: finding 5 similar past campaigns...",
      "Best match: 'Q3 Enterprise Upsell' (87% relevance, 34% conversion)",
      "Connecting to D365 Sales for customer data...",
      "Segmenting 2,340 contacts into 4 audiences...",
      "Enterprise Decision Makers (890), Mid-Market (650), SMB (540), Partners (260)",
      "Generating personalized email variants per segment...",
      "Lead Gen Agent scheduling campaign waves...",
      "Wave 1: 890 Enterprise emails queued via Work IQ Mail",
      "Posting campaign launch summary to #marketing channel...",
      "✓ Campaign 'Q1 Growth Sprint' launched: 2,340 contacts across 4 segments",
    ],
  },
  {
    id: "deal-intelligence",
    name: "Deal Intelligence Dashboard",
    description: "Semantic search across all deal-related communications, surface risks, generate deal summaries, and update forecasts",
    items: [
      { id: "workiq-mail-mcp", type: "mcp", name: "Work IQ Mail", description: "Search deal emails", x: 60, y: 60 },
      { id: "workiq-calendar-mcp", type: "mcp", name: "Work IQ Calendar", description: "Review meeting history", x: 60, y: 200 },
      { id: "d365-sales-core", type: "mcp", name: "D365 Sales", description: "Pipeline & opportunity data", x: 60, y: 340 },
      { id: "semantic-search-mcp", type: "mcp", name: "Semantic Search", description: "Cross-source deal intelligence", x: 340, y: 60 },
      { id: "s21", type: "skill", name: "Conversation Intelligence", description: "Sentiment & risk signals", x: 340, y: 200 },
      { id: "s22", type: "skill", name: "Revenue Forecasting", description: "Predict deal outcomes", x: 340, y: 340 },
      { id: "sales-manager-agent", type: "agent", name: "Sales Manager Agent", description: "Generate deal intelligence brief", x: 620, y: 200 },
      { id: "d365-sales-insights", type: "mcp", name: "D365 Sales Insights", description: "Update forecast models", x: 900, y: 200 },
    ],
    connections: [
      { fromIdx: 0, toIdx: 3 }, { fromIdx: 1, toIdx: 3 }, { fromIdx: 2, toIdx: 3 },
      { fromIdx: 3, toIdx: 6 }, { fromIdx: 4, toIdx: 6 }, { fromIdx: 5, toIdx: 6 },
      { fromIdx: 6, toIdx: 7 },
    ],
    testSteps: [
      "Semantic search across 847 deal-related emails...",
      "Cross-referencing 23 customer meetings from calendar...",
      "Pulling pipeline data for 12 active opportunities >$50K...",
      "Deal risk analysis: 3 deals showing declining engagement",
      "Conversation sentiment: Contoso Ltd trending negative (-12%)",
      "Revenue forecast update: Q1 likely $2.1M (was $2.4M)",
      "Sales Manager Agent generating weekly deal brief...",
      "Updating D365 Sales Insights forecast model...",
      "✓ Deal Intelligence Brief: 12 deals analyzed, 3 at-risk, forecast adjusted",
    ],
  },
  {
    id: "competitive-intel",
    name: "Competitive Intelligence Engine",
    description: "Semantic search across emails, docs, and meeting notes to surface competitive mentions, then brief the sales team",
    items: [
      { id: "workiq-mail-mcp", type: "mcp", name: "Work IQ Mail", description: "Scan for competitor mentions", x: 60, y: 80 },
      { id: "workiq-sharepoint-mcp", type: "mcp", name: "Work IQ SharePoint", description: "Search battle cards & docs", x: 60, y: 240 },
      { id: "semantic-search-mcp", type: "mcp", name: "Semantic Search", description: "Find competitive signals", x: 340, y: 80 },
      { id: "ci-analysis", type: "skill", name: "Competitive Analysis", description: "Compare positioning & pricing", x: 340, y: 240 },
      { id: "knowledge-worker-agent", type: "agent", name: "Knowledge Worker Agent", description: "Compile competitive brief", x: 620, y: 160 },
      { id: "workiq-teams-mcp", type: "mcp", name: "Work IQ Teams", description: "Distribute to sales team", x: 900, y: 160 },
    ],
    connections: [
      { fromIdx: 0, toIdx: 2 }, { fromIdx: 1, toIdx: 2 },
      { fromIdx: 2, toIdx: 4 }, { fromIdx: 3, toIdx: 4 },
      { fromIdx: 4, toIdx: 5 },
    ],
    testSteps: [
      "Semantic search: scanning 2,100 emails for competitor mentions...",
      "Found 47 mentions across 3 competitors: Acme (23), Rival Inc (15), CompX (9)",
      "Searching SharePoint for latest battle cards...",
      "Found 8 competitive docs, 3 updated in last 30 days",
      "Analyzing pricing: Acme 15% lower on enterprise tier",
      "Win/loss insight: lost 3 deals to Acme in EMEA last quarter",
      "Knowledge Worker Agent compiling weekly competitive brief...",
      "Posting to #competitive-intel Teams channel...",
      "✓ Competitive Brief: 3 competitors tracked, 47 mentions, 2 action items",
    ],
  },
]

// ─── Color configs ───────────────────────────────────────────

const typeConfig = {
  agent: { color: "#4CAF82", bg: "bg-[#4CAF82]/10", border: "border-[#4CAF82]/30", icon: Bot, label: "Agent" },
  skill: { color: "#FFE600", bg: "bg-[#FFE600]/10", border: "border-[#FFE600]/30", icon: Sparkles, label: "Skill" },
  mcp: { color: "#47C2E1", bg: "bg-[#47C2E1]/10", border: "border-[#47C2E1]/30", icon: Server, label: "MCP" },
}

// ─── Component ───────────────────────────────────────────────

export default function OrchestrationPage() {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [connectMode, setConnectMode] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [testRunning, setTestRunning] = useState(false)
  const [testSteps, setTestSteps] = useState<TestStep[]>([])
  const [paletteTab, setPaletteTab] = useState<"demos" | "agents" | "skills" | "mcps">("demos")
  const canvasRef = useRef<HTMLDivElement>(null)
  const [dragItem, setDragItem] = useState<{ type: "agent" | "skill" | "mcp"; id: string; name: string; description: string; category?: string } | null>(null)

  // Load a demo package
  const loadDemo = (pkg: PackageTemplate) => {
    const items: CanvasItem[] = pkg.items.map((item, i) => ({
      ...item,
      instanceId: `${item.id}-${Date.now()}-${i}`,
    }))
    const conns: Connection[] = pkg.connections.map(c => ({
      fromId: items[c.fromIdx].instanceId,
      toId: items[c.toIdx].instanceId,
    }))
    setCanvasItems(items)
    setConnections(conns)
    setSelectedPackage(pkg.id)
    setTestSteps([])
    setTestRunning(false)
    setConnectMode(null)
    setSelectedItem(null)
  }

  // Run test simulation
  const runTest = (steps: string[]) => {
    setTestRunning(true)
    const testData: TestStep[] = steps.map(s => ({ label: s, status: "pending" as const }))
    setTestSteps(testData)

    steps.forEach((_, i) => {
      setTimeout(() => {
        setTestSteps(prev => prev.map((s, j) => ({
          ...s,
          status: j < i ? "success" : j === i ? "running" : "pending",
          duration: j < i ? Math.floor(Math.random() * 400 + 100) : undefined,
        })))
      }, i * 800)
    })
    setTimeout(() => {
      setTestSteps(prev => prev.map(s => ({
        ...s,
        status: "success",
        duration: s.duration || Math.floor(Math.random() * 400 + 100),
      })))
      setTestRunning(false)
    }, steps.length * 800)
  }

  // Handle palette drag
  const handlePaletteDragStart = (item: typeof dragItem) => (e: React.DragEvent) => {
    setDragItem(item)
    e.dataTransfer.effectAllowed = "copy"
  }

  // Handle canvas drop
  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!dragItem || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - 70
    const y = e.clientY - rect.top - 30
    const newItem: CanvasItem = {
      ...dragItem,
      instanceId: `${dragItem.id}-${Date.now()}`,
      x: Math.max(0, x),
      y: Math.max(0, y),
    }
    setCanvasItems(prev => [...prev, newItem])
    setDragItem(null)
  }

  // Handle connecting items
  const handleItemClick = (instanceId: string) => {
    if (connectMode) {
      if (connectMode !== instanceId) {
        setConnections(prev => [...prev, { fromId: connectMode, toId: instanceId }])
      }
      setConnectMode(null)
    } else {
      setSelectedItem(instanceId === selectedItem ? null : instanceId)
    }
  }

  const removeItem = (instanceId: string) => {
    setCanvasItems(prev => prev.filter(i => i.instanceId !== instanceId))
    setConnections(prev => prev.filter(c => c.fromId !== instanceId && c.toId !== instanceId))
    if (selectedItem === instanceId) setSelectedItem(null)
  }

  const clearCanvas = () => {
    setCanvasItems([])
    setConnections([])
    setSelectedPackage(null)
    setTestSteps([])
    setConnectMode(null)
    setSelectedItem(null)
  }

  const currentPkg = demoPackages.find(p => p.id === selectedPackage)

  // Available palette items
  const paletteAgents = agentData.filter(a => a.status === "active").slice(0, 6)
  const paletteMcps = mcpServers.filter(m => m.isInstalled).slice(0, 8)
  const paletteSkills = agentData.flatMap(a => a.skills.filter(s => s.isActive)).slice(0, 8)

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Left Palette */}
        <div className="w-64 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Workflow className="h-4 w-4 text-[#FFE600]" />
              Orchestration
            </h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Drag items to canvas or load a demo</p>
          </div>

          {/* Palette Tabs */}
          <div className="flex border-b border-border">
            {(["demos", "agents", "skills", "mcps"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setPaletteTab(tab)}
                className={cn(
                  "flex-1 py-2 text-[10px] font-medium capitalize transition-colors",
                  paletteTab === tab ? "text-[#FFE600] border-b-2 border-[#FFE600]" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Palette Content */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {paletteTab === "demos" && demoPackages.map(pkg => (
              <button
                key={pkg.id}
                onClick={() => loadDemo(pkg)}
                className={cn(
                  "w-full text-left rounded-md border p-2.5 transition-all",
                  selectedPackage === pkg.id
                    ? "border-[#FFE600]/50 bg-[#FFE600]/5"
                    : "border-border hover:border-[#FFE600]/30 hover:bg-secondary/30"
                )}
              >
                <p className="text-xs font-medium text-foreground">{pkg.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{pkg.description}</p>
                <div className="flex gap-1 mt-1.5">
                  <Badge variant="outline" className="text-[8px] px-1 py-0">{pkg.items.filter(i => i.type === "agent").length} agents</Badge>
                  <Badge variant="outline" className="text-[8px] px-1 py-0">{pkg.items.filter(i => i.type === "skill").length} skills</Badge>
                  <Badge variant="outline" className="text-[8px] px-1 py-0">{pkg.items.filter(i => i.type === "mcp").length} MCPs</Badge>
                </div>
              </button>
            ))}

            {paletteTab === "agents" && paletteAgents.map(a => (
              <div
                key={a.id}
                draggable
                onDragStart={handlePaletteDragStart({ type: "agent", id: a.id, name: a.name, description: a.department })}
                className="flex items-center gap-2 rounded-md border border-border p-2 cursor-grab active:cursor-grabbing hover:border-[#4CAF82]/40 transition-colors"
              >
                <GripVertical className="h-3 w-3 text-muted-foreground/30 shrink-0" />
                <Bot className="h-3.5 w-3.5 text-[#4CAF82] shrink-0" />
                <div className="min-w-0"><p className="text-[10px] font-medium text-foreground truncate">{a.name}</p></div>
              </div>
            ))}

            {paletteTab === "skills" && paletteSkills.map(s => (
              <div
                key={s.id}
                draggable
                onDragStart={handlePaletteDragStart({ type: "skill", id: s.id, name: s.name, description: s.description })}
                className="flex items-center gap-2 rounded-md border border-border p-2 cursor-grab active:cursor-grabbing hover:border-[#FFE600]/40 transition-colors"
              >
                <GripVertical className="h-3 w-3 text-muted-foreground/30 shrink-0" />
                <Sparkles className="h-3.5 w-3.5 text-[#FFE600] shrink-0" />
                <div className="min-w-0"><p className="text-[10px] font-medium text-foreground truncate">{s.name}</p></div>
              </div>
            ))}

            {paletteTab === "mcps" && paletteMcps.map(m => (
              <div
                key={m.id}
                draggable
                onDragStart={handlePaletteDragStart({ type: "mcp", id: m.id, name: m.name, description: m.category || "" })}
                className="flex items-center gap-2 rounded-md border border-border p-2 cursor-grab active:cursor-grabbing hover:border-[#47C2E1]/40 transition-colors"
              >
                <GripVertical className="h-3 w-3 text-muted-foreground/30 shrink-0" />
                <Server className="h-3.5 w-3.5 text-[#47C2E1] shrink-0" />
                <div className="min-w-0"><p className="text-[10px] font-medium text-foreground truncate">{m.name}</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <div className="h-10 border-b border-border bg-background flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{canvasItems.length} items</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{connections.length} connections</span>
              {connectMode && <Badge className="bg-[#FFE600] text-[#1A1A24] text-[10px]">Click target to connect</Badge>}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7 text-[10px] bg-transparent gap-1" onClick={clearCanvas}>
                <RotateCcw className="h-3 w-3" /> Clear
              </Button>
              {canvasItems.length > 0 && (
                <>
                  <Button variant="outline" size="sm" className="h-7 text-[10px] bg-transparent gap-1" onClick={() => setConnectMode(connectMode ? null : selectedItem)}>
                    <Zap className="h-3 w-3" /> {connectMode ? "Cancel" : "Connect"}
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 text-[10px] gap-1 bg-[#FFE600] text-[#1A1A24] hover:bg-[#FFE600]/90"
                    onClick={() => currentPkg && runTest(currentPkg.testSteps)}
                    disabled={!currentPkg || testRunning}
                  >
                    {testRunning ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                    {testRunning ? "Testing..." : "Test Package"}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Canvas Area */}
          <div
            ref={canvasRef}
            className="flex-1 relative bg-[#1A1A24] overflow-hidden"
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy" }}
            onDrop={handleCanvasDrop}
            style={{ backgroundImage: "radial-gradient(circle, #3B3B47 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          >
            {canvasItems.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Workflow className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground/50">Load a demo or drag items from the palette</p>
                </div>
              </div>
            )}

            {/* Connection Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {connections.map((conn, i) => {
                const from = canvasItems.find(c => c.instanceId === conn.fromId)
                const to = canvasItems.find(c => c.instanceId === conn.toId)
                if (!from || !to) return null
                const x1 = from.x + 140
                const y1 = from.y + 30
                const x2 = to.x
                const y2 = to.y + 30
                const mx = (x1 + x2) / 2
                return (
                  <g key={i}>
                    <path
                      d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                      fill="none"
                      stroke="#3B3B47"
                      strokeWidth="2"
                    />
                    <circle cx={x2} cy={y2} r="3" fill="#FFE600" opacity="0.6" />
                  </g>
                )
              })}
            </svg>

            {/* Canvas Items */}
            {canvasItems.map(item => {
              const cfg = typeConfig[item.type]
              const Icon = cfg.icon
              const isSelected = selectedItem === item.instanceId
              const isConnecting = connectMode === item.instanceId

              return (
                <motion.div
                  key={item.instanceId}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "absolute w-[140px] rounded-md border p-2.5 cursor-pointer transition-shadow select-none",
                    cfg.bg, cfg.border,
                    isSelected && "ring-2 ring-[#FFE600] shadow-lg shadow-[#FFE600]/10",
                    isConnecting && "ring-2 ring-[#FFE600] animate-pulse"
                  )}
                  style={{ left: item.x, top: item.y, zIndex: isSelected ? 10 : 2 }}
                  onClick={() => handleItemClick(item.instanceId)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-[8px] px-1 py-0">{cfg.label}</Badge>
                    <button
                      className="h-4 w-4 rounded-sm flex items-center justify-center hover:bg-destructive/20 transition-colors"
                      onClick={(e) => { e.stopPropagation(); removeItem(item.instanceId) }}
                    >
                      <X className="h-2.5 w-2.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: cfg.color }} />
                    <p className="text-[10px] font-medium text-foreground truncate">{item.name}</p>
                  </div>
                  <p className="text-[8px] text-muted-foreground mt-0.5 truncate">{item.description}</p>
                  {/* Connection port */}
                  <div
                    className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-border bg-card cursor-crosshair hover:border-[#FFE600] hover:bg-[#FFE600]/20 transition-colors"
                    style={{ zIndex: 5 }}
                    onClick={(e) => { e.stopPropagation(); setConnectMode(item.instanceId) }}
                  />
                  <div
                    className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-border bg-card cursor-pointer hover:border-[#FFE600] hover:bg-[#FFE600]/20 transition-colors"
                    style={{ zIndex: 5 }}
                    onClick={(e) => { e.stopPropagation(); handleItemClick(item.instanceId) }}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Right Panel — Test Runner */}
        <div className="w-72 border-l border-border bg-card flex flex-col shrink-0">
          <div className="p-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">
              {currentPkg ? currentPkg.name : "Package Details"}
            </h3>
            {currentPkg && (
              <p className="text-[10px] text-muted-foreground mt-0.5">{currentPkg.description}</p>
            )}
          </div>

          {currentPkg ? (
            <div className="flex-1 overflow-y-auto">
              {/* Composition Summary */}
              <div className="p-3 border-b border-border">
                <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Composition</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center rounded-md bg-[#4CAF82]/10 p-2">
                    <p className="text-sm font-semibold text-[#4CAF82]">{canvasItems.filter(i => i.type === "agent").length}</p>
                    <p className="text-[8px] text-muted-foreground">Agents</p>
                  </div>
                  <div className="text-center rounded-md bg-[#FFE600]/10 p-2">
                    <p className="text-sm font-semibold text-[#FFE600]">{canvasItems.filter(i => i.type === "skill").length}</p>
                    <p className="text-[8px] text-muted-foreground">Skills</p>
                  </div>
                  <div className="text-center rounded-md bg-[#47C2E1]/10 p-2">
                    <p className="text-sm font-semibold text-[#47C2E1]">{canvasItems.filter(i => i.type === "mcp").length}</p>
                    <p className="text-[8px] text-muted-foreground">MCPs</p>
                  </div>
                </div>
              </div>

              {/* Test Runner */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Test Run</h4>
                  {testSteps.length > 0 && !testRunning && (
                    <Button variant="ghost" size="sm" className="h-5 text-[10px] px-1.5" onClick={() => runTest(currentPkg.testSteps)}>
                      <RotateCcw className="h-2.5 w-2.5 mr-1" /> Rerun
                    </Button>
                  )}
                </div>

                {testSteps.length === 0 ? (
                  <div className="text-center py-6">
                    <Play className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
                    <p className="text-[10px] text-muted-foreground">Click "Test Package" to simulate</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {testSteps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={cn(
                          "flex items-start gap-2 rounded-md px-2 py-1.5 text-[10px] transition-colors",
                          step.status === "running" && "bg-[#FFE600]/5",
                          step.status === "success" && "bg-[#4CAF82]/5",
                        )}
                      >
                        <div className="mt-0.5 shrink-0">
                          {step.status === "pending" && <Clock className="h-3 w-3 text-muted-foreground/30" />}
                          {step.status === "running" && <Loader2 className="h-3 w-3 text-[#FFE600] animate-spin" />}
                          {step.status === "success" && <CheckCircle2 className="h-3 w-3 text-[#4CAF82]" />}
                          {step.status === "error" && <AlertCircle className="h-3 w-3 text-[#FF6B6B]" />}
                        </div>
                        <p className={cn(
                          "flex-1",
                          step.status === "pending" ? "text-muted-foreground/40" :
                          step.status === "running" ? "text-[#FFE600]" :
                          "text-foreground"
                        )}>
                          {step.label}
                        </p>
                        {step.duration && (
                          <span className="text-[8px] text-muted-foreground shrink-0">{step.duration}ms</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Package Action */}
              {testSteps.length > 0 && !testRunning && testSteps.every(s => s.status === "success") && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 border-t border-border"
                >
                  <Button className="w-full gap-2 bg-[#FFE600] text-[#1A1A24] hover:bg-[#FFE600]/90 font-medium text-xs">
                    <Package className="h-3.5 w-3.5" /> Package & Deploy
                  </Button>
                  <p className="text-[9px] text-muted-foreground text-center mt-1.5">All tests passed — ready for governance review</p>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <Package className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Select a demo or build a composition</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
