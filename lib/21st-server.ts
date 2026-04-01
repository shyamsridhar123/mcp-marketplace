import "server-only"

import { AgentClient } from "@21st-sdk/node"

function get21stApiKey(): string {
  const apiKey = process.env.API_KEY_21ST

  if (!apiKey) {
    throw new Error("API_KEY_21ST is not configured.")
  }

  return apiKey
}

export function create21stClient(): AgentClient {
  return new AgentClient({
    apiKey: get21stApiKey(),
  })
}

export function get21stApiKeyOrThrow(): string {
  return get21stApiKey()
}

