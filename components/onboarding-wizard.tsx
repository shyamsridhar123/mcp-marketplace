"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  Circle,
  Sparkles,
  Link2,
  Cpu,
  Shield,
  ArrowRight,
  X,
  PartyPopper,
  Rocket,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: typeof Sparkles
  href: string
  actionLabel: string
  isCompleted: boolean
}

interface OnboardingWizardProps {
  installedMcpCount: number
  activeAgentCount: number
  skillCount: number
  policyCount: number
  onDismiss: () => void
}

export function OnboardingWizard({
  installedMcpCount,
  activeAgentCount,
  skillCount,
  policyCount,
  onDismiss,
}: OnboardingWizardProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const steps: OnboardingStep[] = [
    {
      id: "discover",
      title: "Install your first integration",
      description: "Browse the marketplace and connect an MCP to your workspace",
      icon: Sparkles,
      href: "/",
      actionLabel: "Browse Marketplace",
      isCompleted: installedMcpCount > 0,
    },
    {
      id: "connect",
      title: "Create an AI agent",
      description: "Set up an agent to automate tasks using your integrations",
      icon: Cpu,
      href: "/agents",
      actionLabel: "Create Agent",
      isCompleted: activeAgentCount > 0,
    },
    {
      id: "orchestrate",
      title: "Configure agent skills",
      description: "Give your agent specific capabilities from your MCPs",
      icon: Link2,
      href: "/skills",
      actionLabel: "Manage Skills",
      isCompleted: skillCount > 0,
    },
    {
      id: "govern",
      title: "Set up governance",
      description: "Create policies to control data access and compliance",
      icon: Shield,
      href: "/governance",
      actionLabel: "Create Policy",
      isCompleted: policyCount > 0,
    },
  ]

  const completedCount = steps.filter((s) => s.isCompleted).length
  const progress = (completedCount / steps.length) * 100
  const allCompleted = completedCount === steps.length
  const currentStep = steps.find((s) => !s.isCompleted)

  // Show celebration when all steps complete
  useEffect(() => {
    if (allCompleted && !showCelebration) {
      setShowCelebration(true)
      // Auto-hide celebration after 5 seconds
      setTimeout(() => setShowCelebration(false), 5000)
    }
  }, [allCompleted, showCelebration])

  if (allCompleted && !showCelebration) {
    return null
  }

  if (showCelebration) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-accent/50 bg-gradient-to-br from-accent/20 via-background to-background p-6">
        <button
          type="button"
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20">
            <PartyPopper className="h-8 w-8 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground">
              🎉 You're all set up!
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Congratulations! You've completed the setup. Your AI workspace is ready to go.
            </p>
          </div>
          <Button onClick={onDismiss} className="gap-2">
            <Rocket className="h-4 w-4" />
            Start Building
          </Button>
        </div>
      </div>
    )
  }

  if (isMinimized) {
    return (
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/30"
        onClick={() => setIsMinimized(false)}
      >
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8">
            <svg className="h-8 w-8 -rotate-90 transform">
              <circle
                cx="16"
                cy="16"
                r="12"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="3"
              />
              <circle
                cx="16"
                cy="16"
                r="12"
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="3"
                strokeDasharray={75.4}
                strokeDashoffset={75.4 - (75.4 * progress) / 100}
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground">
              {completedCount}/{steps.length}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Getting Started</p>
            <p className="text-xs text-muted-foreground">
              {currentStep ? currentStep.title : "Almost there!"}
            </p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </button>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
            <Rocket className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Welcome to Nexus!
            </h3>
            <p className="text-sm text-muted-foreground">
              Complete these steps to set up your AI workspace
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-accent/10 text-accent">
            {completedCount}/{steps.length} completed
          </Badge>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setIsMinimized(true)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-secondary">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="divide-y divide-border">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const isNext = !step.isCompleted && steps.slice(0, index).every((s) => s.isCompleted)

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-4 p-4 transition-colors",
                step.isCompleted && "bg-emerald-500/5",
                isNext && "bg-accent/5"
              )}
            >
              {/* Step Status Icon */}
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                  step.isCompleted
                    ? "bg-emerald-500/20"
                    : isNext
                      ? "bg-accent/20"
                      : "bg-secondary"
                )}
              >
                {step.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <StepIcon
                    className={cn(
                      "h-5 w-5",
                      isNext ? "text-accent" : "text-muted-foreground"
                    )}
                  />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4
                    className={cn(
                      "text-sm font-medium",
                      step.isCompleted
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    )}
                  >
                    {step.title}
                  </h4>
                  {isNext && (
                    <Badge className="bg-accent text-accent-foreground text-[10px] px-1.5">
                      Next
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </p>
              </div>

              {/* Action Button */}
              {!step.isCompleted && (
                <Link href={step.href}>
                  <Button
                    variant={isNext ? "default" : "outline"}
                    size="sm"
                    className="shrink-0 gap-1"
                  >
                    {step.actionLabel}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {/* Skip Option */}
      <div className="border-t border-border p-3 text-center">
        <button
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          onClick={onDismiss}
        >
          Skip setup guide
        </button>
      </div>
    </div>
  )
}

// Celebration animation component
export function CelebrationConfetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10px",
            animationDelay: `${Math.random() * 0.5}s`,
            backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
            width: "8px",
            height: "8px",
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
          }}
        />
      ))}
    </div>
  )
}

