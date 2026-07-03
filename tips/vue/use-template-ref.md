---
title: Use useTemplateRef() for typed template refs instead of string-matched refs
stack: vue
tags:
  - composition-api
  - refs
  - typescript
  - vue3.5
language: vue
file: components/LoginForm.vue
author:
  github: hnooz
  name: Mohamed Idris
source: https://vuejs.org/api/composition-api-helpers.html#usetemplateref
publishedAt: 2026-07-03
id: vue-0005
---

```vue
<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue'

const input = useTemplateRef<HTMLInputElement>('email')
onMounted(() => input.value?.focus())
</script>

<template>
  <input ref="email" type="email" />
</template>
```

Vue 3.5 resolves template refs by key at runtime, so the type is inferred and you drop the `ref(null)` declaration that had to match the template name by convention. The old pattern silently returned `null` on a typo; `useTemplateRef` ties the binding to a string key you pass explicitly, and TypeScript knows the element type. Use it for focus management, measuring, and integrating non-Vue libraries against a DOM node.
