---
title: Set per-route rendering strategy with routeRules instead of restructuring code
stack: nuxt
tags:
  - nuxt4
  - rendering
  - isr
  - architecture
language: typescript
file: nuxt.config.ts
author:
  github: hnooz
  name: Mohamed Idris
source: https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering
publishedAt: 2026-07-03
id: nuxt-0002
---

```typescript
export default defineNuxtConfig({
  routeRules: {
    '/':          { prerender: true },        // static at build
    '/blog/**':   { isr: 3600 },              // ISR, revalidate hourly
    '/dashboard/**': { ssr: false },          // client-only SPA
    '/api/**':    { cors: true },
  },
})
```

`routeRules` applies a rendering mode per URL pattern in config, so marketing pages prerender, content pages use ISR, and authenticated app sections render client-side — all in one deployment without touching component code. This hybrid model lets you optimize each route for its actual traffic and freshness needs. Changing a strategy is a config edit, not a rewrite, which keeps rendering decisions reversible as requirements evolve.
