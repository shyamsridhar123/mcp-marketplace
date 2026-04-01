'use client'

import React from "react"
import Link from 'next/link'
import {
  Cloud,
  Shield,
  Activity,
  Ticket,
  GitBranch,
  Database,
  MessageSquare,
  Lock,
  Sparkles,
  Users,
  ClipboardList,
  Briefcase,
  Trash2,
  Server,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { MCP } from '@/lib/types'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  cloud: Cloud,
  shield: Shield,
  activity: Activity,
  ticket: Ticket,
  'git-branch': GitBranch,
  database: Database,
  'message-square': MessageSquare,
  lock: Lock,
  sparkles: Sparkles,
  users: Users,
  'clipboard-list': ClipboardList,
  briefcase: Briefcase,
}

const categoryColors: Record<string, string> = {
  Infrastructure: 'bg-blue-100 text-blue-700',
  Compliance: 'bg-emerald-100 text-emerald-700',
  Analytics: 'bg-amber-100 text-amber-700',
  Communication: 'bg-pink-100 text-pink-700',
  Database: 'bg-cyan-100 text-cyan-700',
  Security: 'bg-red-100 text-red-700',
  DevOps: 'bg-orange-100 text-orange-700',
  'AI/ML': 'bg-[#47C2E1]/20 text-[#47C2E1]',
  Productivity: 'bg-indigo-100 text-indigo-700',
  Custom: 'bg-gray-100 text-gray-700',
}

interface MCPCardProps {
  mcp: MCP
  variant?: 'default' | 'compact'
}

export function MCPCard({ mcp, variant = 'default' }: MCPCardProps) {
  const Icon = iconMap[mcp.icon] || Server
  const isComingSoon = mcp.status === 'pending'

  if (variant === 'compact') {
    return (
      <Link href={`/mcp/${mcp.id}`} className="block">
        <div className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-medium text-card-foreground">{mcp.name}</h3>
              {mcp.isInstalled && (
                <span className="flex h-2 w-2 rounded-full bg-primary" />
              )}
            </div>
            <p className="truncate text-sm text-muted-foreground">{mcp.shortDescription}</p>
          </div>
          <Badge variant="secondary" className={cn('shrink-0 font-medium', categoryColors[mcp.category])}>
            {mcp.category}
          </Badge>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/mcp/${mcp.id}`} className="block">
      <div className="group flex h-full flex-col rounded-lg border border-border bg-card transition-all hover:shadow-md">
        {/* Card Header */}
        <div className="flex items-start gap-3 p-4 pb-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{mcp.name}</h3>
              {mcp.isInstalled && (
                <span className="flex h-2.5 w-2.5 rounded-full bg-primary" />
              )}
            </div>
            <Badge 
              variant="secondary" 
              className={cn(
                'mt-1 font-medium text-xs',
                isComingSoon ? 'bg-primary/10 text-primary' : categoryColors[mcp.category]
              )}
            >
              {isComingSoon ? 'coming soon' : mcp.category}
            </Badge>
          </div>
        </div>

        {/* Card Body - only show for installed items */}
        <div className="flex-1" />

        {/* Card Footer */}
        <div className="border-t border-border p-4 pt-3">
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80"
          >
            <Trash2 className="h-4 w-4" />
            <span>REMOVE</span>
          </button>
        </div>
      </div>
    </Link>
  )
}

