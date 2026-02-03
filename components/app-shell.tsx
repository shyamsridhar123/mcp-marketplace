"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Brand Bar */}
      <div className="flex h-12 items-center justify-between border-b border-border bg-background px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground">
              <span className="text-xs font-bold text-background">N</span>
            </div>
            <span className="text-sm font-medium text-foreground">/</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground">Acme Corp</span>
            <span className="rounded bg-accent/20 px-1.5 py-0.5 text-xs font-medium text-accent">
              Enterprise
            </span>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
