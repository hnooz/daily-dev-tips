---
title: Replace modelValue/update boilerplate with defineModel() for v-model
stack: vue
tags:
  - v-model
  - components
  - script-setup
  - two-way-binding
language: vue
file: components/BaseInput.vue
author:
  github: hnooz
  name: Mohamed Idris
source: https://vuejs.org/api/sfc-script-setup.html#definemodel
publishedAt: 2026-07-03
id: vue-0001
---

```vue
<script setup lang="ts">
const model = defineModel<string>({ required: true })
// modifiers + transformers also supported:
// const [name, mods] = defineModel<string>({ set: (v) => v.trim() })
</script>

<template>
  <input v-model="model" />
</template>
```

`defineModel()` returns a writable ref wired to the parent's `v-model`, collapsing the `modelValue` prop plus `update:modelValue` emit into one line. Mutating the ref emits the update; the parent updating flows back in. It supports multiple models (`defineModel('first')`), required/default options, and a `set` transformer for normalizing input. This is the intended pattern for custom form controls in Vue 3.4+.
