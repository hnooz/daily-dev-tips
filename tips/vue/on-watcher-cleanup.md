---
title: Cancel stale async work in watchers with onWatcherCleanup()
stack: vue
tags:
  - watchers
  - async
  - reactivity
  - vue3.5
language: typescript
file: composables/useUser.ts
author:
  github: hnooz
  name: Mohamed Idris
source: https://vuejs.org/api/reactivity-core.html#onwatchercleanup
publishedAt: 2026-07-03
id: vue-0002
---

```typescript
import { watch, onWatcherCleanup } from 'vue'

watch(id, (newId) => {
  const controller = new AbortController()

  fetch(`/api/users/${newId}`, { signal: controller.signal })
    .then((r) => r.json())
    .then((data) => { /* apply */ })

  onWatcherCleanup(() => controller.abort())
})
```

Registered inside the watcher callback, `onWatcherCleanup` runs before the next invocation and on stop. It removes the manual "is this response still relevant?" flag most people hand-roll, and prevents a slow earlier request from overwriting the result of a newer one — the classic race in search-as-you-type. Pair it with `AbortController` for fetch, or use it to clear timers and subscriptions. Available in Vue 3.5+.
