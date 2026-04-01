"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Plus,
  Boxes,
  Server,
  Check,
  Settings,
  Trash2,
  Copy,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AppShell } from "@/components/app-shell"
import { GlossaryTooltip } from "@/components/glossary-tooltip"
import { mcpServers, agentData } from "@/lib/data"
import { cn } from "@/lib/utils"

// Extract all skills from agents
const allSkills = agentData
  .flatMap((agent) =>
    agent.skills.map((skill) => ({
      ...skill,
      usedByAgents: agentData
        .filter((a) => a.skills.some((s) => s.id === skill.id))
        .map((a) => a.name),
    }))
  )
  .filter(
    (skill, index, self) => index === self.findIndex((s) => s.id === skill.id)
  )

const categoryColors: Record<string, string> = {
  Infrastructure: "bg-blue-500/20 text-blue-400",
  Compliance: "bg-emerald-500/20 text-emerald-400",
  Analytics: "bg-amber-500/20 text-amber-400",
  Communication: "bg-pink-500/20 text-pink-400",
  Database: "bg-orange-500/20 text-orange-400",
  Security: "bg-red-500/20 text-red-400",
  DevOps: "bg-cyan-500/20 text-cyan-400",
  "AI/ML": "bg-[#47C2E1]/20 text-[#47C2E1]",
  Productivity: "bg-indigo-500/20 text-indigo-400",
  Custom: "bg-muted text-muted-foreground",
}

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedMCP, setSelectedMCP] = useState<string | null>(null)

  const filteredSkills = allSkills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || skill.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const selectedMCPData = selectedMCP
    ? mcpServers.find((m) => m.id === selectedMCP)
    : null

  const categories = [
    "all",
    "Infrastructure",
    "Compliance",
    "Analytics",
    "Database",
    "Security",
    "DevOps",
  ]

  return (
    <AppShell>
      {/* Main Content */}
      <div className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Page Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Skills Library
              </h1>
              <p className="mt-1 text-muted-foreground">
                <GlossaryTooltip term="skill">
                  Package MCP capabilities
                </GlossaryTooltip>{" "}
                as reusable skills for agents
              </p>
            </div>
            <Button
              className="gap-2 bg-foreground text-background hover:bg-foreground/90"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create Skill
            </Button>
          </div>

          {/* Divider */}
          <div className="mb-6 h-px bg-border" />

          {/* Stats Row */}
          <div className="mb-8 grid grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Skills</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {allSkills.length}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Active Skills</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-400">
                {allSkills.filter((s) => s.isActive).length}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">MCPs with Skills</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {new Set(allSkills.map((s) => s.mcpId)).size}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {new Set(allSkills.map((s) => s.category)).size}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 bg-secondary/50 pl-10 border-transparent focus:border-border text-sm"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors capitalize",
                  selectedCategory === category
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {category === "all" ? "All Categories" : category}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl",
                        skill.isActive ? "bg-accent/20" : "bg-secondary"
                      )}
                    >
                      <Boxes
                        className={cn(
                          "h-5 w-5",
                          skill.isActive ? "text-accent" : "text-muted-foreground"
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">
                          {skill.name}
                        </h3>
                        {skill.isActive && (
                          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        From {skill.mcpName}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      categoryColors[skill.category] || categoryColors.Custom,
                      "border-transparent font-medium"
                    )}
                  >
                    {skill.category}
                  </Badge>
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  {skill.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Server className="h-3.5 w-3.5" />
                  <span>Used by {skill.usedByAgents.length} agent(s)</span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {skill.isActive ? "Active" : "Inactive"}
                    </span>
                    <Switch checked={skill.isActive} />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSkills.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Boxes className="mb-4 h-10 w-10 text-muted-foreground" />
              <h3 className="text-sm font-medium text-foreground">
                No skills found
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Try adjusting your search or create a new skill
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Skill Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle>Create New Skill</DialogTitle>
            <DialogDescription>
              Package an MCP capability as a reusable skill for your agents
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Select MCP
              </label>
              <p className="text-sm text-muted-foreground">
                Choose an MCP to create a skill from
              </p>
              <div className="mt-3 grid max-h-64 gap-2 overflow-y-auto">
                {mcpServers
                  .filter((m) => m.isInstalled)
                  .map((mcp) => (
                    <button
                      key={mcp.id}
                      type="button"
                      onClick={() => setSelectedMCP(mcp.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                        selectedMCP === mcp.id
                          ? "border-accent bg-accent/10"
                          : "border-border bg-secondary/50 hover:border-accent/50"
                      )}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Server className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{mcp.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {mcp.shortDescription}
                        </p>
                      </div>
                      {selectedMCP === mcp.id && (
                        <Check className="h-5 w-5 text-accent" />
                      )}
                    </button>
                  ))}
              </div>
            </div>

            {selectedMCPData && (
              <div>
                <label className="text-sm font-medium text-foreground">
                  Select Capability
                </label>
                <p className="text-sm text-muted-foreground">
                  Choose a capability to package as a skill
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {selectedMCPData.capabilities.map((capability) => (
                    <button
                      key={capability}
                      type="button"
                      className="flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-3 text-left transition-colors hover:border-accent/50 hover:bg-accent/10"
                    >
                      <Boxes className="h-5 w-5 text-accent" />
                      <span className="font-medium text-foreground">
                        {capability}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={!selectedMCP}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              Create Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}

