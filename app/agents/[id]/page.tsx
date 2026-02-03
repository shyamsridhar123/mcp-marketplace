import { notFound } from "next/navigation"
import { agentData } from "@/lib/data"
import { AgentDetailContent } from "@/components/agent-detail-content"

// Generate static params for all Agent pages
export async function generateStaticParams() {
  return agentData.map((agent) => ({
    id: agent.id,
  }))
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const agent = agentData.find((a) => a.id === id)

  if (!agent) {
    notFound()
  }

  return <AgentDetailContent agent={agent} />
}

