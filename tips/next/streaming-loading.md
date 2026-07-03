---
title: Stream slow sections with loading.tsx and Suspense instead of blocking the route
stack: next
tags:
  - nextjs15
  - streaming
  - suspense
  - performance
language: tsx
file: app/dashboard/page.tsx
author:
  github: hnooz
  name: Mohamed Idris
source: https://nextjs.org/docs/app/api-reference/file-conventions/loading
publishedAt: 2026-07-03
id: next-0005
---

```tsx
import { Suspense } from 'react'

export default function Dashboard() {
  return (
    <>
      <Header />                        {/* renders instantly */}
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />                       {/* slow: streamed in when ready */}
      </Suspense>
    </>
  )
}
```

A route-level `loading.tsx` wraps the page in a Suspense boundary so the shell streams immediately while data loads. Wrapping individual slow components in their own `<Suspense>` goes further: the fast parts render at once and each slow section streams in independently, rather than the whole page waiting on the slowest fetch. This improves perceived performance and Core Web Vitals without changing how you fetch data.
