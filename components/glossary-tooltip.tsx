"use client"

import { useState, type ReactNode } from "react"
import { HelpCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

// Glossary definitions for consistent terminology
const glossary: Record<string, { term: string; definition: string; example?: string }> = {
  mcp: {
    term: "MCP (Model Context Protocol)",
    definition: "A standardized way to connect AI agents to external tools and data sources. MCPs provide capabilities that agents can use as skills.",
    example: "The GitHub MCP lets agents read repositories and create pull requests.",
  },
  integration: {
    term: "Integration",
    definition: "An MCP that connects your workspace to an external service. Think of it as a bridge between your AI agents and tools like GitHub, Slack, or databases.",
    example: "Installing the Slack integration lets agents send messages to channels.",
  },
  agent: {
    term: "Agent",
    definition: "An AI assistant configured for a specific purpose. Agents use skills from MCPs to perform tasks autonomously.",
    example: "A Support Agent can use Zendesk and Slack MCPs to handle customer tickets.",
  },
  skill: {
    term: "Skill",
    definition: "A specific capability that an agent can use, derived from an MCP. Skills are the building blocks of what agents can do.",
    example: "The 'Search Code' skill from GitHub MCP lets agents find relevant code.",
  },
  capability: {
    term: "Capability",
    definition: "A feature offered by an MCP that can be packaged as a skill. Each MCP has multiple capabilities.",
    example: "MongoDB MCP has capabilities like 'Query Data' and 'Create Documents'.",
  },
  policy: {
    term: "Governance Policy",
    definition: "Rules that control how MCPs and agents operate. Policies ensure compliance with security and data requirements.",
    example: "A policy can require all MCPs accessing customer data to be encrypted.",
  },
  "data-classification": {
    term: "Data Classification",
    definition: "A label indicating the sensitivity level of data an MCP can access. Helps ensure appropriate security controls.",
    example: "Public, Internal, Confidential, or Restricted data levels.",
  },
  "compliance-level": {
    term: "Compliance Level",
    definition: "An MCP's adherence to security and regulatory standards. Higher levels indicate stricter compliance.",
    example: "High compliance means SOC2, HIPAA, and GDPR certified.",
  },
}

interface GlossaryTooltipProps {
  term: keyof typeof glossary
  children?: ReactNode
  className?: string
  showIcon?: boolean
}

export function GlossaryTooltip({
  term,
  children,
  className,
  showIcon = true,
}: GlossaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const entry = glossary[term]

  if (!entry) {
    return <>{children}</>
  }

  return (
    <span className={cn("relative inline-flex items-center gap-1", className)}>
      {children}
      {showIcon && (
        <button
          type="button"
          className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        >
          <HelpCircle className="h-3 w-3" />
        </button>
      )}

      {isOpen && (
        <div className="absolute bottom-full left-0 z-50 mb-2 w-72 rounded-lg border border-border bg-card p-4 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="mb-2 flex items-start justify-between">
            <h4 className="text-sm font-semibold text-foreground">{entry.term}</h4>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <p className="mb-2 text-sm text-muted-foreground">{entry.definition}</p>
          {entry.example && (
            <div className="rounded-md bg-secondary/50 p-2">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Example:</span> {entry.example}
              </p>
            </div>
          )}
        </div>
      )}
    </span>
  )
}

// Inline help component for contextual learning
interface InlineHelpProps {
  topic: keyof typeof glossary
}

export function InlineHelp({ topic }: InlineHelpProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const entry = glossary[topic]

  if (!entry) return null

  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-border p-3 transition-all",
        isExpanded ? "bg-secondary/30" : "bg-transparent hover:bg-secondary/20"
      )}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-foreground">
            What is {entry.term.split("(")[0].trim()}?
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {isExpanded ? "Hide" : "Learn more"}
        </span>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-sm text-muted-foreground">{entry.definition}</p>
          {entry.example && (
            <div className="rounded-md bg-background p-2 border border-border">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Example:</span> {entry.example}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
