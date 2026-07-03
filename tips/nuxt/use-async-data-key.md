---
title: Give useAsyncData an explicit key to control dedup and caching
stack: nuxt
tags:
  - nuxt4
  - data-fetching
  - caching
  - ssr
language: vue
file: pages/users/[id].vue
author:
  github: hnooz
  name: Mohamed Idris
source: https://nuxt.com/docs/api/composables/use-async-data
publishedAt: 2026-07-03
id: nuxt-0003
---

```vue
<script setup lang="ts">
const route = useRoute()

const { data: user } = await useAsyncData(
  () => `user:${route.params.id}`,   // explicit, param-scoped key
  () => $fetch(`/api/users/${route.params.id}`),
  { watch: [() => route.params.id] },
)
</script>
```

`useAsyncData` dedups and caches by key. Without an explicit key Nuxt derives one from the call site, which can collide when the same composable runs in multiple components or fail to refresh when a route param changes. A key tied to the actual inputs (here the user id) makes caching predictable, and `watch` re-runs the fetch when the param changes so navigating between `/users/1` and `/users/2` loads fresh data instead of showing stale cache.
