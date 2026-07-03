---
title: Invalidate exactly what changed with revalidateTag/revalidatePath after writes
stack: next
tags:
  - nextjs15
  - caching
  - revalidation
  - server-actions
language: typescript
file: app/actions/updatePost.ts
author:
  github: hnooz
  name: Mohamed Idris
source: https://nextjs.org/docs/app/api-reference/functions/revalidateTag
publishedAt: 2026-07-03
id: next-0003
---

```typescript
'use server'
import { revalidateTag } from 'next/cache'

// tag your reads:
// fetch(url, { next: { tags: ['posts'] } })

export async function updatePost(id: string, data: PostInput) {
  await db.post.update({ where: { id }, data })
  revalidateTag('posts')   // refresh only caches tagged 'posts'
}
```

After a mutation, invalidate the specific cache entries it affected rather than forcing a broad refresh or client reload. Tag your fetches with `next: { tags: [...] }`, then call `revalidateTag` from the action to purge just those entries; `revalidatePath` does the same for a route. Targeted invalidation keeps unrelated cached data warm, so a single edit doesn't cold-start the whole app's data layer. Call it inside the Server Action that performed the write.
