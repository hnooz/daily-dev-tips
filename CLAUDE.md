# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Daily Dev Tip** — a community-curated knowledge base of atomic developer tips, delivered through a browser-extension new-tab page. The contributor recognition loop (your GitHub handle renders in every reader's new tab) is the core engine, not a side feature.

**Current state: scaffolded.** Both repos exist on disk: this content repo (`scripts/`, `schemas/`, `tips/`, CI workflows, one sample tip) and the sibling `../daily-dev-tip-extension` (WXT + TS MV3). Pipeline runs end-to-end (validate → assign-id → build → `dist/`). Planning docs remain the spec: `IDEA.md` (product brief), `INSTRUCTIONS.md` (engineering source of truth), `CONTRIBUTING.md` (editorial bar), `PROGRESS.md` (living status/decision log).

Read `INSTRUCTIONS.md` before writing any code — it has the full schemas, type defs, and reference implementations. Update `PROGRESS.md` after every working session (it is append-only; move items between sections, don't delete; date every decision in the Decisions log).

## Architecture: two repos, zero backend

GitHub *is* the platform. No Laravel app, no server, no database. Auth = GitHub login, submission UI = Issues/PRs, moderation = PR review, attribution = commit history, CDN = jsDelivr. Cost $0. Do not propose adding a backend, accounts, analytics, or telemetry — these are explicit anti-goals (see `PROGRESS.md` Anti-goals + `IDEA.md` §7).

1. **`daily-dev-tips`** (content + community, public) — Markdown tips in `tips/<stack>/<kebab-title>.md`. Node build scripts (no runtime deps) turn MD → JSON in `dist/`. CI validates PRs and builds on merge.
2. **`daily-dev-tip-extension`** (product, WXT + TypeScript, MV3) — new-tab page fetches `dist/*.json` from jsDelivr, renders one tip, falls back to bundled `assets/fallback.json` on CDN failure.

Data flow: contributor PR → CI validate → maintainer merge → CI assigns `id` + builds `dist/` → jsDelivr serves → extension fetches.

## Content repo: the rules that CI enforces

- **One tip per file.** Filename is `<kebab-title>.md`. Body = frontmatter, then code block **first**, then prose explanation. No headings, images, or embeds in the body.
- **`id` is assigned by CI at merge time** (`<stack>-NNNN`, zero-padded), never by the contributor. Once assigned it is **permanent and never reused** — it's the client cache key. `codeHash` is computed by CI at build, not authored.
- **Caps enforced by CI:** code ≤ 15 lines, explanation ≤ 600 chars, title 10–90 chars, 1–5 tags.
- **`author.github` is required** — it's the recognition; never make it optional.
- Frontmatter schema lives in `schemas/tip.schema.json` (`additionalProperties: false`). Full schema is in `INSTRUCTIONS.md` §2.
- **Duplication detection:** `codeHash` = first 16 hex of `sha256(normalizeCode(code))`, where `normalizeCode` strips comments/collapses whitespace/lowercases. Exact hash match → CI fails the PR. Title trigram-Jaccard > 0.85 → warn (maintainer override). Implementation in `INSTRUCTIONS.md` §2.
- `stack` and `language` are open sets (lowercase, pattern `^[a-z][a-z0-9-]*$`). A stack exists by having a directory under `tips/` — `STACKS` is derived from those directories in `scripts/shared.mjs`, nothing hardcoded. `stack` must match its directory name (CI checks). Display names: `humanize()` in `scripts/shared.mjs` and `stackLabel()` in `site/src/lib/stacks.ts` (capitalize fallback; extend the maps only when wrong, e.g. `nest → NestJS`).

Build scripts (planned, `scripts/*.mjs`, ESM, only dep is `gray-matter`):
- `validate.mjs` — schema + content rules + code-hash dup check against `dist/index.json`. Runs on every PR.
- `assign-id.mjs` — on merge, assigns next monotonic per-stack `id` to files lacking one, writes back.
- `build.mjs` — MD → `dist/stacks/<stack>.json` + `index.json` + `manifest.json` + `rotation.json`.

**Rotation is a deterministic stable shuffle** (mulberry32 PRNG + Fisher-Yates, seed derived from sorted joined IDs), not insertion order — so newly merged tips enter rotation fairly within ~7 days instead of waiting a full pool cycle. Don't replace it with `day % pool.length` (that bias is the bug it fixes).

## Extension: selection + fallback

- **Per-tab rotation scoped to enabled stacks.** New tab → advance a counter in `chrome.storage.local`, show next tip from the shuffled pool. Same tab refreshed → same tip (pinned by tab ID in `chrome.storage.session`). Toggling stacks reshuffles with a new selection-derived seed; counter continues. Reference impl in `INSTRUCTIONS.md` §3 (`lib/tip-service.ts`).
- The same `stableShuffle` / deterministic-seed approach is shared by build and extension — keep them consistent.
- **CDN failure must degrade, not break:** fall back to bundled `assets/fallback.json` (last 30 days of rotation, ~20 KB) using identical per-tab logic.
- **MV3 permissions are a ruthless minimum:** `["storage", "tabs"]` + `host_permissions: ["https://cdn.jsdelivr.net/*"]`. `tabs` is only for `chrome.tabs.getCurrent()` to pin tips per tab. No `activeTab`, no `<all_urls>`. Don't add permissions without re-justifying against the Web Store privacy stance.
- Point `BASE` at a local server in dev, jsDelivr in prod (`import.meta.env.DEV` switch in `wxt.config.ts`).

## Hard contracts (never compromise)

- **`Esc` on new tab → blank tab** (subtle "i" to restore). This is the trust contract with developers who hate hijacked new tabs.
- **No telemetry, no analytics, no tracking, no third-party scripts/fonts in production.** Self-host fonts.
- **Every tip is human-authored and human-reviewed.** No AI-generated tips.
- **Author card gets real visual weight** — it's the contributor flywheel.

## Quality bar (every extension release)

Lighthouse ≥ 95 on new-tab; total bundle ≤ 250 KB (incl. `fallback.json`); no CLS on tip load; keyboard navigable (`C` copy, `→` next preview, `Esc` blank); `prefers-reduced-motion` + `prefers-color-scheme` respected; CDN-blocked test passes. Syntax highlighting via shiki, subset langs only (`php`, `js`, `ts`, `vue`, `python`, `go`, `bash`).

## Commands

Package manager is **bun**. Both repos are scaffolded.

```bash
# content repo (daily-dev-tips)
bun install
bun run validate         # schema + content + dup check across all tips
bun run assign-id        # CI-time: fill in ids for new tips
bun run build            # generate dist/

# extension repo (daily-dev-tip-extension)
bun install
bunx wxt prepare         # bun blocks the postinstall; run once after install
bun run dev              # WXT loads into Chrome
bun run test             # vitest; single file: bun run test shuffle
bun run compile          # tsc --noEmit typecheck
bun run build            # production MV3 build → .output/chrome-mv3
```

**Before scaffolding, verify current versions** (WXT, Vite, TypeScript, shiki, gray-matter, ajv, MV3 deprecation timeline) — do not trust version numbers baked into the docs (`INSTRUCTIONS.md` §7). TypeScript strict mode; lean vanilla CSS over a framework for bundle size.
