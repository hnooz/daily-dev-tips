---
title: Validate and convert date query params at the boundary with ParseDatePipe
stack: nest
tags:
  - nestjs11
  - pipes
  - validation
  - dates
language: typescript
file: src/reports/reports.controller.ts
author:
  github: hnooz
  name: Mohamed Idris
source: https://docs.nestjs.com/pipes
publishedAt: 2026-07-03
id: nest-0002
---

```typescript
@Get()
async find(
  @Query('from', new ParseDatePipe()) from: Date,
  @Query('to', new ParseDatePipe({ optional: true })) to?: Date,
) {
  return this.reports.between(from, to);
}
```

NestJS 11 ships `ParseDatePipe`, which validates an incoming date string and hands your handler a real `Date`. Parsing dates inside the method mixes transport concerns with business logic and scatters the same `new Date()` + `isNaN` check everywhere. A pipe enforces the shape at the edge: bad input is rejected with a 400 before your code runs, and the handler signature honestly reflects that it receives a `Date`.
