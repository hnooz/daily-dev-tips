---
title: Lock down outbound HTTP in tests with preventStrayRequests()
stack: laravel
tags:
  - testing
  - http-client
  - reliability
  - ci
language: php
file: tests/Feature/GitHubClientTest.php
author:
  github: hnooz
  name: Mohamed Idris
source: https://laravel.com/docs/http-client#preventing-stray-requests
publishedAt: 2026-07-03
id: laravel-0003
---

```php
Http::preventStrayRequests();

Http::fake([
    'api.github.com/*' => Http::response(['id' => 1], 200),
]);

// Any request to a URL you did NOT fake now throws,
// so a forgotten mock can never hit the real network in CI.
```

`Http::fake()` alone lets un-matched requests fall through to the real network, which makes tests flaky and slow and can leak calls to third parties from CI. `preventStrayRequests()` flips that: any request without a matching fake throws immediately. It turns "I forgot to mock this endpoint" from a silent live call into a loud, deterministic failure — exactly what you want in a test suite.
