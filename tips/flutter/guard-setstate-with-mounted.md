---
title: Guard setState with mounted after an await, or it throws on a popped route
stack: flutter
tags:
  - state
  - async
  - lifecycle
  - gotcha
language: dart
file: lib/widgets/profile_page.dart
author:
  github: Ahmed-Ibrahim-a-a
  name: Ahmed Ibrahim
source: https://api.flutter.dev/flutter/widgets/State/mounted.html
publishedAt: 2026-07-19
---

```dart
Future<void> _load() async {
  final data = await api.fetch();   // user can pop the route during this gap
  if (!mounted) return;             // bail before touching a dead State
  setState(() => _items = data);
}
```

`await` inside a `State` opens a window where the user can navigate away before the future resolves. When it finally does, `setState()` runs against a disposed element and throws `setState() called after dispose()` — a crash that only shows up under slow networks, so it survives local testing.

`mounted` is `true` only while the element is in the tree, so guard every `setState` after an `await`. Tradeoff: `mounted` covers this `State` only — for a `BuildContext` used across the gap (`Navigator`, `ScaffoldMessenger`), capture it before the `await` or check `context.mounted` (Flutter 3.7+).
