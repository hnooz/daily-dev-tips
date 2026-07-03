---
title: 'Add #[\Override] in PHP 8.3 to catch broken method overrides at compile time'
stack: php
tags:
  - php8.3
  - attributes
  - inheritance
  - safety
language: php
file: app/Services/BaseService.php
author:
  github: hnooz
  name: Mohamed Idris
source: https://www.php.net/releases/8.3/en.php
publishedAt: 2026-07-03
id: php-0003
---

```php
class BaseService
{
    protected function handle(): void {}
}

class ReportService extends BaseService
{
    #[\Override]
    protected function handle(): void
    {
        // If the parent renames or removes handle(),
        // this now fails at compile time instead of silently
        // becoming a new, never-called method.
    }
}
```

`#[\Override]` (PHP 8.3) tells the engine you intend to override a parent or interface method. If no matching method exists — because of a typo, a signature change, or a parent refactor — you get a compile-time error instead of a silent no-op method that never runs. It's cheap insurance on any class hierarchy, and it documents intent for the next reader.
