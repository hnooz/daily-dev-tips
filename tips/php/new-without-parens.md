---
title: Chain methods directly off constructors in PHP 8.4
stack: php
tags:
  - php8.4
  - syntax
  - fluent
  - ergonomics
language: php
file: app/Http/Controllers/ReportController.php
author:
  github: hnooz
  name: Mohamed Idris
source: https://www.php.net/releases/8.4/en.php
publishedAt: 2026-07-03
id: php-0002
---

```php
// PHP 8.4
$name = new ReflectionClass($object)->getShortName();

$slug = new Str($title)->lower()->slug();

// before 8.4 you needed wrapping parens:
// (new ReflectionClass($object))->getShortName();
```

PHP 8.4 allows `new Foo()->method()` without wrapping the instantiation in parentheses. It's a small ergonomic win that removes a common source of visual noise when you construct an object only to immediately call one method on it. Purely syntactic — no behavior change — but it makes fluent one-liners and reflection calls read cleaner.
