---
title: Sandbox filesystem access to a directory with os.Root (Go 1.24)
stack: go
tags:
  - go1.24
  - filesystem
  - security
  - path-traversal
language: go
file: internal/upload/store.go
author:
  github: hnooz
  name: Mohamed Idris
source: https://pkg.go.dev/os#Root
publishedAt: 2026-07-03
id: go-0002
---

```go
root, err := os.OpenRoot("/srv/uploads")
if err != nil {
    return err
}
defer root.Close()

// userPath comes from the request — cannot escape /srv/uploads,
// even with "../" or an absolute path or a symlink out of the dir.
f, err := root.Open(userPath)
```

`os.Root` (Go 1.24) confines all file operations to a directory: `Open`, `Create`, `Stat`, and friends resolve relative to the root and refuse to escape it, including via `..`, absolute paths, or symlinks pointing outside. For anything touching user-supplied paths — uploads, archive extraction, template loading — this closes off path-traversal attacks at the syscall boundary instead of relying on fragile manual `filepath.Clean` checks that are easy to get subtly wrong.
