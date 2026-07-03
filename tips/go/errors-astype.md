---
title: Unwrap errors type-safely with errors.AsType (Go 1.26)
stack: go
tags:
  - go1.26
  - errors
  - generics
  - error-handling
language: go
file: internal/api/errors.go
author:
  github: hnooz
  name: Mohamed Idris
source: https://pkg.go.dev/errors#AsType
publishedAt: 2026-07-03
id: go-0001
---

```go
if opErr, ok := errors.AsType[*net.OpError](err); ok {
    log.Printf("network op failed: %s", opErr.Op)
}

// old, out-pointer style:
// var opErr *net.OpError
// if errors.As(err, &opErr) { ... }
```

`errors.AsType[E]` (Go 1.26) is a generic, type-safe version of `errors.As`. It returns the matched error and a boolean instead of requiring you to pre-declare a target variable and pass its address — removing the out-pointer dance that's easy to get wrong (wrong pointer level, forgetting the `var`). It's faster and reads better at the call site. Use it wherever you'd reach for `errors.As` on a concrete error type.
