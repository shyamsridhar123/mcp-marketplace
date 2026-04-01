"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { Command, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { HUB_CHAT_QUERY_PARAM } from "@/lib/21st"
import { cn } from "@/lib/utils"

const HubAssistantSurface = dynamic(
  () =>
    import("@/components/hub-assistant-surface").then(
      (module) => module.HubAssistantSurface,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[520px] items-center justify-center bg-[#11131c]/95 text-sm text-slate-400">
        Loading chat…
      </div>
    ),
  },
)

function updateChatQuery(nextOpen: boolean) {
  if (typeof window === "undefined") {
    return
  }

  const url = new URL(window.location.href)

  if (nextOpen) {
    url.searchParams.set(HUB_CHAT_QUERY_PARAM, "1")
  } else {
    url.searchParams.delete(HUB_CHAT_QUERY_PARAM)
  }

  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`)
}

export function HubAssistantLauncher() {
  const panelRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [hasLoadedSurface, setHasLoadedSurface] = useState(false)

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search)
      const nextOpen = params.get(HUB_CHAT_QUERY_PARAM) === "1"

      setIsOpen(nextOpen)

      if (nextOpen) {
        setHasLoadedSurface(true)
      }
    }

    syncFromUrl()
    window.addEventListener("popstate", syncFromUrl)

    return () => {
      window.removeEventListener("popstate", syncFromUrl)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    panelRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k"

      if (isShortcut) {
        event.preventDefault()
        setHasLoadedSurface(true)
        setIsOpen(true)
        updateChatQuery(true)
        return
      }

      if (event.key === "Escape" && isOpen) {
        event.preventDefault()
        setIsOpen(false)
        updateChatQuery(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const openChat = () => {
    setHasLoadedSurface(true)
    setIsOpen(true)
    updateChatQuery(true)
  }

  const closeChat = () => {
    setIsOpen(false)
    updateChatQuery(false)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="hidden h-10 min-w-[320px] justify-between rounded-full border-white/8 bg-card/70 px-4 text-muted-foreground shadow-sm hover:bg-card md:flex"
          aria-label="Open hub chat"
          onMouseEnter={() => setHasLoadedSurface(true)}
          onFocus={() => setHasLoadedSurface(true)}
          onClick={openChat}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0 text-[#FFE600]" />
            <span className="truncate">Ask the Hub about agents, MCPs, or approvals…</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/8 bg-background/70 px-2 py-0.5 text-[10px] font-medium text-slate-400">
            <Command className="h-3 w-3" />
            Ctrl K
          </span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:hidden"
          aria-label="Open hub chat"
          onClick={openChat}
        >
          <Sparkles className="h-4 w-4 text-[#FFE600]" />
        </Button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 md:bg-black/25",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        onClick={closeChat}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hub-chat-title"
        tabIndex={-1}
        className={cn(
          "fixed inset-x-3 bottom-3 top-16 z-50 outline-none transition-all duration-200 md:inset-x-auto md:bottom-auto md:right-6 md:top-16 md:w-[460px] md:max-w-[calc(100vw-17rem)]",
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0",
        )}
      >
        <div className="h-full overflow-hidden rounded-[28px] border border-white/10 bg-[#11131c]/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:h-[min(78vh,760px)]">
          {hasLoadedSurface ? <HubAssistantSurface active={isOpen} onClose={closeChat} /> : null}
        </div>
      </div>
    </>
  )
}

