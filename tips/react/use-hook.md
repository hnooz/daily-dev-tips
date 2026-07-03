---
title: Read promises and context conditionally with the use() hook
stack: react
tags:
  - react19
  - suspense
  - hooks
  - data-fetching
language: tsx
file: app/components/UserProfile.tsx
author:
  github: hnooz
  name: Mohamed Idris
source: https://react.dev/reference/react/use
publishedAt: 2026-07-03
id: react-0004
---

```tsx
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  // suspends until resolved; unlike hooks, use() may be called
  // conditionally and inside loops
  const user = use(userPromise)
  return <h1>{user.name}</h1>
}

// wrap the render in <Suspense fallback={...}>
```

React 19's `use()` unwraps a promise or reads context, and unlike the Rules of Hooks it can be called conditionally or inside loops. For promises it integrates with Suspense: the component suspends until the promise resolves, so you skip manual loading state. Create the promise in a parent (Server Component or cache) and pass it down — don't create it inline in render, or you'll make a new promise every pass and never settle.
