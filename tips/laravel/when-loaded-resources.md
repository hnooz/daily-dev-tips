---
title: Use whenLoaded() in API resources to avoid firing queries during serialization
stack: laravel
tags:
  - eloquent
  - api-resources
  - performance
  - n+1
language: php
file: app/Http/Resources/UserResource.php
author:
  github: hnooz
  name: Mohamed Idris
source: https://laravel.com/docs/eloquent-resources#conditional-relationships
publishedAt: 2026-07-03
id: laravel-0005
---

```php
public function toArray(Request $request): array
{
    return [
        'id'    => $this->id,
        'name'  => $this->name,
        'posts' => PostResource::collection(
            $this->whenLoaded('posts')
        ),
    ];
}
```

Referencing `$this->posts` directly in a resource lazy-loads the relation for every model when it wasn't eager-loaded — an N+1 hidden inside serialization. `whenLoaded('posts')` includes the key only if the relation is already in memory, and omits it otherwise. The controller decides what to load via `with()`; the resource stays honest and never triggers surprise queries. Pair with `preventLazyLoading` to catch misses.
