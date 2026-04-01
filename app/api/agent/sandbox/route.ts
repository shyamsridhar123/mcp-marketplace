import { NextResponse } from "next/server"

import { TWENTY_FIRST_AGENT_SLUG } from "@/lib/21st"
import { create21stAgentClient } from "@/lib/21st-server"

declare global {
  var __eyAgentHubSandboxId: string | undefined
}

export async function POST() {
  try {
    if (globalThis.__eyAgentHubSandboxId) {
      return NextResponse.json({ sandboxId: globalThis.__eyAgentHubSandboxId })
    }

    const client = create21stAgentClient()
    const sandbox = await client.sandboxes.create({ agent: TWENTY_FIRST_AGENT_SLUG })

    globalThis.__eyAgentHubSandboxId = sandbox.id

    return NextResponse.json({ sandboxId: sandbox.id })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create a 21st sandbox.",
      },
      { status: 500 },
    )
  }
}