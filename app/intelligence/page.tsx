"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import { iqSignals } from "@/lib/data"
import {
  Brain,
  Layers,
  MemoryStick,
  Cpu,
  Activity,
  TrendingUp,
  Zap,
  Eye,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"

const iqFamilyTabs = [
  { id: 'work-iq', label: 'Work IQ', active: true },
  { id: 'foundry-iq', label: 'Foundry IQ', active: false },
  { id: 'fabric-iq', label: 'Fabric IQ', active: false },
] as const

const layerConfig = {
  data: { icon: Layers, label: 'Data Signals', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  memory: { icon: MemoryStick, label: 'Organizational Memory', color: 'text-[#FFE600]', bg: 'bg-[#FFE600]/10', border: 'border-[#FFE600]/20' },
  inference: { icon: Cpu, label: 'Inference Activity', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
} as const

export default function IntelligencePage() {
  const [selectedFamily, setSelectedFamily] = useState<string>('work-iq')

  const dataSignals = iqSignals.filter(s => s.layer === 'data')
  const memorySignals = iqSignals.filter(s => s.layer === 'memory')
  const inferenceSignals = iqSignals.filter(s => s.layer === 'inference')

  const totalSignals = iqSignals.length
  const avgConfidence = Math.round(iqSignals.reduce((sum, s) => sum + s.confidence, 0) / iqSignals.length * 100)

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Brain className="h-6 w-6 text-accent" />
                Intelligence
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Work IQ intelligence layer — Data, Memory, and Inference powering your agents
              </p>
            </div>
          </div>
        </div>

        {/* IQ Family Selector */}
        <div className="mb-6 flex items-center gap-2">
          {iqFamilyTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => tab.active && setSelectedFamily(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                selectedFamily === tab.id
                  ? "bg-gradient-to-r from-accent/20 to-accent/10 text-accent border border-accent/30"
                  : tab.active
                    ? "text-muted-foreground hover:bg-secondary"
                    : "text-muted-foreground/50 cursor-not-allowed"
              )}
            >
              {tab.label}
              {!tab.active && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">Coming Soon</Badge>
              )}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              Total Signals
            </div>
            <p className="mt-1 text-2xl font-semibold">{totalSignals}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              Data Signals
            </div>
            <p className="mt-1 text-2xl font-semibold">{dataSignals.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              Avg Confidence
            </div>
            <p className="mt-1 text-2xl font-semibold">{avgConfidence}%</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Active Layers
            </div>
            <p className="mt-1 text-2xl font-semibold">3/3</p>
          </div>
        </div>

        {/* Three-Panel Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Data Layer Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className={cn("rounded-xl border p-5", layerConfig.data.border, layerConfig.data.bg)}
          >
            <div className="flex items-center gap-2 mb-4">
              <Layers className={cn("h-5 w-5", layerConfig.data.color)} />
              <h3 className={cn("font-semibold", layerConfig.data.color)}>Data Signals</h3>
              <Badge variant="outline" className="ml-auto text-xs">{dataSignals.length}</Badge>
            </div>
            <div className="space-y-3">
              {dataSignals.map((signal) => (
                <div key={signal.id} className="rounded-lg bg-background/50 p-3 border border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-[10px] px-1.5">{signal.type}</Badge>
                    <span className="text-[10px] text-muted-foreground">{new Date(signal.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">{signal.content}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1 flex-1 rounded-full bg-border overflow-hidden">
                      <div className="h-full rounded-full bg-blue-400" style={{ width: `${signal.confidence * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{Math.round(signal.confidence * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Memory Layer Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className={cn("rounded-xl border p-5", layerConfig.memory.border, layerConfig.memory.bg)}
          >
            <div className="flex items-center gap-2 mb-4">
              <MemoryStick className={cn("h-5 w-5", layerConfig.memory.color)} />
              <h3 className={cn("font-semibold", layerConfig.memory.color)}>Organizational Memory</h3>
              <Badge variant="outline" className="ml-auto text-xs">{memorySignals.length}</Badge>
            </div>
            <div className="space-y-3">
              {memorySignals.map((signal) => (
                <div key={signal.id} className="rounded-lg bg-background/50 p-3 border border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-[10px] px-1.5">{signal.type}</Badge>
                    <span className="text-[10px] text-muted-foreground">{new Date(signal.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">{signal.content}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1 flex-1 rounded-full bg-border overflow-hidden">
                      <div className="h-full rounded-full bg-[#FFE600]" style={{ width: `${signal.confidence * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{Math.round(signal.confidence * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Inference Layer Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className={cn("rounded-xl border p-5", layerConfig.inference.border, layerConfig.inference.bg)}
          >
            <div className="flex items-center gap-2 mb-4">
              <Cpu className={cn("h-5 w-5", layerConfig.inference.color)} />
              <h3 className={cn("font-semibold", layerConfig.inference.color)}>Inference Activity</h3>
              <Badge variant="outline" className="ml-auto text-xs">{inferenceSignals.length}</Badge>
            </div>
            <div className="space-y-3">
              {inferenceSignals.map((signal) => (
                <div key={signal.id} className="rounded-lg bg-background/50 p-3 border border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-[10px] px-1.5">{signal.type}</Badge>
                    <span className="text-[10px] text-muted-foreground">{new Date(signal.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">{signal.content}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1 flex-1 rounded-full bg-border overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-400" style={{ width: `${signal.confidence * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{Math.round(signal.confidence * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Link to Detailed Analytics */}
        <div className="mt-8 rounded-xl border border-border bg-card p-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">Detailed Analytics</h4>
            <p className="text-xs text-muted-foreground">View comprehensive platform metrics and agent performance data</p>
          </div>
          <Link href="/analytics" className="flex items-center gap-1 text-sm text-accent hover:underline">
            View Analytics <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
