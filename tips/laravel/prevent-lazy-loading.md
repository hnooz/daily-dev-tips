---
title: Turn N+1 queries into errors in development with preventLazyLoading()
stack: laravel
tags:
  - eloquent
  - performance
  - n+1
  - debugging
language: php
file: app/Providers/AppServiceProvider.php
author:
  github: hnooz
  name: Mohamed Idris
source: https://laravel.com/docs/eloquent-relationships#preventing-lazy-loading
publishedAt: 2026-07-03
id: laravel-0002
---

```php
public function boot(): void
{
    Model::preventLazyLoading(! app()->isProduction());
}
```

Called in a service provider, this throws a `LazyLoadingViolationException` whenever a relation is accessed without being eager-loaded. N+1 problems are invisible in code review and only show up as latency under load; this surfaces them the moment you hit the endpoint locally. Gate it to non-production so you never break a live request — the goal is to force `with()`/`load()` during development, not in front of users.
