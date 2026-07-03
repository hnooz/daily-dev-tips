---
title: Cache expensive server routes at the edge with defineCachedEventHandler
stack: nuxt
tags:
  - nuxt4
  - nitro
  - caching
  - performance
language: typescript
file: server/api/stats.get.ts
author:
  github: hnooz
  name: Mohamed Idris
source: https://nuxt.com/docs/guide/directory-structure/server
publishedAt: 2026-07-03
id: nuxt-0001
---

```typescript
export default defineCachedEventHandler(
  async (event) => {
    return await computeExpensiveStats()
  },
  {
    maxAge: 60,          // serve cached for 60s
    staleMaxAge: 300,    // serve stale up to 5m while revalidating
    getKey: (event) => getQuery(event).region as string,
  },
)
```

Nitro's `defineCachedEventHandler` wraps a server route with stale-while-revalidate caching backed by your configured storage — no separate Redis wiring for the common case. `maxAge` controls freshness, `staleMaxAge` lets you serve slightly stale data instantly while recomputing in the background, and `getKey` scopes cache entries (e.g. per region or user tier). Ideal for aggregations and third-party calls that are expensive but tolerate short staleness.
