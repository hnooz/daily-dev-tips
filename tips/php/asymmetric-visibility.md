---
title: Prefer asymmetric visibility over readonly when a class mutates its own state
stack: php
tags:
  - php8.4
  - oop
  - encapsulation
  - immutability
language: php
file: app/Models/Order.php
author:
  github: hnooz
  name: Mohamed Idris
source: https://www.php.net/manual/en/language.oop5.visibility.php
publishedAt: 2026-07-03
id: php-0001
---

```php
class Order
{
    public private(set) string $status = 'pending';

    public function markPaid(): void
    {
        $this->status = 'paid'; // allowed: internal write
    }
}

$order->status;          // readable everywhere
$order->status = 'x';    // Error: cannot write from outside
```

`public private(set)` (PHP 8.4) makes a property readable from anywhere but writable only inside the class. `readonly` forbids all writes after initialization, which is too strict when the object legitimately transitions state internally — you'd otherwise clone or expose a setter. Asymmetric visibility keeps the field encapsulated for writes while staying transparent for reads. Also supports `protected(set)` for subclass writes.
