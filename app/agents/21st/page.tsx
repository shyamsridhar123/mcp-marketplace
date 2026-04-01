"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
import type { Chat } from "@ai-sdk/react"
import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import {
  AlertCircle,
  Bot,
  Loader2,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react"

import "@21st-sdk/react/styles.css"

import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TWENTY_FIRST_AGENT_NAME,
  TWENTY_FIRST_AGENT_ROUTE,
  TWENTY_FIRST_AGENT_SAMPLE_PROMPTS,
  TWENTY_FIRST_AGENT_SLUG,
} from "@/lib/21st"

function ConversationPanel({ sandboxId }: { sandboxId: string }) {
  const chat = useMemo(
    () =>
      createAgentChat({
        agent: TWENTY_FIRST_AGENT_SLUG,
        tokenUrl: "/api/agent/token",
        sandboxId,
      }),
    [sandboxId],
  )

  const { messages, sendMessage, status, stop, error } = useChat({
    chat: chat as Chat<UIMessage>,
  })

  const isBusy = status === "submitted" || status === "streaming"

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {TWENTY_FIRST_AGENT_SAMPLE_PROMPTS.map((prompt) => (
          <Button
            key={prompt}
            type="button"
            variant="outline"
            size="sm"
            className="border-[#FFE600]/20 bg-card/60 text-xs text-muted-foreground hover:border-[#FFE600]/40 hover:bg-[#FFE600]/10 hover:text-foreground"
            disabled={isBusy}
            onClick={() => {
              void sendMessage({ text: prompt })
            }}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#FFE600]" />
            {prompt}
          </Button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <AgentChat
          messages={messages}
          onSend={(message) => {
            void sendMessage({ text: message.content })
          }}
          status={status}
          onStop={stop}
          error={error ?? undefined}
          colorMode="dark"
        />
      </div>
    </div>
  )
}

export default function TwentyFirstAgentPage() {
  const [sandboxId, setSandboxId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function initializeSandbox() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/agent/sandbox", { method: "POST" })
        const data = (await response.json().catch(() => ({}))) as {
          sandboxId?: string
          error?: string
        }

        if (!response.ok || !data.sandboxId) {
          throw new Error(data.error ?? "Failed to initialize the 21st assistant sandbox.")
        }

        if (!isMounted) {
          return
        }

        setSandboxId(data.sandboxId)
      } catch (caughtError) {
        if (!isMounted) {
          return
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to initialize the 21st assistant sandbox.",
        )
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void initializeSandbox()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-[#FFE600]/20 bg-[#FFE600]/10 text-[#FFE600]">
                <Bot className="h-3.5 w-3.5" />
                Live 21st Agent
              </Badge>
              <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Server-side token exchange
              </Badge>
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {TWENTY_FIRST_AGENT_NAME}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Chat with a deployed 21st agent that understands the EY AI Agent Hub demo catalog —
                agents, MCP integrations, blueprints, approvals, and IQ signals — without exposing
                your API key to the browser.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <Link href="/agents">Back to Agents</Link>
            </Button>
            <Button asChild className="bg-foreground text-background hover:bg-foreground/90">
              <Link href={TWENTY_FIRST_AGENT_ROUTE}>
                <WandSparkles className="h-4 w-4" />
                Open Live Chat
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-foreground">What it can answer</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Platform overview, active agents, connected MCPs, blueprint requirements, pending
              approvals, and intelligence feed highlights.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-foreground">What stays server-side</p>
            <p className="mt-2 text-sm text-muted-foreground">
              The 21st API key is exchanged for a short-lived token on the server, so the browser
              never receives the secret directly.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-foreground">Data source</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Answers are grounded in the local EY Agent Hub demo dataset bundled with this repo,
              so the assistant behaves like a product-aware catalog guide instead of a generic bot.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-[#FFE600]" />
              Starting secure 21st sandbox…
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-red-400" />
              <div>
                <h2 className="text-sm font-medium text-foreground">The 21st assistant could not start</h2>
                <p className="mt-2 text-sm text-muted-foreground">{error}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  If this is your first run, the most common cause is that the agent has not been
                  deployed yet. Once deployed, refresh this page and the chat should connect.
                </p>
              </div>
            </div>
          </div>
        ) : sandboxId ? (
          <ConversationPanel sandboxId={sandboxId} />
        ) : null}
      </div>
    </AppShell>
  )
}