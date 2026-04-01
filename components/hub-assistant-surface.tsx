"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
import type { Chat } from "@ai-sdk/react"
import { useChat } from "@ai-sdk/react"
import type { ChatTheme } from "@21st-sdk/react"
import type { UIMessage } from "ai"
import {
  AlertCircle,
  Bot,
  Compass,
  Loader2,
  RefreshCcw,
  Sparkles,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  TWENTY_FIRST_AGENT_SAMPLE_PROMPTS,
  TWENTY_FIRST_AGENT_SLUG,
} from "@/lib/21st"

const assistantChatTheme: ChatTheme = {
  theme: {
    "--an-font-family": "Inter, system-ui, sans-serif",
    "--an-border-radius": "24px",
    "--an-message-border-radius": "18px",
    "--an-input-border-radius": "20px",
    "--an-user-message-padding": "12px 16px",
    "--an-input-padding": "14px 18px",
  },
  light: {
    "--an-background": "#11131c",
    "--an-background-secondary": "#171a25",
    "--an-background-tertiary": "#1d2030",
    "--an-foreground": "#f8fafc",
    "--an-foreground-muted": "#94a3b8",
    "--an-foreground-subtle": "#64748b",
    "--an-border-color": "rgba(255,255,255,0.08)",
    "--an-border-color-light": "rgba(255,255,255,0.05)",
    "--an-primary-color": "#ffe600",
    "--an-user-message-bg": "rgba(255,230,0,0.14)",
    "--an-input-background": "#0f1118",
    "--an-input-border-color": "rgba(255,255,255,0.08)",
    "--an-input-color": "#f8fafc",
    "--an-input-placeholder-color": "#7c8396",
    "--an-send-button-bg": "#ffe600",
    "--an-send-button-color": "#1a1a24",
    "--an-stop-button-bg": "#f8fafc",
    "--an-stop-button-color": "#11131c",
    "--an-tool-background": "#141722",
    "--an-tool-border-color": "rgba(255,255,255,0.08)",
    "--an-tool-color": "#f8fafc",
    "--an-tool-color-muted": "#94a3b8",
    "--an-code-background": "#0b0d12",
    "--an-code-color": "#e2e8f0",
  },
  dark: {
    "--an-background": "#11131c",
    "--an-background-secondary": "#171a25",
    "--an-background-tertiary": "#1d2030",
    "--an-foreground": "#f8fafc",
    "--an-foreground-muted": "#94a3b8",
    "--an-foreground-subtle": "#64748b",
    "--an-border-color": "rgba(255,255,255,0.08)",
    "--an-border-color-light": "rgba(255,255,255,0.05)",
    "--an-primary-color": "#ffe600",
    "--an-user-message-bg": "rgba(255,230,0,0.14)",
    "--an-input-background": "#0f1118",
    "--an-input-border-color": "rgba(255,255,255,0.08)",
    "--an-input-color": "#f8fafc",
    "--an-input-placeholder-color": "#7c8396",
    "--an-send-button-bg": "#ffe600",
    "--an-send-button-color": "#1a1a24",
    "--an-stop-button-bg": "#f8fafc",
    "--an-stop-button-color": "#11131c",
    "--an-tool-background": "#141722",
    "--an-tool-border-color": "rgba(255,255,255,0.08)",
    "--an-tool-color": "#f8fafc",
    "--an-tool-color-muted": "#94a3b8",
    "--an-code-background": "#0b0d12",
    "--an-code-color": "#e2e8f0",
  },
}

interface HubAssistantSurfaceProps {
  readonly active: boolean
  readonly onClose: () => void
}

function ConversationPanel({ sandboxId }: { readonly sandboxId: string }) {
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
  const showPrompts = messages.length === 0

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {showPrompts ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {TWENTY_FIRST_AGENT_SAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="flex min-w-0 items-start gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-left text-sm text-slate-300 transition-colors hover:border-[#FFE600]/30 hover:bg-[#FFE600]/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE600]/40"
              disabled={isBusy}
              onClick={() => {
                void sendMessage({ text: prompt })
              }}
            >
              <Sparkles aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#FFE600]" />
              <span className="min-w-0 text-pretty">{prompt}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-hidden rounded-[26px] border border-white/8 bg-[#0f1118]/90 shadow-inner">
        <AgentChat
          messages={messages}
          onSend={(message) => {
            void sendMessage({ text: message.content })
          }}
          status={status}
          onStop={stop}
          error={error ?? undefined}
          theme={assistantChatTheme}
          colorMode="dark"
          className="h-full min-h-[420px]"
          classNames={{
            root: "flex h-full min-h-[420px] flex-col",
            messageList: "min-h-0 flex-1 px-3 py-4 sm:px-4",
            inputBar: "border-t border-white/8 bg-[#0f1118]/95 px-3 py-3 sm:px-4",
          }}
        />
      </div>
    </div>
  )
}

export function HubAssistantSurface({ active, onClose }: HubAssistantSurfaceProps) {
  const [sandboxId, setSandboxId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const initializeSandbox = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/agent/sandbox", { method: "POST" })
      const data = (await response.json().catch(() => ({}))) as {
        sandboxId?: string
        error?: string
      }

      if (!response.ok || !data.sandboxId) {
        throw new Error(data.error ?? "Failed to start the chat session.")
      }

      setSandboxId(data.sandboxId)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to start the chat session.",
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!active || sandboxId || isLoading || error) {
      return
    }

    void initializeSandbox()
  }, [active, error, initializeSandbox, isLoading, sandboxId])

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#11131c]/95 text-white">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-32 rounded-full bg-[#FFE600]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-24 h-48 w-48 rounded-full bg-cyan-400/8 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4 border-b border-white/8 px-5 py-4">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#FFE600]/20 bg-[#FFE600]/10 px-2.5 py-1 text-[11px] font-medium text-[#FFE600]">
              <Bot aria-hidden="true" className="h-3 w-3" />
              Ask the Hub
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
              <Compass aria-hidden="true" className="h-3 w-3" />
              Agents, MCPs & approvals
            </span>
          </div>

          <div>
            <h2 id="hub-chat-title" className="text-lg font-semibold text-white text-balance">
              Find what you need without leaving the page
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Ask for a quick overview, trace a connection, or jump straight to the next thing that needs attention.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-full border border-white/8 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
          aria-label="Close hub chat"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
        {isLoading ? (
          <div
            aria-live="polite"
            className="flex min-h-[420px] flex-1 items-center justify-center rounded-[26px] border border-white/8 bg-white/[0.02]"
          >
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Loader2 className="h-4 w-4 animate-spin text-[#FFE600]" />
              Warming up your chat…
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[420px] flex-1 flex-col justify-center rounded-[26px] border border-red-500/20 bg-red-500/5 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-white">The chat did not start</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{error}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Try again in a moment. The first request can take a bit longer while the session wakes up.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 border-white/10 bg-white/[0.03] text-slate-100 hover:bg-white/[0.08]"
                  onClick={() => {
                    setError(null)
                    void initializeSandbox()
                  }}
                >
                  <RefreshCcw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        ) : sandboxId ? (
          <ConversationPanel sandboxId={sandboxId} />
        ) : (
          <div className="flex min-h-[420px] flex-1 items-center justify-center rounded-[26px] border border-white/8 bg-white/[0.02] text-sm text-slate-400">
            Open the chat to begin.
          </div>
        )}
      </div>
    </div>
  )
}
