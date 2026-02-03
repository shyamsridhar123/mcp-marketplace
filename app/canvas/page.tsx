"use client"

import { AppShell } from "@/components/app-shell"
import { ConnectionCanvas } from "@/components/connection-canvas"
import { mcpServers, agentData } from "@/lib/data"

export default function CanvasPage() {
  return (
    <AppShell>
      <div className="flex-1 flex flex-col h-[calc(100vh-6.5rem)]">
        <ConnectionCanvas mcps={mcpServers} agents={agentData} />
      </div>
    </AppShell>
  )
}
