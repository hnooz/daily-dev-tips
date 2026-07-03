---
title: Destructure props with native defaults in Vue 3.5, but pass a getter to watch
stack: vue
tags:
  - props
  - reactivity
  - script-setup
  - vue3.5
language: vue
file: components/ProductCounter.vue
author:
  github: hnooz
  name: Mohamed Idris
source: https://vuejs.org/guide/components/props.html#reactive-props-destructure
publishedAt: 2026-07-03
id: vue-0003
---

```vue
<script setup lang="ts">
import { watch } from 'vue'

const { count = 0, label = 'Items' } = defineProps<{
  count?: number
  label?: string
}>()

// destructured props stay reactive on access, but watch needs a getter
watch(() => count, (n) => console.log('count changed', n))
</script>
```

Stabilized in 3.5: destructured variables from `defineProps` compile to `props.count` on access, so they stay reactive and defaults use plain JS syntax instead of `withDefaults`. The one trap: passing a destructured prop straight into `watch`, a `computed` dependency, or a composable loses reactivity because you're passing a value, not a source. Wrap it in a getter (`() => count`), and normalize composable inputs with `toValue()`.
