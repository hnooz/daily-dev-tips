---
title: Use useFetch in setup and $fetch in handlers to avoid double-fetching
stack: nuxt
tags:
  - nuxt4
  - data-fetching
  - ssr
  - performance
language: vue
file: pages/products.vue
author:
  github: hnooz
  name: Mohamed Idris
source: https://nuxt.com/docs/getting-started/data-fetching
publishedAt: 2026-07-03
id: nuxt-0005
---

```vue
<script setup lang="ts">
// SSR: fetched on the server, payload transferred to client — no refetch
const { data: products } = await useFetch('/api/products')

async function addToCart(id: string) {
  // event handler: use $fetch directly, no SSR wrapping needed
  await $fetch('/api/cart', { method: 'POST', body: { id } })
}
</script>
```

`useFetch` is the SSR-aware wrapper: it runs during server render, serializes the result into the payload, and hydrates on the client without a second request. Calling `$fetch` at the top level of setup instead fetches once on the server and again on the client — a duplicate round trip. Rule of thumb: `useFetch`/`useAsyncData` for data your component needs to render; raw `$fetch` inside event handlers and actions where SSR dedup doesn't apply.
