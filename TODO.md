# TODO — Build the Public Site (dailydevtip.dev)

> Static site built from the same `tips/**/*.md` source as the extension. Earns SEO traffic, gives contributors shareable URLs, funnels installs. Lives in the same `daily-dev-tips` repo, deploys to Cloudflare Pages.

**Owner:** [@hnooz](https://github.com/hnooz)
**Phase:** Insert as Phase 2.5 in PROGRESS.md (between content pipeline and extension scaffold)
**Effort estimate:** 1–2 days
**Blocking:** No — but ship before public launch so the site goes live with the extension

---

## Why this task exists

Without a public site, every merged tip is invisible to the open web. The extension only reaches users who've already installed it; contributors have no shareable URL for "their" tip. The site solves three problems with one artifact:

1. **SEO reach** — Google indexes every tip page, drives long-tail traffic forever
2. **Contributor recognition outside the extension** — `dailydevtip.dev/contributors/<handle>` is a real portfolio link, far stronger than a GitHub blob URL
3. **Install funnel** — every tip page has an "Install the extension" CTA; organic readers become extension users

Cross-posting to dev.to / Hashnode is rejected: duplicate content kills SEO and cannibalizes the contributor pitch by routing recognition to those platforms.

---

## Stack decision

- **Astro** — zero-JS by default (best Lighthouse + SEO), native markdown/MDX, content collections give typed frontmatter, shiki is default highlighter
- **Tailwind CSS v4** — same theme tokens as the extension (token re-use across surfaces)
- **Cloudflare Pages** — free tier, global CDN, custom domain, auto-deploy from GitHub
- **Bun** — runtime + package manager
- **Domain:** `dailydevtip.dev` (verify availability before committing)

Why Astro specifically: ships zero JS by default, content collections validate frontmatter at build time against the same schema the extension uses, build time for 250 tips is under 5 seconds. Familiar mental model if you've used Vue/Inertia.

---

## Repository layout

The site lives in the existing `daily-dev-tips` content repo. Same source files, two build outputs (JSON for extension, HTML for site).

```
daily-dev-tips/
├── tips/                              # ← existing source (no changes)
│   ├── laravel/*.md
│   ├── vue/*.md
│   └── nest/*.md
├── dist/                              # ← existing JSON output for extension
├── schemas/tip.schema.json            # ← existing
├── scripts/                           # ← existing build scripts
│   ├── validate.mjs
│   ├── assign-id.mjs
│   └── build.mjs
├── site/                              # ← NEW: Astro site
│   ├── astro.config.mjs
│   ├── package.json
│   ├── tsconfig.json
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── og-default.png             # OG card fallback
│   │   └── assets/fonts/              # self-hosted WOFF2s (same as extension)
│   └── src/
│       ├── content.config.ts          # content collection schema
│       ├── content/
│       │   └── tips/                  # symlink → ../../tips
│       ├── layouts/
│       │   ├── BaseLayout.astro       # html shell, fonts, meta
│       │   └── TipLayout.astro        # individual tip page
│       ├── components/
│       │   ├── Header.astro
│       │   ├── Footer.astro
│       │   ├── TipCard.astro          # used in archives
│       │   ├── AuthorCard.astro       # same visual as extension
│       │   ├── InstallCTA.astro       # the funnel
│       │   ├── StackBadge.astro
│       │   └── CodeBlock.astro        # wraps shiki output
│       ├── lib/
│       │   ├── og.ts                  # OG card generation
│       │   └── seo.ts                 # meta tag helpers
│       ├── styles/
│       │   └── global.css             # imports tailwindcss + @theme tokens
│       └── pages/
│           ├── index.astro            # landing page
│           ├── [stack]/
│           │   ├── index.astro        # stack archive (paginated)
│           │   └── [slug].astro       # individual tip
│           ├── contributors/
│           │   ├── index.astro        # all contributors
│           │   └── [handle].astro     # contributor profile + their tips
│           ├── rss.xml.ts             # RSS feed (all stacks + per-stack)
│           ├── sitemap.xml.ts         # generated sitemap
│           └── 404.astro
└── .github/workflows/
    ├── validate.yml                   # ← existing
    ├── build.yml                      # ← existing (extension JSON)
    └── deploy-site.yml                # ← NEW (Astro build + Cloudflare deploy)
```

The `site/src/content/tips/` directory is a **symlink** to `../../tips` so the site reads the canonical source files. No copying, no sync logic. CI handles symlinks fine.

---

## Required pages

### Landing page — `/`

Sells the extension. Above the fold:
- Project name + serif tagline ("One tip per tab. Your name on every reader's new tab.")
- Visual mock of the new-tab page (screenshot or live iframe of one tip)
- Primary CTA: "Install for Chrome" → Web Store link
- Secondary CTA: "Contribute a tip" → `/contribute`

Below the fold:
- "How it works" — 3-step illustration (write a tip → PR merged → name on every new tab)
- Latest 6 tips (grid of `TipCard` components)
- "Browse by stack" — Laravel / Vue / Nest cards with tip counts
- Founding contributors strip (avatars + names)
- Final install CTA

### Stack archive — `/[stack]/`

E.g. `/laravel/`. Paginated list of all tips in that stack, newest first.

- H1: "Laravel tips"
- Tip count + last updated date
- Grid of `TipCard` components (title, first 80 chars of explanation, author, tags)
- Pagination: 24 per page
- RSS link in header (`<link rel="alternate" type="application/rss+xml">`)

### Individual tip — `/[stack]/[slug]/`

E.g. `/laravel/when-loaded-api-resources/`. The SEO money page.

- Full tip rendering matching the extension's editorial layout (Fraunces title, accent stripe, code block, explanation, author card)
- **Above the fold install CTA** ("This tip came from the Daily Dev Tip extension — [Install]")
- Author card identical to extension version, links to `/contributors/<handle>`
- "More tips from this stack" — 3 related tips at the bottom
- OG image generated per tip (see §OG cards)

### Contributors index — `/contributors/`

Grid of all contributors, sorted by merged tip count. Each card:
- Avatar (initials, same logic as extension v1)
- `@handle` + full name
- Tip count, stacks contributed to
- Links to `/contributors/<handle>`

### Contributor profile — `/contributors/[handle]/`

The portfolio page. The single strongest contributor recognition surface.

- Large author header with avatar, handle, name, GitHub link
- Stats: total tips, stacks contributed to, member since
- All their tips, newest first
- "Suggest a tip" CTA for visitors who want to contribute

### `/contribute/`

Stripped-down CONTRIBUTING.md as a polished page:
- The 5 rules
- Two ways to contribute (Issue form / PR)
- Link to GitHub for the actual flow
- Trust ladder table

### RSS feeds — `/rss.xml`, `/[stack]/rss.xml`

All tips and per-stack feeds. Standard RSS 2.0.

### Sitemap — `/sitemap.xml`

Generated via `@astrojs/sitemap` integration. Includes every tip page + contributor page.

### 404

Branded, with a link back home and "Browse latest tips" widget.

---

## Content collection schema

`site/src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const tips = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().regex(/^[a-z]+-\d{4}$/).optional(), // assigned at merge
    title: z.string().min(10).max(90),
    stack: z.enum(['laravel', 'vue', 'nest']),
    tags: z.array(z.string()).min(1).max(5),
    language: z.enum(['php', 'js', 'ts', 'python', 'go', 'bash']),
    file: z.string().optional(),
    author: z.object({
      github: z.string().regex(/^[a-zA-Z0-9-]+$/),
      name: z.string().min(2).max(60),
    }),
    source: z.string().url().optional(),
    publishedAt: z.coerce.date(),
  }),
});

export const collections = { tips };
```

Mirrors `schemas/tip.schema.json` exactly. Astro validates at build time — if frontmatter is malformed, the build fails with a clear error.

---

## SEO requirements

### Per-page meta tags

Every tip page must render in `<head>`:

```html
<title>{tip.title} — Daily Dev Tip</title>
<meta name="description" content="{first 155 chars of explanation, plain text}">
<link rel="canonical" href="https://dailydevtip.dev/{stack}/{slug}">

<!-- Open Graph -->
<meta property="og:title" content="{tip.title}">
<meta property="og:description" content="{description}">
<meta property="og:image" content="https://dailydevtip.dev/og/{stack}/{slug}.png">
<meta property="og:type" content="article">
<meta property="og:url" content="https://dailydevtip.dev/{stack}/{slug}">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:creator" content="@{tip.author.github}">

<!-- Article schema -->
<script type="application/ld+json">{json-ld below}</script>
```

### JSON-LD structured data

Each tip page emits `TechArticle` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "{tip.title}",
  "datePublished": "{tip.publishedAt}",
  "author": {
    "@type": "Person",
    "name": "{tip.author.name}",
    "url": "https://github.com/{tip.author.github}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Daily Dev Tip",
    "url": "https://dailydevtip.dev"
  },
  "proficiencyLevel": "Intermediate",
  "keywords": "{tip.tags.join(', ')}"
}
```

This gets you eligibility for rich results in Google search.

### OG cards

Generate per-tip OG images at build time. Two options ranked:

1. **Satori + Sharp** (preferred) — `@vercel/og` or `satori-html` to render a JSX/HTML template to PNG. Runs in build, no external service. Bundle ~5MB but only at build time.
2. **Static fallback + dynamic via Cloudflare Worker** — defer if Satori build is slow

OG template content per tip:
- Stack badge (top-left)
- Tip title in Fraunces (truncated to ~70 chars)
- Accent stripe
- Code preview (first 5 lines, monospace)
- Author handle + name (bottom-right)
- "Daily Dev Tip" wordmark (bottom-left)

Reuse the extension's design tokens — visual continuity between OG card and the actual page.

### robots.txt

```
User-agent: *
Allow: /

Sitemap: https://dailydevtip.dev/sitemap.xml
```

---

## Design requirements

**Reuse the extension's design system.** Same `@theme` tokens, same fonts, same accent indigo, same author card visual. The site IS the extension's brand surface — they should feel like the same product.

Differences from the extension:
- **Header navigation** present on every page (logo, stacks, contributors, contribute, GitHub)
- **Footer** with project links, RSS, GitHub, MIT license
- **Wider max-width on archives** (1200px vs 720px) for grid layouts
- **Install CTA banner** can appear above or below tip content depending on page (above for landing, after the tip on tip pages — don't interrupt reading)
- **No `Esc` quiet mode** — that's an extension-only feature
- **No settings drawer** — there's nothing to configure on the site

Carry over identically:
- Fraunces serif titles
- JetBrains Mono code blocks
- Inter body
- Code block dark in both modes (IDE feel)
- Accent stripe between title and code
- Author card prominent at the bottom of tip pages
- Dark mode (`prefers-color-scheme` + manual override stored in `localStorage`)

---

## Performance requirements

Same quality bar as the extension:

- [ ] Lighthouse ≥ 95 on landing page
- [ ] Lighthouse ≥ 95 on tip pages
- [ ] Largest Contentful Paint < 1.5s on Slow 4G
- [ ] Cumulative Layout Shift < 0.05
- [ ] Total JS per page ≤ 30 KB (Astro ships zero by default; only add JS for theme toggle)
- [ ] CSS per page ≤ 20 KB (Tailwind v4 purged)
- [ ] Self-hosted fonts (no Google Fonts)
- [ ] No third-party scripts — no analytics, no chat widgets, no embeds

Privacy posture matches the extension: no telemetry on the site either. If you want install counts, get them from the Chrome Web Store dashboard.

---

## Accessibility requirements

- [ ] Semantic HTML (`<article>`, `<nav>`, `<main>`, real headings)
- [ ] Keyboard navigable, visible focus rings
- [ ] Color contrast WCAG AA minimum
- [ ] `prefers-reduced-motion` respected
- [ ] `aria-label` on icon-only links
- [ ] Skip-to-content link in header
- [ ] Real `<a>` tags for navigation (Astro generates these by default)

---

## Build pipeline

`.github/workflows/deploy-site.yml`:

```yaml
name: Deploy site

on:
  push:
    branches: [main]
    paths:
      - 'tips/**'
      - 'site/**'
      - '.github/workflows/deploy-site.yml'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - working-directory: site
        run: bun install --frozen-lockfile

      - working-directory: site
        run: bun run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          projectName: dailydevtip
          directory: site/dist
          branch: main
```

Build order matters: the existing `build.yml` (extension JSON) and the new `deploy-site.yml` run independently on different paths. They don't block each other.

---

## Implementation order

Build top to bottom, ship after step 8 if needed:

1. **Domain + Cloudflare Pages setup** — register `dailydevtip.dev`, connect to GitHub, verify DNS
2. **Scaffold Astro in `site/`** — `bun create astro@latest`, integrate Tailwind v4
3. **Port design tokens** — copy `@theme` block from extension `style.css`
4. **Content collection schema** — `content.config.ts` matching the JSON schema
5. **Symlink `site/src/content/tips → ../../tips`** — verify Astro picks up the tips
6. **Base layout + header/footer** — semantic shell with theme toggle
7. **Tip page template** (`[stack]/[slug].astro`) — full editorial layout, shiki highlighting, author card, install CTA
8. **Stack archive** (`[stack]/index.astro`) — paginated, RSS link
9. **Landing page** (`index.astro`) — pitch + latest tips + install CTA
10. **Contributor pages** (`/contributors/index`, `/contributors/[handle]`) — aggregate by `author.github`
11. **OG card generation** — Satori template, build-time PNG per tip
12. **Sitemap + RSS** — install `@astrojs/sitemap`, write RSS endpoint
13. **JSON-LD on every tip page** — TechArticle schema
14. **404 page** — branded
15. **Deploy workflow** — `deploy-site.yml`, verify Cloudflare deploys on push
16. **Performance + accessibility audit** — Lighthouse, screen reader spot-check, keyboard nav
17. **Pre-launch QA** — every existing tip renders, all internal links work, OG cards correct on Twitter/Slack/LinkedIn preview tools

---

## Acceptance criteria

The site is ready to launch when:

- [ ] Every merged tip has a live page at `dailydevtip.dev/{stack}/{slug}`
- [ ] Every contributor with ≥ 1 merged tip has a profile page
- [ ] Lighthouse ≥ 95 on landing, archive, and tip pages
- [ ] OG cards preview correctly on Twitter, LinkedIn, Slack, Discord
- [ ] Sitemap submitted to Google Search Console
- [ ] RSS feed validates (W3C validator)
- [ ] All internal links work; no 404s on internal navigation
- [ ] Install CTA appears on every tip page above the fold
- [ ] Dark mode works on every page
- [ ] Keyboard navigation reaches all interactive elements
- [ ] No external scripts or fonts in production HTML
- [ ] Deploy pipeline triggers automatically on merge to `main` when `tips/**` or `site/**` changes

---

## Out of scope for v1

These are tempting and should be deferred:

- ❌ Comments on tip pages — keeps Substack-clone scope creep at bay
- ❌ Reactions / likes / votes — breaks no-telemetry stance
- ❌ User accounts on the site — GitHub is the only "account"
- ❌ A search UI — Google handles this, don't build it
- ❌ Tag pages (`/tags/eloquent`) — wait until tip count justifies it (250+)
- ❌ Author follow / subscribe — GitHub follow is the equivalent
- ❌ Embedded code playgrounds — adds JS weight, breaks the editorial feel
- ❌ Translations — single language at launch
- ❌ Analytics — privacy stance applies to the site too

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Domain `dailydevtip.dev` taken | Have 2-3 backups ready; check first |
| Cloudflare Pages free tier limits hit | Unlikely until > 500 builds/month; jsDelivr-style fallback if so |
| Symlink-to-tips breaks on Windows contributors | Document that the site builds on Linux/Mac in CI; contributors edit raw markdown only |
| OG card generation slows builds significantly | Cache OG images by `codeHash`; only regenerate when tip changes |
| Site goes stale if CI fails silently | Add deploy status badge to README; alert on failed deploys |
| SEO ranking takes 3-6 months to build | Long-term game; the contributor share URLs deliver value from day one regardless of organic ranking |

---

## Update on launch

Once live, edit these files:

- **PROGRESS.md** — add Phase 2.5 entry, mark complete
- **IDEA.md §6** — add "Public site at dailydevtip.dev" to differentiators table
- **README.md (tips repo)** — link to the site prominently
- **CONTRIBUTING.md** — mention "your tip will get a public URL at dailydevtip.dev/<stack>/<slug>"
- **Web Store listing** — link to site as "Learn more"

The site goes live with the extension, not before. They reinforce each other.
