---
title: Handle form mutations with built-in pending and error state via useActionState
stack: react
tags:
  - react19
  - forms
  - actions
  - state
language: tsx
file: app/components/ContactForm.tsx
author:
  github: hnooz
  name: Mohamed Idris
source: https://react.dev/reference/react/useActionState
publishedAt: 2026-07-03
id: react-0003
---

```tsx
'use client'
import { useActionState } from 'react'

const [state, submitAction, pending] = useActionState(
  async (_prev: State, formData: FormData) => {
    const res = await sendMessage(formData)
    return res.ok ? { ok: true } : { error: 'Failed' }
  },
  { ok: false },
)

<form action={submitAction}>
  <button disabled={pending}>Send</button>
  {state.error && <p>{state.error}</p>}
</form>
```

`useActionState` wraps an async action and returns the last result, the action to bind to a `<form action>`, and a `pending` flag — no manual `isSubmitting` state or try/catch bookkeeping. The reducer-style signature `(prevState, formData) => newState` keeps error and success handling in one place, and pending is managed by React across the transition. It's the React 19 replacement for the ad-hoc loading/error `useState` trio around form submits.
