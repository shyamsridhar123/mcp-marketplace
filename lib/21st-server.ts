import { AgentClient } from "@21st-sdk/node"

export function get21stApiKey(): string {
  const apiKey = process.env.API_KEY_21ST

  if (!apiKey) {
    throw new Error(
      "Missing API_KEY_21ST. Add it to your local .env.local file before using the 21st assistant.",
    )
  }

  return apiKey
}

export function create21stAgentClient(): AgentClient {
  return new AgentClient({ apiKey: get21stApiKey() })
}