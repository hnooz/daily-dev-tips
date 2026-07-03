---
title: Keep the SWC builder (default in Nest 11) for ~20x faster builds
stack: nest
tags:
  - nestjs11
  - build
  - swc
  - developer-experience
language: json
file: nest-cli.json
author:
  github: hnooz
  name: Mohamed Idris
source: https://docs.nestjs.com/recipes/swc
publishedAt: 2026-07-03
id: nest-0004
---

```json
{
  "compilerOptions": {
    "builder": "swc",
    "typeCheck": true
  }
}
```

Nest 11 defaults to the Rust-based SWC compiler, which is dramatically faster than `tsc` for builds and dev restarts. SWC transpiles but does not type-check, so enable `typeCheck: true` to run type checking in parallel and keep your safety net. Only fall back to the `tsc` builder if a plugin you depend on relies on the TypeScript compiler API (some transformers do). For most apps, staying on SWC is the right call.
