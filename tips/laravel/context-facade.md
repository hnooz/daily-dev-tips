---
title: Attach request-scoped metadata with the Context facade so it flows into logs and jobs
stack: laravel
tags:
  - observability
  - logging
  - queues
  - context
language: php
file: app/Http/Middleware/AddRequestContext.php
author:
  github: hnooz
  name: Mohamed Idris
source: https://laravel.com/docs/context
publishedAt: 2026-07-03
id: laravel-0001
---

```php
public function handle(Request $request, Closure $next)
{
    Context::add('trace_id', (string) Str::uuid());
    Context::add('user_id', $request->user()?->id);

    return $next($request);
}

// Later, anywhere in the request — including queued jobs
// dispatched during it — the context is automatically
// attached to every log entry.
```

The `Context` facade (Laravel 11+) stores key/value data for the current request that's automatically added to every log line and carried into any jobs dispatched during that request. It replaces threading a correlation ID through method signatures or stashing it on a singleton. Use `Context::add()` for data that should appear in logs, and `Context::addHidden()` for values you want available in code but not written to logs.
