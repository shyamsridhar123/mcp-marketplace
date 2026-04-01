import { createTokenHandler } from "@21st-sdk/nextjs/server"

import { get21stApiKeyOrThrow } from "@/lib/21st-server"

export const POST = createTokenHandler({
  apiKey: get21stApiKeyOrThrow(),
})

