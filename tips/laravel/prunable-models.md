---
title: Auto-delete stale records with the Prunable trait instead of a custom command
stack: laravel
tags:
  - eloquent
  - maintenance
  - scheduling
  - database
language: php
file: app/Models/AuditLog.php
author:
  github: hnooz
  name: Mohamed Idris
source: https://laravel.com/docs/eloquent#pruning-models
publishedAt: 2026-07-03
id: laravel-0004
---

```php
use Illuminate\Database\Eloquent\Prunable;

class AuditLog extends Model
{
    use Prunable;

    public function prunable(): Builder
    {
        return static::where('created_at', '<=', now()->subMonth());
    }
}
```

Add `Prunable` and a `prunable()` query, and `model:prune` (scheduled) deletes matching rows in chunks — no bespoke cleanup command to write and forget. The optional `pruning()` hook runs per record for side effects like deleting associated files. Use `MassPrunable` instead when you want a single delete query and don't need per-model hooks. Keeps housekeeping declarative and colocated with the model.
