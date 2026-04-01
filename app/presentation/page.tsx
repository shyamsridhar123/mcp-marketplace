import type { Metadata } from "next"
import Link from "next/link"
import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Boxes,
  Brain,
  Building2,
  CheckCircle2,
  FileText,
  Layers,
  Lock,
  Package,
  Server,
  Shield,
  Sparkles,
  Workflow,
} from "lucide-react"

import {
  agentBlueprints,
  agentData,
  agentTraces,
  approvalRequests,
  dlpPolicies,
  governancePolicies,
  iqSignals,
  mcpServers,
} from "@/lib/data"

export const metadata: Metadata = {
  title: "EY Agent Platform Presentation",
  description:
    "Standalone strategy deck for the EY AI Agent Hub, positioning the platform as the governed registration, orchestration, and packaging layer for MCPs, skills, and agents.",
}

interface StatCardProps {
  readonly label: string
  readonly value: string
  readonly detail: string
}

interface SlideSectionProps {
  readonly id: string
  readonly eyebrow: string
  readonly title: string
  readonly description: string
  readonly children: ReactNode
}

interface PlatformCapability {
  readonly title: string
  readonly detail: string
  readonly bullets: readonly string[]
  readonly icon: LucideIcon
}

interface ProofPoint {
  readonly title: string
  readonly route: string
  readonly proof: string
  readonly detail: string
  readonly icon: LucideIcon
}

interface ComparisonCard {
  readonly title: string
  readonly summary: string
  readonly bullets: readonly string[]
  readonly footer: string
  readonly icon: LucideIcon
}

interface RoadmapPhase {
  readonly title: string
  readonly summary: string
  readonly bullets: readonly string[]
}

const numberFormatter = new Intl.NumberFormat("en-US")

const totalIntegrations = mcpServers.length
const workIqCount = mcpServers.filter((mcp) => mcp.isWorkIQ).length
const totalAgents = agentData.length
const activeAgents = agentData.filter((agent) => agent.status === "active").length
const blueprintCount = agentBlueprints.length
const policyPackCount = governancePolicies.length + dlpPolicies.length
const pendingApprovals = approvalRequests.filter(
  (approval) => approval.stage === "pending" || approval.stage === "in-review",
).length
const approvedPackages = agentData.filter(
  (agent) => agent.blueprintId && agent.entraIdentity && agent.observabilityEnabled,
).length
const totalSignals = iqSignals.length
const traceCount = agentTraces.length
const totalSkills = agentData.reduce((sum, agent) => sum + agent.skills.length, 0)

const heroStats: readonly StatCardProps[] = [
  {
    label: "Governed integrations",
    value: numberFormatter.format(totalIntegrations),
    detail: `${workIqCount} Work IQ servers alongside CRM, Graph, analytics, and custom MCPs`,
  },
  {
    label: "Registered agents",
    value: `${activeAgents}/${totalAgents}`,
    detail: "Active vs total agents already modeled with lifecycle, identity, and telemetry",
  },
  {
    label: "Blueprints & policy packs",
    value: `${blueprintCount} / ${policyPackCount}`,
    detail: "Blueprints, governance policies, and DLP rules define the operating envelope",
  },
  {
    label: "Downstream-ready packages",
    value: numberFormatter.format(approvedPackages),
    detail: "Agents that already have blueprint, identity, and observability ingredients in place",
  },
  {
    label: "Pending approvals",
    value: numberFormatter.format(pendingApprovals),
    detail: "Governed workflow already exists for registration, access, and blueprint activation",
  },
  {
    label: "Signals & traces",
    value: `${numberFormatter.format(totalSignals)} / ${numberFormatter.format(traceCount)}`,
    detail: "Intelligence plus auditability are part of the product story, not a bolt-on",
  },
]

const platformCapabilities: readonly PlatformCapability[] = [
  {
    title: "Register",
    detail:
      "Create a single enterprise inventory for MCPs, skills, agents, blueprints, identities, and approvals.",
    bullets: [
      "Catalog first-party and partner MCP servers",
      "Track agent blueprints, lifecycle, and Entra identity",
      "Make downstream consumption start from approved inventory, not tribal knowledge",
    ],
    icon: Boxes,
  },
  {
    title: "Orchestrate",
    detail:
      "Coordinate how skills, MCP tools, and agents come together under EY policy and operating guardrails.",
    bullets: [
      "Compose runtime capabilities visually and by blueprint",
      "Route approvals, admin consent, and compliance checks into the flow",
      "Observe runs, traces, and intelligence signals as part of orchestration",
    ],
    icon: Workflow,
  },
  {
    title: "Package",
    detail:
      "Bundle governed capability for downstream apps, portals, and integrated agent surfaces to consume safely.",
    bullets: [
      "Ship blueprint + skills + approved MCP bindings as one productized unit",
      "Attach policy pack, identity profile, telemetry contract, and ownership metadata",
      "Let teams consume governed agents without rebuilding governance every time",
    ],
    icon: Package,
  },
]

const proofPoints: readonly ProofPoint[] = [
  {
    title: "Dashboard",
    route: "/",
    proof: "Executive KPIs across integrations, approvals, compliance, and intelligence",
    detail: "The current homepage already behaves like an operating cockpit rather than a simple catalog.",
    icon: Brain,
  },
  {
    title: "Integrations",
    route: "/marketplace",
    proof: "Governed MCP catalog with Work IQ, Dataverse, Graph, and provider onboarding",
    detail: "This is the registration surface for tools that later power skills and agents.",
    icon: Server,
  },
  {
    title: "Agents",
    route: "/agents",
    proof: "Registry with lifecycle, blueprint badges, Entra identity, and observability markers",
    detail: "Agent governance is already modeled explicitly in the product, not implied off-screen.",
    icon: Bot,
  },
  {
    title: "Orchestration",
    route: "/canvas",
    proof: "Visual composition, test scenarios, and package/deploy framing",
    detail: "The canvas already tells the story of agents selecting skills and MCP tools dynamically.",
    icon: Workflow,
  },
  {
    title: "Governance",
    route: "/governance",
    proof: "Policies, blueprints, approvals, audit traces, and compliance scorecards",
    detail: "This is the core of the EY control layer the presentation needs to emphasize.",
    icon: Shield,
  },
  {
    title: "Intelligence",
    route: "/intelligence",
    proof: "Work IQ Data / Memory / Inference layers with signal streams and analytics handoff",
    detail: "The repo already visualizes the intelligence layer that makes governed agents useful in practice.",
    icon: Sparkles,
  },
]

const comparisonCards: readonly ComparisonCard[] = [
  {
    title: "Microsoft Agent 365",
    summary:
      "Agent 365 is the enterprise control plane for agents across the organization, regardless of where they were built or acquired.",
    bullets: [
      "Registry and map for all agents",
      "Access control via Entra and enterprise security posture",
      "Governance, observability, security, and interoperability at tenant scale",
    ],
    footer:
      "EY AI Agent Hub aligns naturally to this story as the business-facing governed registry and orchestration plane inside that wider control model.",
    icon: Building2,
  },
  {
    title: "Copilot Studio and integrated agent+UI platforms",
    summary:
      "Copilot Studio is a build, manage, and publish surface for agents, including experiences that already have their own integrated UI.",
    bullets: [
      "Low-code and managed authoring experience",
      "Supports internal and external publishing surfaces",
      "Not every agent experience needs EY to own the end-user UI",
    ],
    footer:
      "If the UI already exists elsewhere, EY still adds value by governing the MCP layer, approvals, packaging, and telemetry contract.",
    icon: FileText,
  },
  {
    title: "AG-UI",
    summary:
      "AG-UI provides an open event-based interaction contract between agent runtimes and front-end experiences.",
    bullets: [
      "Run lifecycle, streaming messages, and reasoning events",
      "Tool-call start/args/end/result semantics",
      "State snapshot and delta synchronization for rich UIs",
    ],
    footer:
      "This repo does not implement AG-UI today; it is the next interoperability layer EY can adopt to standardize runtime-to-UI behavior across platforms.",
    icon: Layers,
  },
]

const roadmap: readonly RoadmapPhase[] = [
  {
    title: "1. Operationalize the registry",
    summary:
      "Use the current hub as the source of truth for integrations, skills, agents, identity, and approvals.",
    bullets: [
      "Treat Marketplace + Agents + Governance as the authoritative asset inventory",
      "Harden approval workflows for MCP registration and blueprint activation",
      "Publish clear ownership and lifecycle state for every governed capability",
    ],
  },
  {
    title: "2. Productize packaging for downstream apps",
    summary:
      "Turn governed capabilities into consumable packages rather than one-off implementations.",
    bullets: [
      "Define package manifests for blueprint, skills, allowed MCPs, identity, and telemetry",
      "Make consumption paths explicit for downstream applications and embedded assistants",
      "Support reuse across internal apps, partner solutions, and Copilot Studio scenarios",
    ],
  },
  {
    title: "3. Add interoperability and policy automation",
    summary:
      "Standardize the runtime contract and automate enforcement at the MCP tools layer.",
    bullets: [
      "Introduce AG-UI adapters where multi-runtime UI interoperability matters",
      "Enforce policy and audit at MCP invocation boundaries",
      "Feed signals and traces into a repeatable enterprise operating model with Agent 365 alignment",
    ],
  },
]

const sourceLinks = [
  {
    label: "Microsoft Agent 365 overview",
    href: "https://www.microsoft.com/en-us/microsoft-agent-365",
  },
  {
    label: "Microsoft Agent 365 documentation",
    href: "https://learn.microsoft.com/en-us/microsoft-agent-365/",
  },
  {
    label: "Microsoft Copilot Studio",
    href: "https://www.microsoft.com/en-us/microsoft-365-copilot/microsoft-copilot-studio",
  },
  {
    label: "AG-UI protocol documentation",
    href: "https://github.com/ag-ui-protocol/ag-ui",
  },
]

function SlideSection({ id, eyebrow, title, description, children }: SlideSectionProps) {
  return (
    <section
      id={id}
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] px-6 py-8 shadow-2xl shadow-black/20 md:px-10 md:py-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,230,0,0.1),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(71,194,225,0.08),transparent_28%)]" />
      <div className="relative space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FFE600]">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {title}
          </h2>
          <p className="text-base leading-7 text-slate-300 md:text-lg">{description}</p>
        </div>
        {children}
      </div>
    </section>
  )
}

function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0f1118]/85 p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
    </div>
  )
}

export default function PresentationPage() {
  return (
    <div className="min-h-screen bg-[#11131c] text-[#f8fafc]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#11131c]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-200 transition-colors hover:border-[#FFE600]/30 hover:bg-[#FFE600]/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 text-[#FFE600]" />
            Back to dashboard
          </Link>

          <nav className="hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400 md:flex">
            <a className="rounded-full px-3 py-2 transition-colors hover:bg-white/[0.04] hover:text-white" href="#platform">
              Platform
            </a>
            <a className="rounded-full px-3 py-2 transition-colors hover:bg-white/[0.04] hover:text-white" href="#proof">
              Repo proof
            </a>
            <a className="rounded-full px-3 py-2 transition-colors hover:bg-white/[0.04] hover:text-white" href="#fit">
              Microsoft fit
            </a>
            <a className="rounded-full px-3 py-2 transition-colors hover:bg-white/[0.04] hover:text-white" href="#architecture">
              Architecture
            </a>
            <a className="rounded-full px-3 py-2 transition-colors hover:bg-white/[0.04] hover:text-white" href="#roadmap">
              Roadmap
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 md:gap-10 md:py-10">
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,230,0,0.14),rgba(255,230,0,0.04)_35%,rgba(71,194,225,0.1)_100%)] px-6 py-8 shadow-2xl shadow-black/20 md:px-10 md:py-12">
          <div className="absolute -right-16 top-10 h-64 w-64 rounded-full bg-[#FFE600]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FFE600]/25 bg-[#FFE600]/10 px-4 py-2 text-sm font-medium text-[#FFE600]">
                <Building2 className="h-4 w-4" />
                EY AI Agent Hub — presentation view
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl md:leading-[1.05]">
                  Governed registration, orchestration, and packaging for MCPs, skills, and agents.
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
                  This platform is not just a marketplace. It is the EY operating layer that registers
                  enterprise-ready capability, applies governance and orchestration policies, and packages
                  approved agent products for downstream applications to consume.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                {[
                  "Register once, consume anywhere",
                  "Govern through the MCP tools layer",
                  "Package agents for downstream apps",
                  "Align to Agent 365 control-plane concepts",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/10 bg-[#0f1118]/70 px-4 py-2 text-slate-200"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {heroStats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-[32px] border border-white/10 bg-[#0f1118]/80 p-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Executive readout
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  Build anywhere. Govern centrally. Package for reuse.
                </h2>
                <p className="text-sm leading-7 text-slate-300">
                  The repo already contains the proof points for this story: governed integrations,
                  agent registry, blueprint-aware lifecycle, approvals, audit traces, Work IQ intelligence,
                  and an embedded assistant surface.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "If another platform already owns the UI",
                    detail:
                      "Keep the user experience there. EY still contributes governance, orchestration, policy, and packaging through the MCP tools layer.",
                    icon: FileText,
                  },
                  {
                    title: "If EY owns the downstream application",
                    detail:
                      "Consume a governed package instead of rebuilding agent wiring, approvals, identity, and observability inside each app.",
                    icon: Package,
                  },
                  {
                    title: "If interoperability becomes strategic",
                    detail:
                      "Use AG-UI as the runtime-to-frontend contract so multiple agent runtimes can drive a consistent governed UI experience.",
                    icon: Layers,
                  },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.title}
                      className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFE600]/12">
                          <Icon className="h-5 w-5 text-[#FFE600]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-400">{item.detail}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <SlideSection
          id="platform"
          eyebrow="Platform thesis"
          title="What this platform is"
          description="The cleanest articulation for EY is simple: this is the platform to register and orchestrate MCPs, skills, and agents under EY governance policies, then package them for downstream application consumption."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {platformCapabilities.map((capability) => {
              const Icon = capability.icon
              return (
                <article
                  key={capability.title}
                  className="rounded-[28px] border border-white/10 bg-[#0f1118]/85 p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE600]/12">
                      <Icon className="h-6 w-6 text-[#FFE600]" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">{capability.title}</h3>
                  </div>
                  <p className="mt-4 text-base leading-7 text-slate-300">{capability.detail}</p>
                  <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
                    {capability.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-white/10 bg-[#0f1118]/85 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Packaging model
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                A downstream-ready agent package is more than an agent runtime.
              </h3>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                {[
                  "Blueprint",
                  "Skill bundle",
                  "Approved MCP bindings",
                  "Policy pack",
                  "Identity profile",
                  "Observability contract",
                  "Owner + lifecycle metadata",
                  "Consumption guide",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#FFE600]/20 bg-[#FFE600]/6 p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-[#FFE600]" />
                <h3 className="text-xl font-semibold text-white">Important strategic nuance</h3>
              </div>
              <p className="mt-4 text-base leading-7 text-slate-200">
                If a solution such as Copilot Studio already brings its own integrated agent and UI,
                EY does not need to replace that experience. EY still governs and orchestrates through
                the MCP tools layer by controlling which capabilities are registered, approved, observed,
                and packaged for enterprise use.
              </p>
            </div>
          </div>
        </SlideSection>

        <SlideSection
          id="proof"
          eyebrow="Repo proof"
          title="What the codebase already proves"
          description="This story is grounded in working product surfaces that already exist in the repository. The presentation is intentionally anchored to routes, data models, and interactions that are present today."
        >
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {proofPoints.map((point) => {
              const Icon = point.icon
              return (
                <Link
                  key={point.title}
                  href={point.route}
                  className="group rounded-[28px] border border-white/10 bg-[#0f1118]/85 p-6 transition-colors hover:border-[#FFE600]/30 hover:bg-[#161924]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE600]/12">
                      <Icon className="h-6 w-6 text-[#FFE600]" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-[#FFE600]" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-white">{point.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-200">{point.proof}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{point.detail}</p>
                </Link>
              )
            })}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#0f1118]/85 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Evidence in data and interactions
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Skills modeled", value: numberFormatter.format(totalSkills), icon: Sparkles },
                { label: "Work IQ servers", value: numberFormatter.format(workIqCount), icon: Brain },
                { label: "Approval requests", value: numberFormatter.format(approvalRequests.length), icon: Shield },
                { label: "Trace events", value: numberFormatter.format(traceCount), icon: Activity },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-400">{item.label}</p>
                      <Icon className="h-4 w-4 text-[#FFE600]" />
                    </div>
                    <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </SlideSection>

        <SlideSection
          id="fit"
          eyebrow="Microsoft fit"
          title="How Agent 365, Copilot Studio, and AG-UI fit the EY story"
          description="These three ideas do different jobs. The deck is strongest when it keeps their responsibilities separate instead of blending them into one vague platform narrative."
        >
          <div className="grid gap-4 xl:grid-cols-3">
            {comparisonCards.map((card) => {
              const Icon = card.icon
              return (
                <article
                  key={card.title}
                  className="rounded-[28px] border border-white/10 bg-[#0f1118]/85 p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE600]/12">
                      <Icon className="h-6 w-6 text-[#FFE600]" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
                  </div>
                  <p className="mt-4 text-base leading-7 text-slate-200">{card.summary}</p>
                  <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 border-t border-white/10 pt-5 text-sm leading-6 text-slate-300">
                    {card.footer}
                  </p>
                </article>
              )
            })}
          </div>

          <div className="rounded-[28px] border border-amber-400/20 bg-amber-400/5 p-6">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-amber-300" />
              <h3 className="text-xl font-semibold text-white">Honest positioning wins</h3>
            </div>
            <p className="mt-4 max-w-5xl text-base leading-7 text-slate-200">
              The current repo already aligns to Agent 365 control-plane concepts, but it does not literally
              ship AG-UI today. The embedded assistant surface is implemented with the 21st SDK stack. That is
              not a weakness. It simply means the deck should present AG-UI as the interoperability contract EY
              can add next when it wants a consistent multi-runtime front-end protocol.
            </p>
          </div>
        </SlideSection>

        <SlideSection
          id="architecture"
          eyebrow="Target operating model"
          title="Build anywhere, govern centrally, consume safely"
          description="The architecture should show four layers: experience surfaces, the EY governed platform, interoperability at the tool/runtime boundary, and the wider enterprise control plane."
        >
          <div className="grid gap-4">
            {[
              {
                title: "Experience surfaces",
                summary: "Where people and downstream systems actually consume the capability.",
                chips: [
                  "EY downstream applications",
                  "Embedded assistants",
                  "Copilot Studio experiences",
                  "Partner or ISV UIs",
                ],
                icon: Building2,
              },
              {
                title: "EY governed platform plane",
                summary: "Where registry, orchestration, approvals, packaging, and telemetry are managed as reusable enterprise assets.",
                chips: [
                  "Integration registry",
                  "Skill catalog",
                  "Agent registry",
                  "Blueprints",
                  "Approvals",
                  "Compliance scoring",
                  "Package manifests",
                ],
                icon: Shield,
              },
              {
                title: "Interoperability and runtime boundary",
                summary: "Where EY governs the MCP tools layer and standardizes runtime-to-UI behavior when needed.",
                chips: [
                  "MCP servers",
                  "Skill-to-tool bindings",
                  "Policy enforcement at tool invocation",
                  "OTel traces and run telemetry",
                  "Optional AG-UI adapters",
                ],
                icon: Workflow,
              },
              {
                title: "Enterprise control plane and systems of record",
                summary: "The Microsoft and enterprise foundation that provides identity, security, and context.",
                chips: [
                  "Agent 365",
                  "Entra",
                  "Defender",
                  "Purview",
                  "Microsoft 365 admin center",
                  "Work IQ",
                  "Dataverse & Dynamics 365",
                  "Microsoft Graph",
                ],
                icon: Server,
              },
            ].map((layer, index) => {
              const Icon = layer.icon
              return (
                <div key={layer.title} className="rounded-[28px] border border-white/10 bg-[#0f1118]/85 p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE600]/12">
                          <Icon className="h-6 w-6 text-[#FFE600]" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                            Layer {index + 1}
                          </p>
                          <h3 className="text-2xl font-semibold text-white">{layer.title}</h3>
                        </div>
                      </div>
                      <p className="mt-4 text-base leading-7 text-slate-300">{layer.summary}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 lg:max-w-xl lg:justify-end">
                      {layer.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-200"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-[#0f1118]/85 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Consumption path
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Downstream teams should consume packages, not raw complexity.</h3>
              <div className="mt-5 grid gap-3">
                {[
                  "1. Register MCPs, skills, agents, blueprints, and policy packs in EY Hub",
                  "2. Approve access, identity, data boundaries, and observability requirements",
                  "3. Package the governed capability for a downstream app, assistant, or external surface",
                  "4. Observe usage, traces, approvals, and policy posture continuously",
                ].map((step) => (
                  <div key={step} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#47C2E1]/20 bg-[#47C2E1]/6 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#47C2E1]">
                Current vs next
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-[#0f1118]/70 p-5">
                  <h4 className="text-lg font-semibold text-white">Already in the repo</h4>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                    {[
                      "Six product pillars with EY shell and executive dashboard",
                      "Work IQ, Dataverse, Graph, and other MCP registrations",
                      "Blueprint-aware agents with Entra identity and traces",
                      "Governance tabs for approvals, audit, and compliance",
                      "Intelligence view for Data / Memory / Inference",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-white/10 bg-[#0f1118]/70 p-5">
                  <h4 className="text-lg font-semibold text-white">Operationalize next</h4>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                    {[
                      "Formal package manifests for downstream applications",
                      "MCP-layer policy enforcement and reusable consumption contracts",
                      "Registration kits for Copilot Studio and other external surfaces",
                      "AG-UI adapters where runtime interoperability matters",
                      "Automated promotion gates from review to active lifecycle",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#FFE600]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </SlideSection>

        <SlideSection
          id="roadmap"
          eyebrow="Roadmap"
          title="Recommended next moves for EY"
          description="The goal is not to invent a new agent ecosystem from scratch. It is to use the platform as the governed productization layer over capabilities that may be built in multiple runtimes and consumed in multiple experiences."
        >
          <div className="grid gap-4 xl:grid-cols-3">
            {roadmap.map((phase) => (
              <article
                key={phase.title}
                className="rounded-[28px] border border-white/10 bg-[#0f1118]/85 p-6"
              >
                <h3 className="text-2xl font-semibold text-white">{phase.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-300">{phase.summary}</p>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
                  {phase.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="rounded-[28px] border border-white/10 bg-[#0f1118]/85 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Closing message
              </p>
              <p className="mt-4 text-2xl font-semibold leading-tight text-white">
                The winning story is not “we built another agent UI.” It is “we built the governed plane that lets EY safely register, orchestrate, and productize agent capability for every downstream experience.”
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/agents"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFE600] px-5 py-3 text-sm font-semibold text-[#1A1A24] transition-colors hover:bg-[#FFE600]/90"
              >
                Open live registry
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/governance"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-[#FFE600]/30 hover:bg-[#FFE600]/10"
              >
                Open governance view
                <ArrowRight className="h-4 w-4 text-[#FFE600]" />
              </Link>
            </div>
          </div>
        </SlideSection>

        <SlideSection
          id="sources"
          eyebrow="Grounding"
          title="Sources and repo receipts"
          description="The claims in this deck are grounded in Microsoft documentation and in the codebase’s existing product surfaces, data models, and route structure."
        >
          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[28px] border border-white/10 bg-[#0f1118]/85 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                External sources
              </p>
              <div className="mt-5 space-y-3">
                {sourceLinks.map((source) => (
                  <a
                    key={source.href}
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 transition-colors hover:border-[#FFE600]/30 hover:bg-[#FFE600]/10"
                  >
                    <span>{source.label}</span>
                    <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-[#FFE600]" />
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0f1118]/85 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Repo receipts
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "app/page.tsx — executive dashboard and KPI framing",
                  "app/marketplace/page.tsx — governed integration registry and Work IQ placement",
                  "app/agents/page.tsx — agent lifecycle, blueprint, Entra, and telemetry indicators",
                  "app/governance/page.tsx — approvals, audit, policies, and compliance proof",
                  "app/intelligence/page.tsx — Data / Memory / Inference structure",
                  "app/canvas/page.tsx — orchestration narrative and packaging cue",
                  "components/hub-assistant-surface.tsx — embedded assistant experience",
                  "lib/data.ts + lib/data/governance.ts — blueprints, DLP, approvals, traces, signals",
                ].map((receipt) => (
                  <div
                    key={receipt}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300"
                  >
                    {receipt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SlideSection>
      </main>
    </div>
  )
}
