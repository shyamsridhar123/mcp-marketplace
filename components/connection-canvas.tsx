"use client"

import { useState, useCallback, useRef, useEffect, useMemo, type JSX } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  Link2,
  Unlink,
  Eye,
  Settings2,
  GripVertical,
  Activity,
  Zap,
  MoreVertical,
  Trash2,
  Copy,
  ExternalLink,
  ChevronRight,
  X,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Workflow,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MCP, Agent, Skill } from "@/lib/types"

interface ConnectionCanvasProps {
  mcps: MCP[]
  agents: Agent[]
}

interface NodePosition {
  x: number
  y: number
}

type NodeType = "mcp" | "agent" | "skill" | "workiq"

interface CanvasNode {
  id: string
  type: NodeType
  name: string
  status?: string
  position: NodePosition
  connections: string[]
  data: MCP | Agent | Skill
}

interface DragState {
  isDragging: boolean
  nodeId: string | null
  startPos: NodePosition
  offset: NodePosition
}

interface ConnectionDragState {
  isDragging: boolean
  sourceId: string | null
  sourceType: NodeType | null
  currentPos: NodePosition | null
}

// Helper to get category color
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "Logging": "bg-[#FFE600]",
    "Database": "bg-orange-500",
    "DevTools": "bg-emerald-500",
    "Infrastructure": "bg-blue-500",
    "Compliance": "bg-pink-500",
    "Analytics": "bg-cyan-500",
    "Communication": "bg-yellow-500",
    "Security": "bg-red-500",
    "AI/ML": "bg-[#47C2E1]",
  }
  return colors[category] || "bg-gray-500"
}

// Helper to get status color
function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-emerald-500"
    case "inactive":
      return "bg-gray-500"
    case "training":
      return "bg-amber-500"
    case "pending":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

// Animated particles for connection lines
function AnimatedParticle({ pathId, delay = 0 }: { pathId: string; delay?: number }) {
  return (
    <circle r="4" fill="#a855f7">
      <animateMotion
        dur="3s"
        repeatCount="indefinite"
        begin={`${delay}s`}
      >
        <mpath href={`#${pathId}`} />
      </animateMotion>
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        dur="3s"
        repeatCount="indefinite"
        begin={`${delay}s`}
      />
    </circle>
  )
}

export function ConnectionCanvas({ mcps, agents }: ConnectionCanvasProps) {
  const [zoom, setZoom] = useState(1)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<NodeType | "all">("all")
  const [showConnections, setShowConnections] = useState(true)
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({})
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    nodeId: null,
    startPos: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
  })
  const [connectionDrag, setConnectionDrag] = useState<ConnectionDragState>({
    isDragging: false,
    sourceId: null,
    sourceType: null,
    currentPos: null,
  })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [showDetailPanel, setShowDetailPanel] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null)
  const [animateConnections, setAnimateConnections] = useState(true)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [pendingConnections, setPendingConnections] = useState<Array<{from: string, to: string}>>([])
  const [showConnectionModal, setShowConnectionModal] = useState<{sourceId: string, targetId: string} | null>(null)

  // Generate canvas nodes from data
  const generateNodes = useCallback((): CanvasNode[] => {
    const nodes: CanvasNode[] = []
    const installedMcps = mcps.filter(m => m.isInstalled && !m.isWorkIQ)
    const workIQMcps = mcps.filter(m => m.isWorkIQ && m.isInstalled)

    // Position Work IQ MCPs at the top-left with EY yellow styling
    workIQMcps.forEach((mcp, index) => {
      const savedPos = nodePositions[mcp.id]
      nodes.push({
        id: mcp.id,
        type: "workiq",
        name: mcp.name,
        status: 'activated',
        position: savedPos || { x: 100, y: 30 + index * 100 },
        connections: agents
          .filter(a => a.mcpConnections?.includes(mcp.id))
          .map(a => a.id),
        data: mcp,
      })
    })

    // Position MCPs on the left (below Work IQ nodes)
    const mcpYOffset = workIQMcps.length * 100 + 50
    installedMcps.forEach((mcp, index) => {
      const savedPos = nodePositions[mcp.id]
      // Include pending connections from agents to this MCP
      const pendingToThis = pendingConnections
        .filter(pc => pc.to === mcp.id || pc.from === mcp.id)
        .map(pc => pc.to === mcp.id ? pc.from : pc.to)
      
      nodes.push({
        id: mcp.id,
        type: "mcp",
        name: mcp.name,
        status: mcp.status,
        position: savedPos || { x: 100, y: mcpYOffset + index * 160 },
        connections: [
          ...agents
            .filter(a => a.mcpConnections?.includes(mcp.id))
            .map(a => a.id),
          ...pendingToThis,
        ],
        data: mcp,
      })
    })

    // Position Agents on the right
    agents.forEach((agent, index) => {
      const savedPos = nodePositions[agent.id]
      // Include pending connections from this agent
      const pendingFromThis = pendingConnections
        .filter(pc => pc.from === agent.id || pc.to === agent.id)
        .map(pc => pc.from === agent.id ? pc.to : pc.from)
      
      nodes.push({
        id: agent.id,
        type: "agent",
        name: agent.name,
        status: agent.status,
        position: savedPos || { x: 550, y: 100 + index * 180 },
        connections: [
          ...(agent.mcpConnections || []),
          ...pendingFromThis,
        ],
        data: agent,
      })
    })

    return nodes
  }, [mcps, agents, nodePositions, pendingConnections])

  const nodes = useMemo(() => generateNodes(), [generateNodes])

  // Handle node dragging
  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string, currentPos: NodePosition) => {
    if (e.button !== 0) return // Only left click
    e.stopPropagation()
    e.preventDefault()
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const scrollLeft = canvasRef.current?.scrollLeft || 0
    const scrollTop = canvasRef.current?.scrollTop || 0
    
    setDragState({
      isDragging: true,
      nodeId,
      startPos: currentPos,
      offset: {
        x: (e.clientX - rect.left + scrollLeft) / zoom - currentPos.x,
        y: (e.clientY - rect.top + scrollTop) / zoom - currentPos.y,
      },
    })
  }, [zoom])

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    // Handle panning
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      })
      return
    }

    // Get scroll position
    const scrollLeft = canvasRef.current?.scrollLeft || 0
    const scrollTop = canvasRef.current?.scrollTop || 0

    // Handle node dragging
    if (dragState.isDragging && dragState.nodeId) {
      const newX = (e.clientX - rect.left + scrollLeft) / zoom - dragState.offset.x
      const newY = (e.clientY - rect.top + scrollTop) / zoom - dragState.offset.y
      
      setNodePositions(prev => ({
        ...prev,
        [dragState.nodeId!]: { x: Math.max(0, newX), y: Math.max(0, newY) },
      }))
    }

    // Handle connection dragging
    if (connectionDrag.isDragging) {
      setConnectionDrag(prev => ({
        ...prev,
        currentPos: {
          x: (e.clientX - rect.left) / zoom,
          y: (e.clientY - rect.top) / zoom,
        },
      }))
    }
  }, [dragState, zoom, connectionDrag.isDragging, isPanning, panStart])

  const handleCanvasMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      nodeId: null,
      startPos: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
    })
    // Don't reset connection drag here - let the node handle it
    if (!connectionDrag.isDragging) {
      setIsPanning(false)
    }
    setIsPanning(false)
  }, [connectionDrag.isDragging])

  // Handle dropping a connection on a target node
  const handleConnectionDrop = useCallback((targetId: string, targetType: NodeType) => {
    if (!connectionDrag.isDragging || !connectionDrag.sourceId) return
    
    // Only allow MCP -> Agent or Agent -> MCP connections
    if (connectionDrag.sourceType === targetType) {
      // Same type - can't connect
      setConnectionDrag({
        isDragging: false,
        sourceId: null,
        sourceType: null,
        currentPos: null,
      })
      return
    }

    // Don't connect to self
    if (connectionDrag.sourceId === targetId) {
      setConnectionDrag({
        isDragging: false,
        sourceId: null,
        sourceType: null,
        currentPos: null,
      })
      return
    }

    // Show confirmation modal
    setShowConnectionModal({
      sourceId: connectionDrag.sourceId,
      targetId: targetId,
    })

    setConnectionDrag({
      isDragging: false,
      sourceId: null,
      sourceType: null,
      currentPos: null,
    })
  }, [connectionDrag])

  // Confirm and add the connection
  const confirmConnection = useCallback(() => {
    if (showConnectionModal) {
      setPendingConnections(prev => [...prev, {
        from: showConnectionModal.sourceId,
        to: showConnectionModal.targetId,
      }])
      setShowConnectionModal(null)
    }
  }, [showConnectionModal])

  // Handle canvas panning with middle mouse or space+drag
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault()
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }, [pan])

  // Start connection drag from a node's connection port
  const handleConnectionPortMouseDown = useCallback((e: React.MouseEvent, nodeId: string, nodeType: NodeType) => {
    e.stopPropagation()
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    setConnectionDrag({
      isDragging: true,
      sourceId: nodeId,
      sourceType: nodeType,
      currentPos: {
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom,
      },
    })
  }, [zoom])

  // Context menu
  const handleContextMenu = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY, nodeId })
  }, [])

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null)
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [contextMenu])

  // Filter nodes
  const filteredNodes = nodes.filter((node) => {
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || node.type === filterType
    return matchesSearch && matchesType
  })

  // Calculate canvas bounds for minimap
  const canvasBounds = useMemo(() => {
    if (nodes.length === 0) return { minX: 0, minY: 0, maxX: 800, maxY: 600 }
    const xs = nodes.map(n => n.position.x)
    const ys = nodes.map(n => n.position.y)
    return {
      minX: Math.min(...xs) - 50,
      minY: Math.min(...ys) - 50,
      maxX: Math.max(...xs) + 250,
      maxY: Math.max(...ys) + 200,
    }
  }, [nodes])

  // Render connection paths (returns just the elements, not the SVG wrapper)
  const renderConnectionPaths = () => {
    if (!showConnections) return null

    const lines: JSX.Element[] = []
    const renderedConnections = new Set<string>() // Track rendered connections to avoid duplicates

    nodes.forEach((node) => {
      node.connections.forEach((targetId) => {
        const targetNode = nodes.find((n) => n.id === targetId)
        if (!targetNode) return

        // Create a consistent key for this connection (sorted to avoid duplicates)
        const connectionKey = [node.id, targetId].sort().join('-')
        if (renderedConnections.has(connectionKey)) return
        renderedConnections.add(connectionKey)

        // Determine which is MCP/WorkIQ and which is Agent for consistent rendering
        const mcpNode = (node.type === "mcp" || node.type === "workiq") ? node : targetNode
        const agentNode = node.type === "agent" ? node : targetNode
        
        const mcpPos = nodePositions[mcpNode.id] || mcpNode.position
        const agentPos = nodePositions[agentNode.id] || agentNode.position

        // Offset for the node card (40px top offset + port position)
        const startX = mcpPos.x + 220 // MCP port is on the right
        const startY = mcpPos.y + 40 + 70 // 40px card offset + 70px to center
        const endX = agentPos.x // Agent port is on the left  
        const endY = agentPos.y + 40 + 70 // 40px card offset + 70px to center

        const isSelected = selectedNode === mcpNode.id || selectedNode === agentNode.id
        const isHovered = hoveredNode === mcpNode.id || hoveredNode === agentNode.id
        const midX = (startX + endX) / 2
        const pathId = `path-${connectionKey}`

        lines.push(
          <g key={connectionKey}>
            {/* Glow effect for selected/hovered */}
            {(isSelected || isHovered) && (
              <path
                d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                fill="none"
                stroke="#a855f7"
                strokeWidth={8}
                strokeOpacity={0.3}
              />
            )}
            {/* Main path - always visible with good contrast */}
            <path
              id={pathId}
              d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
              fill="none"
              stroke={isSelected || isHovered ? "#a855f7" : "#6b7280"}
              strokeWidth={isSelected || isHovered ? 3 : 2}
              strokeOpacity={isSelected || isHovered ? 1 : 0.6}
            />
            {/* Animated particles */}
            {animateConnections && (isSelected || isHovered) && (
              <>
                <AnimatedParticle pathId={pathId} delay={0} />
                <AnimatedParticle pathId={pathId} delay={1} />
                <AnimatedParticle pathId={pathId} delay={2} />
              </>
            )}
            {/* Connection midpoint indicator */}
            <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedNode(mcpNode.id); }}>
              <circle
                cx={midX}
                cy={(startY + endY) / 2}
                r={isSelected || isHovered ? 10 : 8}
                fill="#1f2937"
                stroke={isSelected || isHovered ? "#a855f7" : "#6b7280"}
                strokeWidth={2}
              />
              <circle
                cx={midX}
                cy={(startY + endY) / 2}
                r={3}
                fill={isSelected || isHovered ? "#a855f7" : "#9ca3af"}
              />
            </g>
          </g>
        )
      })
    })

    // Render connection being drawn
    if (connectionDrag.isDragging && connectionDrag.sourceId && connectionDrag.currentPos) {
      const sourceNode = nodes.find(n => n.id === connectionDrag.sourceId)
      if (sourceNode) {
        const sourcePos = nodePositions[sourceNode.id] || sourceNode.position
        const startX = connectionDrag.sourceType === "mcp" ? sourcePos.x + 220 : sourcePos.x
        const startY = sourcePos.y + 40 + 70 // Account for card offset
        
        // Get scroll position for accurate cursor tracking
        const scrollLeft = canvasRef.current?.scrollLeft || 0
        const scrollTop = canvasRef.current?.scrollTop || 0
        const endX = connectionDrag.currentPos.x + scrollLeft
        const endY = connectionDrag.currentPos.y + scrollTop
        const midX = (startX + endX) / 2

        lines.push(
          <g key="connection-drag">
            {/* Glow effect */}
            <path
              d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
              fill="none"
              stroke="#a855f7"
              strokeWidth={8}
              strokeOpacity={0.4}
            />
            {/* Main dashed line */}
            <path
              d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
              fill="none"
              stroke="#a855f7"
              strokeWidth={3}
              strokeDasharray="10 5"
            />
            {/* Endpoint circle */}
            <circle
              cx={endX}
              cy={endY}
              r={12}
              fill="#a855f7"
              fillOpacity={0.3}
            />
            <circle
              cx={endX}
              cy={endY}
              r={6}
              fill="#a855f7"
            />
          </g>
        )
      }
    }

    return <>{lines}</>
  }

  // Minimap component - positioned in top right for better visibility
  const renderMinimap = () => {
    const minimapWidth = 180
    const minimapHeight = 120
    
    // Calculate proper scale based on actual node positions
    const nodeXs = nodes.map(n => (nodePositions[n.id] || n.position).x)
    const nodeYs = nodes.map(n => (nodePositions[n.id] || n.position).y)
    const minX = Math.min(...nodeXs, 0)
    const minY = Math.min(...nodeYs, 0)
    const maxX = Math.max(...nodeXs, 800) + 250
    const maxY = Math.max(...nodeYs, 600) + 200
    
    const scaleX = (minimapWidth - 20) / (maxX - minX)
    const scaleY = (minimapHeight - 20) / (maxY - minY)
    const scale = Math.min(scaleX, scaleY)

    return (
      <div className="absolute top-4 right-4 rounded-xl border border-border bg-card/95 backdrop-blur-md p-3 shadow-xl z-20">
        <div className="text-xs font-semibold text-foreground mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Workflow className="h-3.5 w-3.5 text-accent" />
            Canvas Overview
          </span>
          <span className="text-muted-foreground font-normal">{nodes.length} nodes</span>
        </div>
        <svg width={minimapWidth} height={minimapHeight} className="rounded-lg bg-zinc-900 border border-zinc-700">
          {/* Draw connection lines in minimap - only from MCP nodes to avoid duplicates */}
          {nodes.filter(n => n.type === "mcp").map(node => {
            const pos = nodePositions[node.id] || node.position
            return node.connections.map(targetId => {
              const targetNode = nodes.find(n => n.id === targetId)
              if (!targetNode) return null
              const targetPos = nodePositions[targetId] || targetNode.position
              const x1 = (pos.x - minX) * scale + 10 + 20
              const y1 = (pos.y - minY) * scale + 10 + 6
              const x2 = (targetPos.x - minX) * scale + 10
              const y2 = (targetPos.y - minY) * scale + 10 + 6
              return (
                <line
                  key={`mini-${node.id}-${targetId}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#6b7280"
                  strokeWidth={1}
                  opacity={0.5}
                />
              )
            })
          })}
          {/* Draw nodes */}
          {nodes.map(node => {
            const pos = nodePositions[node.id] || node.position
            const x = (pos.x - minX) * scale + 10
            const y = (pos.y - minY) * scale + 10
            const isSelected = selectedNode === node.id
            return (
              <rect
                key={node.id}
                x={x}
                y={y}
                width={20}
                height={12}
                rx={2}
                fill={node.type === "workiq" ? "#7c3aed" : node.type === "mcp" ? "#a855f7" : "#22c55e"}
                opacity={isSelected ? 1 : 0.7}
                stroke={isSelected ? "#fff" : "none"}
                strokeWidth={1}
                className="cursor-pointer"
                onClick={() => setSelectedNode(node.id)}
              />
            )
          })}
        </svg>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Canvas Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-foreground">Connection Canvas</h2>
          <Badge variant="outline" className="text-muted-foreground">
            {nodes.length} nodes
          </Badge>
          <Badge variant="outline" className="text-muted-foreground gap-1">
            <Activity className="h-3 w-3 text-emerald-500" />
            {nodes.filter(n => n.status === "active").length} active
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-48 bg-secondary/50 pl-8 text-sm"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center rounded-lg border border-border bg-secondary/30">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 rounded-none rounded-l-lg text-xs",
                filterType === "all" && "bg-secondary"
              )}
              onClick={() => setFilterType("all")}
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 rounded-none text-xs",
                filterType === "mcp" && "bg-secondary"
              )}
              onClick={() => setFilterType("mcp")}
            >
              MCPs
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 rounded-none rounded-r-lg text-xs",
                filterType === "agent" && "bg-secondary"
              )}
              onClick={() => setFilterType("agent")}
            >
              Agents
            </Button>
          </div>

          <div className="h-4 w-px bg-border" />

          {/* View Controls */}
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", showConnections && "bg-secondary")}
            onClick={() => setShowConnections(!showConnections)}
            title="Toggle connections"
          >
            {showConnections ? (
              <Link2 className="h-4 w-4" />
            ) : (
              <Unlink className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", animateConnections && "bg-secondary")}
            onClick={() => setAnimateConnections(!animateConnections)}
            title="Toggle animations"
          >
            <Sparkles className="h-4 w-4" />
          </Button>

          <div className="h-4 w-px bg-border" />

          {/* Zoom Controls */}
          <div className="flex items-center rounded-lg border border-border bg-secondary/30">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none rounded-l-lg"
              onClick={() => setZoom(Math.max(0.25, zoom - 0.1))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center text-xs text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none rounded-r-lg"
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            title="Reset view"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Area - Interactive with drag and pan */}
      <div 
        ref={canvasRef}
        className={cn(
          "relative flex-1 overflow-auto bg-[radial-gradient(circle_at_center,_hsl(var(--border))_1px,_transparent_1px)] bg-[length:24px_24px]",
          isPanning && "cursor-grabbing",
          dragState.isDragging && "cursor-grabbing",
          connectionDrag.isDragging && "cursor-crosshair"
        )}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseDown={handleCanvasMouseDown}
        onMouseLeave={() => {
          if (!connectionDrag.isDragging) {
            handleCanvasMouseUp()
          }
        }}
      >
        {/* SVG layer for connections - rendered inside scrollable area */}
        <svg
          className="absolute pointer-events-none"
          style={{ 
            width: `${Math.max(canvasBounds.maxX + 50, 900)}px`,
            height: `${Math.max(canvasBounds.maxY + 50, 700)}px`,
            minWidth: '100%',
            minHeight: '100%',
          }}
        >
          {renderConnectionPaths()}
        </svg>
        
        {renderMinimap()}

        <div
          className="relative p-8"
          style={{ 
            minWidth: `${Math.max(canvasBounds.maxX + 50, 900)}px`,
            minHeight: `${Math.max(canvasBounds.maxY + 50, 700)}px`,
          }}
        >
          {/* MCP Column Label */}
          <div className="absolute left-24 top-8 text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-[#FFE600]" />
            Integrations (MCPs)
          </div>

          {/* Agent Column Label */}
          <div className="absolute left-[550px] top-8 text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-emerald-500" />
            Agents
          </div>

          {filteredNodes.map((node) => {
            const nodePos = nodePositions[node.id] || node.position
            const isSelected = selectedNode === node.id
            const isHovered = hoveredNode === node.id
            const isDragging = dragState.nodeId === node.id
            const isValidDropTarget = connectionDrag.isDragging && 
              connectionDrag.sourceId !== node.id && 
              connectionDrag.sourceType !== node.type

            return (
              <div
                key={node.id}
                className={cn(
                  "absolute w-[220px] rounded-xl border bg-card shadow-sm transition-all duration-200",
                  node.type === "workiq" && "bg-gradient-to-br from-[#FFE600]/10 to-background border-[#FFE600]/30",
                  isSelected
                    ? "border-accent ring-2 ring-accent/20 shadow-lg shadow-accent/10"
                    : node.type === "workiq" ? "border-[#FFE600]/30" : "border-border",
                  isHovered && !isSelected && "border-accent/50 shadow-md",
                  isDragging && "shadow-xl scale-105 z-50",
                  isValidDropTarget && "ring-2 ring-accent ring-offset-2 ring-offset-background border-accent"
                )}
                style={{
                  left: nodePos.x,
                  top: nodePos.y + 40,
                  cursor: isDragging ? "grabbing" : isValidDropTarget ? "pointer" : "grab",
                }}
                onClick={(e) => {
                  if (!dragState.isDragging) {
                    e.stopPropagation()
                    setSelectedNode(isSelected ? null : node.id)
                    setShowDetailPanel(true)
                  }
                }}
                onMouseUp={() => {
                  if (isValidDropTarget) {
                    handleConnectionDrop(node.id, node.type)
                  }
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onContextMenu={(e) => handleContextMenu(e, node.id)}
              >
                {/* Drag Handle */}
                <div 
                  className="absolute -left-0 top-0 bottom-0 w-6 flex items-center justify-center cursor-grab active:cursor-grabbing rounded-l-xl hover:bg-secondary/50 transition-colors"
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id, nodePos)}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                </div>

                {/* Connection Port - Right side for MCPs and WorkIQ */}
                {(node.type === "mcp" || node.type === "workiq") && (
                  <div 
                    className={cn(
                      "absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 bg-card flex items-center justify-center transition-all z-10",
                      connectionDrag.isDragging && connectionDrag.sourceType === "agent" 
                        ? "border-accent scale-125 bg-accent/20 animate-pulse cursor-pointer" 
                        : isSelected || isHovered 
                          ? "border-accent scale-110 cursor-crosshair" 
                          : "border-border cursor-crosshair"
                    )}
                    onMouseDown={(e) => handleConnectionPortMouseDown(e, node.id, node.type)}
                    onMouseUp={() => handleConnectionDrop(node.id, node.type)}
                    onMouseEnter={() => connectionDrag.isDragging && setHoveredNode(node.id)}
                    title={connectionDrag.isDragging ? "Drop here to connect" : "Drag to connect"}
                  >
                    <Zap className={cn(
                      "h-3 w-3",
                      connectionDrag.isDragging && connectionDrag.sourceType === "agent" 
                        ? "text-accent animate-pulse" 
                        : "text-accent"
                    )} />
                  </div>
                )}

                {/* Connection Port - Left side for Agents */}
                {node.type === "agent" && (
                  <div 
                    className={cn(
                      "absolute -left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 bg-card flex items-center justify-center transition-all z-10",
                      connectionDrag.isDragging && connectionDrag.sourceType === "mcp" 
                        ? "border-accent scale-125 bg-accent/20 animate-pulse cursor-pointer" 
                        : isSelected || isHovered 
                          ? "border-accent scale-110 cursor-crosshair" 
                          : "border-border cursor-crosshair"
                    )}
                    onMouseDown={(e) => handleConnectionPortMouseDown(e, node.id, node.type)}
                    onMouseUp={() => handleConnectionDrop(node.id, node.type)}
                    onMouseEnter={() => connectionDrag.isDragging && setHoveredNode(node.id)}
                    title={connectionDrag.isDragging ? "Drop here to connect" : "Drag to connect"}
                  >
                    <Zap className={cn(
                      "h-3 w-3",
                      connectionDrag.isDragging && connectionDrag.sourceType === "mcp" 
                        ? "text-accent animate-pulse" 
                        : "text-accent"
                    )} />
                  </div>
                )}

                <div className="p-4 pl-6">
                  {/* Node Header */}
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "h-3 w-3 rounded-full",
                          node.type === "workiq"
                            ? "bg-[#FFE600]"
                            : node.type === "mcp"
                              ? getCategoryColor((node.data as MCP).category)
                              : getStatusColor(node.status || "inactive")
                        )}
                      />
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase tracking-wider"
                      >
                        {node.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {node.status === "active" && (
                        <div className="flex items-center gap-1 text-emerald-500">
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                      )}
                      {node.status === "pending" && (
                        <div className="flex items-center gap-1 text-amber-500">
                          <Clock className="h-3 w-3" />
                        </div>
                      )}
                      {node.status === "training" && (
                        <div className="flex items-center gap-1 text-blue-500 animate-pulse">
                          <Sparkles className="h-3 w-3" />
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 hover:opacity-100"
                        onClick={(e) => { e.stopPropagation(); handleContextMenu(e as any, node.id); }}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Node Name */}
                  <h3 className="mb-1 text-sm font-semibold text-foreground truncate">
                    {node.name}
                  </h3>

                  {/* Node Meta */}
                  <p className="mb-3 text-xs text-muted-foreground truncate">
                    {(node.type === "mcp" || node.type === "workiq")
                      ? (node.data as MCP).provider
                      : (node.data as Agent).department}
                  </p>

                  {/* Stats Row */}
                  {node.type === "agent" && (
                    <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                        {((node.data as Agent).successRate * 100).toFixed(0)}%
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-blue-500" />
                        {(node.data as Agent).requestsHandled.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {/* Connection Count & Actions */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Link2 className="h-3 w-3" />
                      {node.connections.length} connection{node.connections.length !== 1 ? "s" : ""}
                    </span>
                    <Link
                      href={(node.type === "mcp" || node.type === "workiq") ? `/mcp/${node.id}` : `/agents/${node.id}`}
                      className="text-accent hover:underline flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                {/* Hover Quick Actions */}
                {isHovered && !isDragging && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-card border border-border rounded-full px-2 py-1 shadow-lg opacity-0 animate-in fade-in duration-200" style={{ opacity: 1 }}>
                    <Button variant="ghost" size="icon" className="h-6 w-6" title="View Details">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" title="Configure">
                      <Settings2 className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" title="Connect">
                      <Link2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <div 
            className="fixed z-50 bg-card border border-border rounded-lg shadow-xl py-1 min-w-[160px] animate-in fade-in zoom-in-95 duration-100"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2">
              <Eye className="h-4 w-4" /> View Details
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2">
              <Settings2 className="h-4 w-4" /> Configure
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2">
              <Link2 className="h-4 w-4" /> Add Connection
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2">
              <Copy className="h-4 w-4" /> Duplicate
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2">
              <ExternalLink className="h-4 w-4" /> Open in New Tab
            </button>
            <div className="h-px bg-border my-1" />
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-destructive/10 text-destructive flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Remove
            </button>
          </div>
        )}

        {/* Keyboard hints */}
        <div className="absolute bottom-4 right-6 text-[10px] text-muted-foreground/60 flex items-center gap-3">
          <span>Alt + Drag to pan</span>
          <span>•</span>
          <span>Scroll to zoom</span>
          <span>•</span>
          <span>Right-click for menu</span>
        </div>
      </div>


      {/* Enhanced Selection/Detail Panel */}
      {selectedNode && showDetailPanel && (
        <div className="border-t border-border bg-card">
          {(() => {
            const node = nodes.find((n) => n.id === selectedNode)
            if (!node) return null

            return (
              <div className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl",
                        node.type === "mcp"
                          ? getCategoryColor((node.data as MCP).category) + "/20"
                          : "bg-accent/20"
                      )}
                    >
                      <div
                        className={cn(
                          "h-6 w-6 rounded-lg",
                          node.type === "mcp"
                            ? getCategoryColor((node.data as MCP).category)
                            : "bg-accent"
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground text-lg">{node.name}</h4>
                        <Badge variant={node.status === "active" ? "default" : "secondary"} className="text-[10px]">
                          {node.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {node.type === "mcp"
                          ? (node.data as MCP).description
                          : (node.data as Agent).description}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setShowDetailPanel(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {node.type === "mcp" ? (
                    <>
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Version</p>
                        <p className="font-medium">{(node.data as MCP).version}</p>
                      </div>
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Downloads</p>
                        <p className="font-medium">{(node.data as MCP).downloads.toLocaleString()}</p>
                      </div>
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Rating</p>
                        <p className="font-medium">⭐ {(node.data as MCP).rating}</p>
                      </div>
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Compliance</p>
                        <p className="font-medium capitalize">{(node.data as MCP).complianceLevel}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Department</p>
                        <p className="font-medium">{(node.data as Agent).department}</p>
                      </div>
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                        <p className="font-medium text-emerald-500">{((node.data as Agent).successRate * 100).toFixed(1)}%</p>
                      </div>
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Requests</p>
                        <p className="font-medium">{(node.data as Agent).requestsHandled.toLocaleString()}</p>
                      </div>
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Skills</p>
                        <p className="font-medium">{(node.data as Agent).skills?.length || 0}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Capabilities/Skills */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">
                    {node.type === "mcp" ? "Capabilities" : "Connected MCPs"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {node.type === "mcp" 
                      ? (node.data as MCP).capabilities?.map((cap, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {cap}
                          </Badge>
                        ))
                      : (node.data as Agent).mcpConnections?.map((mcpId) => {
                          const mcp = mcps.find(m => m.id === mcpId)
                          return mcp ? (
                            <Badge key={mcpId} variant="secondary" className="text-xs">
                              {mcp.name}
                            </Badge>
                          ) : null
                        })
                    }
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link href={node.type === "mcp" ? `/mcp/${node.id}` : `/agents/${node.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View Full Details
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings2 className="h-4 w-4" />
                    Configure
                  </Button>
                  <Button variant="default" size="sm" className="gap-2">
                    <Link2 className="h-4 w-4" />
                    Add Connection
                  </Button>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Connection Confirmation Modal */}
      {showConnectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-2xl p-6 w-[420px] animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Link2 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">Create Connection</h3>
                <p className="text-sm text-muted-foreground">Link these components together</p>
              </div>
            </div>

            <div className="bg-secondary/30 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[#FFE600]/20 flex items-center justify-center">
                    <div className="h-3 w-3 rounded bg-[#FFE600]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {nodes.find(n => n.id === showConnectionModal.sourceId)?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {nodes.find(n => n.id === showConnectionModal.sourceId)?.type.toUpperCase()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-accent">
                  <div className="h-px w-8 bg-accent" />
                  <Zap className="h-4 w-4" />
                  <div className="h-px w-8 bg-accent" />
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-sm font-medium text-right">
                      {nodes.find(n => n.id === showConnectionModal.targetId)?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-muted-foreground text-right">
                      {nodes.find(n => n.id === showConnectionModal.targetId)?.type.toUpperCase()}
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <div className="h-3 w-3 rounded bg-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              This will enable the agent to use capabilities from the MCP integration. The connection will require approval from your governance policies.
            </p>

            <div className="flex items-center justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowConnectionModal(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="default"
                onClick={confirmConnection}
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Create Connection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Connection drag hint overlay */}
      {connectionDrag.isDragging && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-card border border-accent rounded-full px-4 py-2 shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Zap className="h-4 w-4 text-accent animate-pulse" />
          <span className="text-sm text-foreground">
            Drag to a {connectionDrag.sourceType === "mcp" ? "Agent" : "MCP"} node to connect
          </span>
        </div>
      )}
    </div>
  )
}

