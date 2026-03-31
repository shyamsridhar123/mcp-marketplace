"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Bell,
  HelpCircle,
  Store,
  Bot,
  Sparkles,
  Workflow,
  Shield,
  Brain,
  Settings,
  Activity,
} from "lucide-react"
import { useState, useEffect } from "react"

interface AppShellProps {
  children: ReactNode
}

// 6-pillar navigation: Marketplace → Agents → Skills → Orchestration → Governance → Intelligence
const navGroups = [
  {
    id: "marketplace",
    label: "Marketplace",
    icon: Store,
    description: "Discover MCPs & Work IQ",
    items: [{ href: "/", label: "MCP Catalog", icon: Sparkles }],
  },
  {
    id: "agents",
    label: "Agents",
    icon: Bot,
    description: "Agent lifecycle",
    items: [{ href: "/agents", label: "Agent Registry" }],
  },
  {
    id: "skills",
    label: "Skills",
    icon: Sparkles,
    description: "Capability packages",
    items: [{ href: "/skills", label: "Skill Library" }],
  },
  {
    id: "orchestration",
    label: "Orchestration",
    icon: Workflow,
    description: "Visual composition",
    items: [
      { href: "/canvas", label: "Connection Canvas", icon: Activity },
    ],
  },
  {
    id: "governance",
    label: "Governance",
    icon: Shield,
    description: "Policies & compliance",
    items: [{ href: "/governance", label: "Policies & Compliance" }],
  },
  {
    id: "intelligence",
    label: "Intelligence",
    icon: Brain,
    description: "Work IQ & analytics",
    items: [
      { href: "/intelligence", label: "Work IQ Dashboard" },
      { href: "/analytics", label: "Analytics" },
    ],
  },
]

const settingsItem = { href: "/settings", label: "Settings", icon: Settings }

// Activity feed with Agent 365 activities
const recentActivity = [
  { id: 1, type: "install", message: "Work IQ Mail MCP activated", time: "2m ago", status: "success" },
  { id: 2, type: "agent", message: "Knowledge Worker Agent deployed", time: "15m ago", status: "success" },
  { id: 3, type: "policy", message: "HR Onboarding Blueprint submitted for review", time: "1h ago", status: "info" },
  { id: 4, type: "alert", message: "Compliance Sentinel detected policy violation", time: "2h ago", status: "warning" },
  { id: 5, type: "agent", message: "DevOps Agent MCP access request pending", time: "3h ago", status: "info" },
]

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const [showActivityFeed, setShowActivityFeed] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)

  // Determine active nav group for 6-pillar nav
  const getActiveGroup = () => {
    if (pathname === "/" || pathname.startsWith("/mcp")) return "marketplace"
    if (pathname.startsWith("/agents")) return "agents"
    if (pathname.startsWith("/skills")) return "skills"
    if (pathname === "/canvas") return "orchestration"
    if (pathname.startsWith("/governance")) return "governance"
    if (pathname.startsWith("/intelligence") || pathname.startsWith("/analytics")) return "intelligence"
    return null
  }

  const activeGroup = getActiveGroup()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Brand Bar */}
      <div className="flex h-12 items-center justify-between border-b border-border bg-background px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-violet-600 transition-transform group-hover:scale-105">
              <span className="text-xs font-bold text-white">N</span>
            </div>
            <span className="text-sm font-semibold text-foreground">Nexus</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Acme Corp</span>
            <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
              Enterprise
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-2 text-xs bg-transparent">
            Feedback
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => {
                setShowActivityFeed(!showActivityFeed)
                if (!showActivityFeed) setUnreadCount(0)
              }}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
            
            {/* Activity Feed Dropdown */}
            {showActivityFeed && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card p-2 shadow-xl z-50">
                <div className="mb-2 px-2 py-1">
                  <h4 className="text-sm font-medium text-foreground">Recent Activity</h4>
                </div>
                <div className="space-y-1">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <div className={cn(
                        "mt-0.5 h-2 w-2 rounded-full shrink-0",
                        activity.status === "success" && "bg-emerald-500",
                        activity.status === "warning" && "bg-amber-500",
                        activity.status === "info" && "bg-blue-500"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 border-t border-border pt-2">
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    View all activity
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 ring-2 ring-background" />
        </div>
      </div>

      {/* Task-Oriented Navigation */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-6">
          <nav className="flex items-center gap-1">
            {navGroups.map((group, index) => {
              const isActive = activeGroup === group.id
              const GroupIcon = group.icon
              
              return (
                <div key={group.id} className="flex items-center">
                  {index > 0 && (
                    <div className="mx-2 flex items-center text-muted-foreground/30">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  <div className="relative group">
                    <Link
                      href={group.items[0].href}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                        isActive
                          ? "bg-accent/15 text-accent"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <GroupIcon className="h-4 w-4" />
                      <span>{group.label}</span>
                      {isActive && (
                        <span className="ml-1 h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                      )}
                    </Link>
                    
                    {/* Dropdown for sub-items */}
                    {group.items.length > 1 && (
                      <div className="invisible absolute left-0 top-full pt-1 opacity-0 transition-all group-hover:visible group-hover:opacity-100 z-50">
                        <div className="rounded-lg border border-border bg-card p-1 shadow-lg min-w-[160px]">
                          {group.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={cn(
                                "block rounded-md px-3 py-2 text-sm transition-colors",
                                pathname === item.href
                                  ? "bg-accent/15 text-accent"
                                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                              )}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </nav>

          {/* Settings */}
          <Link
            href={settingsItem.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/settings"
                ? "bg-accent/15 text-accent"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
