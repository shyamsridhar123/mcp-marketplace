"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Bell,
  LayoutDashboard,
  Store,
  Bot,
  Sparkles,
  Workflow,
  Shield,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

interface AppShellProps {
  children: ReactNode
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "marketplace", label: "Marketplace", icon: Store, href: "/marketplace" },
  { id: "agents", label: "Agents", icon: Bot, href: "/agents" },
  { id: "skills", label: "Skills", icon: Sparkles, href: "/skills" },
  { id: "orchestration", label: "Orchestration", icon: Workflow, href: "/canvas" },
  { id: "governance", label: "Governance", icon: Shield, href: "/governance" },
  { id: "intelligence", label: "Intelligence", icon: Brain, href: "/intelligence" },
]

const recentActivity = [
  { id: 1, message: "Work IQ Mail MCP activated", time: "2m ago", status: "success" },
  { id: 2, message: "Sales Rep Agent deployed", time: "15m ago", status: "success" },
  { id: 3, message: "HR Blueprint submitted for review", time: "1h ago", status: "info" },
  { id: 4, message: "Compliance violation detected", time: "2h ago", status: "warning" },
]

function getBreadcrumbs(pathname: string): Array<{ label: string; href: string }> {
  const crumbs: Array<{ label: string; href: string }> = [
    { label: "EY AI Agent Hub", href: "/" },
  ]
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length === 0) return crumbs

  const segmentLabels: Record<string, string> = {
    marketplace: "Marketplace", agents: "Agents", skills: "Skills",
    canvas: "Orchestration", governance: "Governance", intelligence: "Intelligence",
    analytics: "Analytics", settings: "Settings", mcp: "MCP", "21st": "21st Assistant",
  }

  let path = ""
  for (const seg of segments) {
    path += `/${seg}`
    const label = segmentLabels[seg] || seg.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    crumbs.push({ label, href: path })
  }
  return crumbs
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [showActivityFeed, setShowActivityFeed] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)

  useEffect(() => {
    const saved = localStorage.getItem("ey-sidebar-collapsed")
    if (saved !== null) setCollapsed(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (pathname === "/canvas") setCollapsed(true)
  }, [pathname])

  const toggleSidebar = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem("ey-sidebar-collapsed", JSON.stringify(next))
  }

  const getActiveId = () => {
    if (pathname === "/") return "dashboard"
    if (pathname.startsWith("/marketplace") || pathname.startsWith("/mcp")) return "marketplace"
    if (pathname.startsWith("/agents")) return "agents"
    if (pathname.startsWith("/skills")) return "skills"
    if (pathname === "/canvas") return "orchestration"
    if (pathname.startsWith("/governance")) return "governance"
    if (pathname.startsWith("/intelligence") || pathname.startsWith("/analytics")) return "intelligence"
    return null
  }

  const activeId = getActiveId()
  const breadcrumbs = getBreadcrumbs(pathname)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-screen flex flex-col border-r border-border bg-sidebar z-50 overflow-hidden"
      >
        {/* Logo */}
        <div className={cn("flex items-center gap-3 border-b border-border px-4 h-14 shrink-0", collapsed && "justify-center px-0")}>
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#FFE600] shrink-0">
            <span className="text-xs font-black text-[#1A1A24]">EY</span>
          </div>
          <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="truncate"
            >
              <p className="text-sm font-semibold text-foreground leading-tight">AI Agent Hub</p>
              <p className="text-[10px] text-muted-foreground">Enterprise Platform</p>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeId === item.id
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all relative",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-[#FFE600]/10 text-[#FFE600]"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-[#FFE600]" />
                )}
                <Icon className={cn("h-[18px] w-[18px] shrink-0", collapsed && "h-5 w-5")} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-2 space-y-0.5 shrink-0">
          <Link
            href="/settings"
            title={collapsed ? "Settings" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              collapsed && "justify-center px-0",
              pathname === "/settings" ? "bg-[#FFE600]/10 text-[#FFE600]" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Settings className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
          <button
            onClick={toggleSidebar}
            className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors w-full", collapsed && "justify-center px-0")}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
          <div className={cn("flex items-center gap-3 px-3 py-2", collapsed && "justify-center px-0")}>
            <div className="h-7 w-7 rounded-full bg-[#FFE600] flex items-center justify-center text-[10px] font-bold text-[#1A1A24] shrink-0">AH</div>
            {!collapsed && (
              <div className="truncate">
                <p className="text-xs font-medium text-foreground">Alex Haliburton</p>
                <p className="text-[10px] text-muted-foreground">Platform Admin</p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Area */}
      <motion.div
        animate={{ marginLeft: collapsed ? 64 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-1 flex flex-col"
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 shrink-0">
          <nav className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <div key={crumb.href} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-muted-foreground/40">/</span>}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-foreground font-medium">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors">{crumb.label}</Link>
                )}
              </div>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8"><Search className="h-4 w-4" /></Button>
            <div className="relative">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setShowActivityFeed(!showActivityFeed); if (!showActivityFeed) setUnreadCount(0) }}>
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF6B6B] text-[10px] font-medium text-white">{unreadCount}</span>}
              </Button>
              {showActivityFeed && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-card p-2 shadow-xl z-50">
                  <div className="mb-2 px-2 py-1"><h4 className="text-sm font-medium text-foreground">Recent Activity</h4></div>
                  <div className="space-y-1">
                    {recentActivity.map((a) => (
                      <div key={a.id} className="flex items-start gap-3 rounded-md px-2 py-2 hover:bg-secondary/50 transition-colors cursor-pointer">
                        <div className={cn("mt-0.5 h-2 w-2 rounded-full shrink-0", a.status === "success" && "bg-[#4CAF82]", a.status === "warning" && "bg-[#FFB547]", a.status === "info" && "bg-[#47C2E1]")} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{a.message}</p>
                          <p className="text-xs text-muted-foreground">{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </motion.div>
    </div>
  )
}
