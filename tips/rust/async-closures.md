---
title: Pass inline async handlers with async closures and the AsyncFn traits (Rust 1.85)
stack: rust
tags:
  - rust1.85
  - async
  - closures
  - traits
language: rust
file: src/retry.rs
author:
  github: hnooz
  name: Mohamed Idris
source: https://doc.rust-lang.org/std/ops/trait.AsyncFn.html
publishedAt: 2026-07-03
id: rust-0001
---

```rust
async fn retry<F>(mut op: F) -> Result<(), Error>
where
    F: AsyncFnMut() -> Result<(), Error>,
{
    for _ in 0..3 {
        if op().await.is_ok() {
            return Ok(());
        }
    }
    op().await
}

// retry(async || do_request().await).await?;
```

Rust 1.85 stabilized async closures (`async || { ... }`) and the `AsyncFn`/`AsyncFnMut`/`AsyncFnOnce` traits. These let higher-order functions accept async callbacks that borrow from their environment, which the old `F: Fn() -> Fut, Fut: Future` bound handled poorly. Pick the weakest trait the call site allows: `AsyncFn` for concurrent immutable calls, `AsyncFnMut` when the closure mutates captured state between calls (retries, counters), `AsyncFnOnce` for single use.
