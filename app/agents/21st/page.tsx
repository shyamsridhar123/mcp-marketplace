import { redirect } from "next/navigation"

import { TWENTY_FIRST_AGENT_ROUTE } from "@/lib/21st"

export default function TwentyFirstAgentPage() {
  redirect(TWENTY_FIRST_AGENT_ROUTE)
}
