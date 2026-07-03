---
title: Type your class constants in PHP 8.3 to lock the contract across subclasses
stack: php
tags:
  - php8.3
  - constants
  - types
  - interfaces
language: php
file: app/Contracts/HasVersion.php
author:
  github: hnooz
  name: Mohamed Idris
source: https://www.php.net/manual/en/language.oop5.constants.php
publishedAt: 2026-07-03
id: php-0005
---

```php
interface HasVersion
{
    const string VERSION = '1.0';
}

class Api implements HasVersion
{
    // Fatal error if redeclared with a non-string type
    const string VERSION = '2.1';
}
```

PHP 8.3 added type declarations for class, interface, and enum constants. Without a type, a subclass could override a constant with an incompatible value and nothing would complain until it broke at runtime. Typing the constant enforces the contract at declaration time, which matters most on interfaces and base classes where implementers are expected to override a constant but keep its shape.
