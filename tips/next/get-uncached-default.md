---
title: Remember GET route handlers are uncached by default since Next.js 15
stack: next
tags:
  - nextjs15
  - caching
  - route-handlers
  - app-router
language: typescript
file: app/api/posts/route.ts
author:
  github: hnooz
  name: Mohamed Idris
source: https://nextjs.org/blog/next-15
publishedAt: 2026-07-03
id: next-0002
---

```typescript
// Next.js 15+: this is NOT cached by default
export async function GET() {
  const posts = await db.post.findMany()
  return Response.json(posts)
}

// Opt back into caching explicitly when the data is static:
export const dynamic = 'force-static'
// or revalidate on an interval:
export const revalidate = 3600
```

Next.js 15 flipped the default: `GET` route handlers and the client router cache are no longer cached unless you opt in. Code that relied on the old implicit caching will silently recompute on every request after upgrading — usually fine, occasionally a performance regression. Be explicit: `force-static` or a `revalidate` interval for data that's stable, and leave it dynamic for per-request data. Don't assume; state the caching intent per route.
