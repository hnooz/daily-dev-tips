---
title: Use native async fn in traits and drop the async-trait crate
stack: rust
tags:
  - rust1.75
  - async
  - traits
  - rpitit
language: rust
file: src/client.rs
author:
  github: hnooz
  name: Mohamed Idris
source: https://blog.rust-lang.org/2023/12/21/async-fn-rpit-in-traits/
publishedAt: 2026-07-03
id: rust-0002
---

```rust
trait HttpClient {
    async fn get(&self, url: &str) -> Result<String, Error>;
}

struct Reqwest;

impl HttpClient for Reqwest {
    async fn get(&self, url: &str) -> Result<String, Error> {
        Ok(reqwest::get(url).await?.text().await?)
    }
}
```

Since Rust 1.75, `async fn` works directly in traits (via return-position `impl Trait`), giving you static dispatch with zero boxing. Reach for the `async-trait` crate only when you actually need `dyn HttpClient` — native async trait methods aren't object-safe, so trait objects still require the macro's `Box<dyn Future>` desugaring. For generic, statically-dispatched code, drop the crate: you get better performance and clearer error messages.
