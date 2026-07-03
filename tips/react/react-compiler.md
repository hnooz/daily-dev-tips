---
title: Let the React Compiler memoize instead of hand-writing useMemo/useCallback
stack: react
tags:
  - react19
  - react-compiler
  - performance
  - memoization
language: tsx
file: app/components/ProductList.tsx
author:
  github: hnooz
  name: Mohamed Idris
source: https://react.dev/learn/react-compiler
publishedAt: 2026-07-03
id: react-0001
---

```tsx
// With the React Compiler enabled, this component is
// auto-memoized — no useMemo/useCallback needed.
function ProductList({ products, onSelect }: Props) {
  const sorted = products
    .slice()
    .sort((a, b) => a.price - b.price)

  return sorted.map((p) => (
    <ProductCard key={p.id} product={p} onSelect={onSelect} />
  ))
}
```

The React Compiler analyzes your components and automatically memoizes values and callbacks at build time, following the Rules of React. Once it's enabled, most manual `useMemo`/`useCallback` becomes redundant — and hand-memoizing on top of it adds noise without measurable benefit. Keep components pure and follow the rules so the compiler can do its job; reserve manual memoization for the rare case profiling proves the compiler missed.
