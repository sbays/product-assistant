# Product Assistant

A product catalogue with an AI shopping assistant. You can browse ~190 products and their reviews, or ask the
assistant to find, explain and compare products. It can also draft an enquiry to a seller, which is only sent
after you approve the exact message.

Built with Next.js 16 (App Router, Cache Components), AI SDK 7 and AI Gateway, deployed on Vercel.

## Running it

```bash
pnpm install
vercel env pull .env.local   # or set AI_GATEWAY_API_KEY yourself for local runs
pnpm dev
```

| Command | What it does |
|---|---|
| `pnpm test` | Vitest: the tools, the agent with a mocked model, and the approval card |
| `pnpm e2e` | Playwright against `PLAYWRIGHT_BASE_URL`, or the local dev server |
| `pnpm try-agent`, `pnpm try-injection` | Run the real agent from the terminal (spends tokens) |

## Architecture

```
Browser                         Vercel Function (lhr1)                 AI Gateway
───────                         ──────────────────────                 ──────────
/products, /products/[id]  ──►  Server Components ── 'use cache' ──►  data/products-safe.json
  cached details in the shell,     + review-store (in memory)
  stock streams in

/assistant <Chat/>              /api/chat
  useChat ─── POST messages ──►   size + schema checks
  renders tool parts             ToolLoopAgent ──── model calls ────►  minimax-m3.1-flash
  approval card ◄── stream ───     searchProducts, getProducts,         (OIDC on Vercel)
  addToolApprovalResponse          showComparison, sendEnquiry
                                   (needs approval, signed)
```

- **Catalogue:** Server Components read the JSON catalogue through `'use cache'` functions tagged `products`.
  `/api/revalidate` (shared secret) expires the tag. Stock is request-time (`connection()`) and streams behind
  `<Suspense>`. Cards use `HoverPrefetchLink`, so a product's cached details are prefetched once the user shows
  intent, and the page opens instantly.
- **Agent** (`app/lib/agent`): a `ToolLoopAgent` with four tools. `showComparison` has no real work to do: its
  input *is* the comparison, and the UI renders it as a table. `sendEnquiry` needs user approval, and the
  `userId` comes from server context, never from the model.
- **Chat** (`app/assistant`): `useChat` with `sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses`,
  so the run resumes once the user answers the approval. Each tool part renders by state: pending line,
  result cards, inline error, comparison table, approval card.

## Decisions and trade-offs

- **Approval as the real safety boundary.** Prompt instructions reduce prompt injection from reviews (see
  `NOTES.md`), but the hard guarantee is that the only side-effecting tool can't run without a human approving
  the exact product and message. Approvals are HMAC-signed (`TOOL_APPROVAL_SECRET`), so a modified client
  can't forge one, and the route refuses to run deployed without the secret.
- **Treat the client's history as untrusted.** `useChat` sends the whole conversation every turn, so the route
  caps body size, message count and user message length, and validates every part against the tool schemas.
- **Abuse limits outside the code.** A Vercel Firewall rate limit on `/api/chat` per IP, an 8-step loop limit,
  `maxDuration = 60`, `maxOutputTokens = 2048`, and a small AI Gateway balance. Blocked requests aren't billed.
- **A cheap, fast model.** MiniMax M3.1 Flash through AI Gateway is good enough for catalogue Q&A with tools.
  Swapping models is one env var (`AI_MODEL`).
- **Region `lhr1`.** There's no database to sit next to, so the function region follows the users, who are in
  the UK.
- **Accessibility.** One `aria-live` announcement per finished answer (not per token), a labelled input that
  stays focused (read-only rather than disabled while busy), and focus moves to the approval card.
- **Testing without tokens.** Tools are tested as plain functions. The agent is tested with `MockLanguageModelV4`
  through `createProductAgent(model)`, so tests run the real instructions and approval policy. E2E covers only the
  catalogue, using `instant()` to assert what's in the prefetched UI.
- **Known limits, accepted for a demo.** Submitted reviews and enquiries live in memory, so they're lost on
  restart and not shared between instances. There are no accounts (`userId` is `demo-user`). Answers render as
  plain text, not Markdown.

## What I'd change for production

- **Persistence.** Reviews, enquiries and conversations in a real database (Postgres via the Vercel
  Marketplace), with enquiries delivered to sellers by email or a queue rather than logged.
- **Auth.** Real users, so `userId` comes from the session, rate limits can key on the user rather than the IP,
  and conversations can be resumed.
- **Evals.** A suite of scripted conversations (comparisons, missing products, injected reviews, declined
  enquiries) scored on every prompt or model change. Today that's the manual `try-*` scripts.
- **Durable workflows.** An enquiry waiting for approval only lives in the browser tab. Workflow DevKit
  (`WorkflowAgent`) would let a run pause for approval and resume later, survive restarts, and retry delivery.
- **Grounded claims.** Answers sometimes generalise from a capped search ("priciest in the catalogue"), so I'd
  have search return totals per category, or check claims in an eval.
- **Observability.** Alerts on error rate and token spend per conversation, not just dashboards.
