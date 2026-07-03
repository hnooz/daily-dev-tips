---
title: Track tool dependencies in go.mod with tool directives (Go 1.24)
stack: go
tags:
  - go1.24
  - modules
  - tooling
  - dependencies
language: go
file: go.mod
author:
  github: hnooz
  name: Mohamed Idris
source: https://go.dev/doc/modules/managing-dependencies
publishedAt: 2026-07-03
id: go-0005
---

```go
// Add a build/dev tool to the module:
//   go get -tool golang.org/x/tools/cmd/stringer

// go.mod now records:
tool golang.org/x/tools/cmd/stringer

// Run it via the module, pinned to the recorded version:
//   go tool stringer -type=Pill
```

Go 1.24 tracks executable dependencies with `tool` directives in `go.mod`, retiring the old `tools.go` blank-import hack. `go get -tool` records the tool and pins its version alongside your other deps, so every developer and CI runs the same version. `go tool <name>` executes it. This keeps code generators, linters, and migration tools reproducible and version-locked instead of relying on whatever happens to be installed globally.
