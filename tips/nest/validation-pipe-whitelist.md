---
title: Configure a strict global ValidationPipe to strip unknown fields and coerce DTOs
stack: nest
tags:
  - nestjs
  - validation
  - security
  - dto
language: typescript
file: src/main.ts
author:
  github: hnooz
  name: Mohamed Idris
source: https://docs.nestjs.com/techniques/validation
publishedAt: 2026-07-03
id: nest-0005
---

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,            // strip properties not in the DTO
    forbidNonWhitelisted: true, // 400 if extra properties are sent
    transform: true,            // coerce payload into DTO instances
  }),
);
```

`whitelist: true` removes any property not declared with a validation decorator — your defense against mass-assignment, since it drops fields a client shouldn't be setting. `forbidNonWhitelisted` upgrades that to a rejection so callers learn they sent junk. `transform: true` turns the plain request body into a real DTO instance and coerces primitive types (e.g. numeric route params). Set it once globally so every endpoint inherits the contract.
