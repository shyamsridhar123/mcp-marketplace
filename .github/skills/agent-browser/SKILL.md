---
name: agent-browser
description: Use when the user wants browser automation, website interaction, screenshots, UI verification, login-flow testing, page scraping, or live web-app QA. Triggers include agent-browser, browser automation, open a website, click a button, fill a form, take a screenshot, inspect console/network activity, or test a live site.
---

# Browser Automation with `agent-browser`

Use the `agent-browser` CLI for browser automation in this repo.

This project also keeps the upstream synced skill content under `.agents/skills/agent-browser/`. If you need deeper command examples or edge-case guidance, read `.agents/skills/agent-browser/SKILL.md` and its `references/` files.

## First-use checklist

1. Run from the repo root so `agent-browser.json` defaults apply.
2. Confirm the CLI is available with `agent-browser --version`.
3. If browser launch fails on a fresh machine, run `agent-browser install` once.
4. Never commit auth state, downloads, screenshots, or browser artifacts.

## Project defaults

The repo-level `agent-browser.json` config enables:

- content boundaries for safer LLM/page-output separation
- a max output cap to reduce context flooding
- screenshots saved under `.agent-browser/screenshots`
- downloads saved under `.agent-browser/downloads`

Local artifacts live under `.agent-browser/`, which is gitignored.

## Recommended workflow

1. `agent-browser open <url>`
2. `agent-browser wait --load networkidle`
3. `agent-browser snapshot -i`
4. Interact with refs like `@e1`, `@e2` using `click`, `fill`, `type`, `select`, or `press`
5. Re-run `snapshot -i` after any page or DOM change
6. Use `screenshot`, `console`, `errors`, `network requests`, or `diff snapshot` to verify behavior
7. `agent-browser close` when done

## State and authentication

- Prefer `--session-name <name>` for reusable state without manually juggling files.
- If you save state files, keep them under `.agent-browser/` so they stay out of Git.
- Prefer `agent-browser auth save` / `auth login` over plaintext credentials in scripts.
- Use `--content-boundaries` defaults unless you explicitly need raw page output.

## Handy examples

```bash
agent-browser open https://example.com
agent-browser wait --load networkidle
agent-browser snapshot -i
agent-browser click @e1
agent-browser screenshot
agent-browser close
```

```bash
agent-browser --session-name myapp open https://app.example.com/login
agent-browser snapshot -i
agent-browser fill @e1 "user@example.com"
agent-browser click @e2
agent-browser close
```

## When to go deeper

Read `.agents/skills/agent-browser/SKILL.md` when you need:

- authentication/imported browser state
- session management or parallel browsing
- network inspection / HAR capture
- diffing or screenshot comparison
- dashboard, profiling, or advanced debugging
- iOS simulator or cloud browser providers
