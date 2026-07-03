---
title: Use Server Actions for internal mutations instead of hand-rolled API routes
stack: next
tags:
  - nextjs15
  - server-actions
  - mutations
  - validation
language: typescript
file: app/actions/posts.ts
author:
  github: hnooz
  name: Mohamed Idris
source: https://nextjs.org/docs/app/getting-started/updating-data
publishedAt: 2026-07-03
id: next-0004
---

```typescript
'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const schema = z.object({ title: z.string().min(1) })

export async function createPost(formData: FormData) {
  const { title } = schema.parse({ title: formData.get('title') })
  await db.post.create({ data: { title } })
  revalidatePath('/blog')
}
```

Server Actions run mutation logic on the server and can be called directly from a `<form action>` or a client handler — no `/api` endpoint to define, wire up, and fetch for internal writes. Validate the payload server-side (Zod here) since anything reaching an action is untrusted input. Reserve dedicated Route Handlers for public APIs consumed by external clients; for your own create/update/delete flows, actions colocate the logic with its trigger.
