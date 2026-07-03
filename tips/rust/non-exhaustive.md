---
title: Future-proof public types with
stack: rust
tags:
  - rust
  - api-design
  - semver
  - libraries
language: rust
file: src/lib.rs
author:
  github: hnooz
  name: Mohamed Idris
source: https://doc.rust-lang.org/reference/attributes/type_system.html
publishedAt: 2026-07-03
id: rust-0004
---

```rust
#[non_exhaustive]
pub enum Error {
    NotFound,
    Timeout,
    // adding a variant later is NOT a breaking change
}

#[non_exhaustive]
pub struct Config {
    pub retries: u32,
    // adding a field later is NOT a breaking change
}
```

`#[non_exhaustive]` on a public enum or struct forces downstream crates to include a wildcard arm when matching, and blocks struct-literal construction from outside your crate (they must use a constructor). That means adding a variant or field later is a minor, non-breaking change instead of a semver break. Apply it to error enums and config structs in library crates you expect to evolve; skip it for types that are genuinely stable and meant to be matched exhaustively.
