---
title: Generate hydration-safe unique IDs with useId() for accessibility
stack: vue
tags:
  - ssr
  - accessibility
  - vue3.5
  - forms
language: vue
file: components/FormField.vue
author:
  github: hnooz
  name: Mohamed Idris
source: https://vuejs.org/api/composition-api-helpers.html#useid
publishedAt: 2026-07-03
id: vue-0004
---

```vue
<script setup lang="ts">
import { useId } from 'vue'
const id = useId()
</script>

<template>
  <label :for="id">Email</label>
  <input :id="id" type="email" />
</template>
```

`useId()` produces IDs that are stable and identical across server render and client hydration, so `label`/`for` and `aria-describedby` wiring doesn't trigger a hydration mismatch. Hand-rolled counters or `Math.random()` diverge between environments and break both a11y and SSR. Call it once per component instance and reuse the value for all related elements. Available in Vue 3.5+.
