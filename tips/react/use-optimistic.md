---
title: Show instant UI with useOptimistic and auto-revert on failure
stack: react
tags:
  - react19
  - optimistic-ui
  - hooks
  - ux
language: tsx
file: app/components/MessageList.tsx
author:
  github: hnooz
  name: Mohamed Idris
source: https://react.dev/reference/react/useOptimistic
publishedAt: 2026-07-03
id: react-0005
---

```tsx
'use client'
import { useOptimistic } from 'react'

function MessageList({ messages }: { messages: Message[] }) {
  const [optimistic, addOptimistic] = useOptimistic(
    messages,
    (state, text: string) => [...state, { text, pending: true }],
  )

  async function send(formData: FormData) {
    const text = formData.get('text') as string
    addOptimistic(text)          // renders immediately
    await sendMessage(text)      // reverts automatically if this throws
  }
}
```

`useOptimistic` renders an expected next state immediately while the real async action runs, then reconciles to the true state when it settles — reverting automatically if the action fails. It removes the manual "add to list, roll back on error" logic you'd otherwise write around every mutation. Mark optimistic entries (e.g. `pending: true`) so you can style them as in-flight. Pairs naturally with Actions and `useActionState`.
