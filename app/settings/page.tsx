"use client"

import Link from "next/link"
import {
  User,
  Building,
  Bell,
  Shield,
  Key,
  Globe,
  Palette,
  Save,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { AppShell } from "@/components/app-shell"

const navItems = [
  { href: "/", label: "Integrations" },
  { href: "/agents", label: "Agents" },
  { href: "/skills", label: "Skills" },
  { href: "/governance", label: "Governance" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
]

export default function SettingsPage() {
  return (
    <AppShell>
      {/* Header Navigation */}
      <header className="sticky top-12 z-40 border-b border-border bg-background">
        <div className="flex h-12 items-center justify-between px-6">
          <nav className="flex items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-3.5 text-sm font-medium transition-colors ${
                  item.href === "/settings"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {item.href === "/settings" && (
                  <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-foreground" />
                )}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2 text-xs bg-transparent"
            >
              Feedback
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-10">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Settings
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage your account and platform preferences
            </p>
          </div>

          {/* Divider */}
          <div className="mb-8 h-px bg-border" />

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-semibold text-foreground">
                  Profile
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Your personal information and account settings
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-xl font-semibold text-white">
                    AH
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Alex Haliburton
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Platform Admin
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Full Name
                    </label>
                    <Input
                      defaultValue="Alex Haliburton"
                      className="mt-1 bg-secondary/50 border-transparent focus:border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input
                      defaultValue="alex.h@company.com"
                      className="mt-1 bg-secondary/50 border-transparent focus:border-border"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Section */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-semibold text-foreground">
                  Organization
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Organization and team settings
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                  <div>
                    <p className="font-medium text-foreground">Acme Corp</p>
                    <p className="text-sm text-muted-foreground">
                      Enterprise Plan
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-accent/20 text-accent border-transparent"
                  >
                    Admin
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">
                    Department
                  </label>
                  <Input
                    defaultValue="Cloud Platform Team"
                    className="mt-1 bg-secondary/50 border-transparent focus:border-border"
                  />
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-semibold text-foreground">
                  Notifications
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Configure how you receive notifications
              </p>

              <div className="mt-6 space-y-4">
                {[
                  {
                    label: "Integration approval requests",
                    description:
                      "Get notified when new integrations require approval",
                    enabled: true,
                  },
                  {
                    label: "Agent status changes",
                    description: "Notifications when agents change status",
                    enabled: true,
                  },
                  {
                    label: "Policy violations",
                    description: "Alerts for compliance and policy violations",
                    enabled: true,
                  },
                  {
                    label: "Weekly digest",
                    description: "Summary of platform activity",
                    enabled: false,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <Switch defaultChecked={item.enabled} />
                  </div>
                ))}
              </div>
            </div>

            {/* Security Section */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-semibold text-foreground">
                  Security
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Security and authentication settings
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Enabled via Authenticator App
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-500/20 text-emerald-400 border-transparent"
                  >
                    Active
                  </Badge>
                </div>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-transparent"
                >
                  <Key className="h-4 w-4" />
                  Manage API Keys
                </Button>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-semibold text-foreground">
                  Preferences
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Customize your experience
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Language</p>
                      <p className="text-sm text-muted-foreground">
                        English (US)
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Theme</p>
                      <p className="text-sm text-muted-foreground">Dark</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Change
                  </Button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
