import { exchangeToken } from "@21st-sdk/nextjs/server"
import { NextResponse } from "next/server"

import { TWENTY_FIRST_AGENT_SLUG } from "@/lib/21st"
import { get21stApiKey } from "@/lib/21st-server"

interface TokenRequestBody {
  readonly agent?: string
  readonly userId?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as TokenRequestBody

    const data = await exchangeToken({
      apiKey: get21stApiKey(),
      agent: body.agent ?? TWENTY_FIRST_AGENT_SLUG,
      userId: body.userId,
      expiresIn: "1h",
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create a 21st access token.",
      },
      { status: 500 },
    )
  }
}