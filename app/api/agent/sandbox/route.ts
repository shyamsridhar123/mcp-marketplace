import { NextResponse } from "next/server"

import { TWENTY_FIRST_AGENT_SLUG } from "@/lib/21st"
import { create21stClient } from "@/lib/21st-server"

export async function POST() {
  try {
    const sandbox = await create21stClient().sandboxes.create({
      agent: TWENTY_FIRST_AGENT_SLUG,
    })

    return NextResponse.json({
      sandboxId: sandbox.id || sandbox.sandboxId,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create the chat sandbox.",
      },
      { status: 500 },
    )
  }
}
