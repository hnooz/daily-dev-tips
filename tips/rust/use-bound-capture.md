---
title: Control impl Trait lifetime capture precisely with use<> (Rust 2024)
stack: rust
tags:
  - rust2024
  - impl-trait
  - lifetimes
  - api-design
language: rust
file: src/parse.rs
author:
  github: hnooz
  name: Mohamed Idris
source: https://blog.rust-lang.org/2024/09/05/impl-trait-capture-rules/
publishedAt: 2026-07-03
id: rust-0005
---

```rust
fn tokens<'a>(
    src: &'a str,
    _cfg: &Config,          // not captured in the return type
) -> impl Iterator<Item = &'a str> + use<'a> {
    src.split_whitespace()
}
```

In the Rust 2024 edition, return-position `impl Trait` captures every in-scope generic and lifetime by default. That's usually what you want, but it can over-constrain callers by tying the returned type to lifetimes it doesn't actually use (like a short-lived `&Config`). The `use<'a>` bound states exactly which parameters the hidden type may capture, so `_cfg` here isn't part of the return type's lifetime story. It's the precise-capture escape hatch for library APIs.
