---
title: Flatten guard clauses with let ... else
stack: rust
tags:
  - rust
  - pattern-matching
  - control-flow
  - ergonomics
language: rust
file: src/repo.rs
author:
  github: hnooz
  name: Mohamed Idris
source: https://doc.rust-lang.org/rust-by-example/flow_control/let_else.html
publishedAt: 2026-07-03
id: rust-0003
---

```rust
fn process(id: u64, repo: &Repo) -> Result<User, Error> {
    let Some(user) = repo.find(id) else {
        return Err(Error::NotFound);
    };

    let Ok(profile) = user.load_profile() else {
        return Err(Error::ProfileMissing);
    };

    Ok(build(user, profile))
}
```

`let ... else` binds a pattern or diverges — the `else` block must return, `break`, `continue`, or panic, so control flow leaves the scope on the failure path. It replaces the nested `if let ... { } else { return }` pyramid with flat, early-return guard clauses, keeping the happy path unindented and the bindings in scope afterward. Use it at the top of functions to validate inputs before the real work begins.
