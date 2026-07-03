---
title: Use b.Loop() for accurate benchmarks (Go 1.24)
stack: go
tags:
  - go1.24
  - testing
  - benchmarks
  - performance
language: go
file: internal/parser/parser_bench_test.go
author:
  github: hnooz
  name: Mohamed Idris
source: https://pkg.go.dev/testing#B.Loop
publishedAt: 2026-07-03
id: go-0004
---

```go
func BenchmarkParse(b *testing.B) {
    input := loadFixture()   // setup runs once, not timed away

    for b.Loop() {
        _ = Parse(input)
    }
}

// replaces: for i := 0; i < b.N; i++ { ... }
```

`b.Loop()` (Go 1.24) is the new benchmark loop. Beyond being cleaner than `for i := 0; i < b.N; i++`, it keeps setup outside the timed region without manual `b.ResetTimer()`, and it prevents the compiler from optimizing away calls whose results you discard — a common way old benchmarks silently measured nothing. Prefer it for all new benchmarks; the numbers are more trustworthy and the code has fewer footguns.
