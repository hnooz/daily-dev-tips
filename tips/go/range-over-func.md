---
title: Write custom iterators with range-over-func (Go 1.23+)
stack: go
tags:
  - go1.23
  - iterators
  - generics
  - stdlib
language: go
file: internal/tree/iter.go
author:
  github: hnooz
  name: Mohamed Idris
source: https://go.dev/blog/range-functions
publishedAt: 2026-07-03
id: go-0003
---

```go
import "iter"

func (t *Tree[V]) All() iter.Seq[V] {
    return func(yield func(V) bool) {
        var walk func(n *node[V]) bool
        walk = func(n *node[V]) bool {
            if n == nil {
                return true
            }
            return walk(n.left) && yield(n.value) && walk(n.right)
        }
        walk(t.root)
    }
} // usage: for v := range tree.All() { ... }
```

Go 1.23 lets functions of type `iter.Seq[V]` be consumed by `for range`. You return a function that calls `yield` for each element; returning `false` from `yield` (a `break` at the call site) stops iteration, so you propagate it up the walk. This exposes internal structures — trees, paginated APIs, streams — through the standard `for range` syntax without allocating an intermediate slice or exposing your node types.
