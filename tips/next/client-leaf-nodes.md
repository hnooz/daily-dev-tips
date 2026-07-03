---
title: Push 'use client' to leaf components and pass server data down as props
stack: next
tags:
  - nextjs15
  - server-components
  - architecture
  - bundle-size
language: tsx
file: app/dashboard/page.tsx
author:
  github: hnooz
  name: Mohamed Idris
source: https://nextjs.org/docs/app/getting-started/server-and-client-components
publishedAt: 2026-07-03
id: next-0001
---

```tsx
// Server Component (default) — fetches, ships zero JS
export default async function Dashboard() {
  const data = await db.analytics.getMetrics()
  return <Chart data={data} />   // Chart is the only 'use client'
}

// Chart.tsx
'use client'
export function Chart({ data }: { data: Metrics }) { /* interactive */ }
```

Everything in the App Router is a Server Component until you add `'use client'`, and that directive taints the whole subtree — it all ships to the browser. Keep interactivity at the leaves: fetch and compose on the server, and mark only the small components that need state, effects, or browser APIs as client. Passing server data down as props keeps the JS bundle small and the data-access logic on the server where secrets stay safe.
