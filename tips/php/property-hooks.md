---
title: Use property hooks in PHP 8.4 to compute and validate without getter methods
stack: php
tags:
  - php8.4
  - oop
  - properties
  - clean-code
language: php
file: app/Models/User.php
author:
  github: hnooz
  name: Mohamed Idris
source: https://www.php.net/manual/en/language.oop5.property-hooks.php
publishedAt: 2026-07-03
id: php-0004
---

```php
class User
{
    public function __construct(
        private string $first,
        private string $last,
    ) {}

    public string $fullName {
        get => "{$this->first} {$this->last}";
    }

    public string $email {
        set => strtolower(trim($value));
    }
}
```

PHP 8.4 lets a property define `get`/`set` hooks inline, so computed and validated values no longer need a separate method plus a differently-named backing field. Callers read `$user->fullName` like a normal property; the hook runs on access. A `set` hook can normalize or guard writes. This removes a whole class of getter/setter boilerplate and keeps the public API property-shaped instead of method-shaped.
