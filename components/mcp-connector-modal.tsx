'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { X, Check } from 'lucide-react'
import type { MCP } from '@/lib/types'

const categoryColors: Record<string, string> = {
  Infrastructure: 'bg-blue-100 text-blue-700',
  Compliance: 'bg-emerald-100 text-emerald-700',
  Analytics: 'bg-amber-100 text-amber-700',
  Communication: 'bg-pink-100 text-pink-700',
  Database: 'bg-cyan-100 text-cyan-700',
  Security: 'bg-red-100 text-red-700',
  DevOps: 'bg-orange-100 text-orange-700',
  'AI/ML': 'bg-purple-100 text-purple-700',
  Productivity: 'bg-indigo-100 text-indigo-700',
  Custom: 'bg-gray-100 text-gray-700',
  'coming soon': 'bg-primary/10 text-primary',
}

interface MCPConnectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mcps: MCP[]
}

export function MCPConnectorModal({ open, onOpenChange, mcps }: MCPConnectorModalProps) {
  const [selectedMCP, setSelectedMCP] = useState<string | null>(null)

  const handleConnect = () => {
    if (selectedMCP) {
      // Handle connection logic
      onOpenChange(false)
      setSelectedMCP(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-2xl font-semibold">MCP Connector</DialogTitle>
          <p className="text-muted-foreground">Select an integration from the catalog</p>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Select an Available MCP Server</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mcps.slice(0, 6).map((mcp) => {
              const isComingSoon = mcp.status === 'pending'
              const isSelected = selectedMCP === mcp.id
              
              return (
                <button
                  key={mcp.id}
                  type="button"
                  onClick={() => !isComingSoon && setSelectedMCP(mcp.id)}
                  disabled={isComingSoon}
                  className={cn(
                    'relative flex flex-col items-start p-4 rounded-lg border text-left transition-all',
                    isSelected 
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                      : 'border-border bg-card hover:border-muted-foreground/30',
                    isComingSoon && 'opacity-70 cursor-not-allowed'
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-foreground">{mcp.name}</h4>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        'text-xs font-medium',
                        isComingSoon ? categoryColors['coming soon'] : categoryColors[mcp.category]
                      )}
                    >
                      {isComingSoon ? 'coming soon' : mcp.category}
                    </Badge>
                    {mcp.isInstalled && (
                      <span className="flex h-2.5 w-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {mcp.shortDescription}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {mcp.capabilities.slice(0, 2).map((cap) => (
                      <span 
                        key={cap} 
                        className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                      >
                        {cap}
                      </span>
                    ))}
                    {mcp.capabilities.length > 2 && (
                      <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                        +{mcp.capabilities.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
        
        <div className="pt-4 border-t border-border">
          <Button 
            onClick={handleConnect}
            disabled={!selectedMCP}
            className="w-full"
            size="lg"
          >
            CONNECT TO MCP SERVER
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
