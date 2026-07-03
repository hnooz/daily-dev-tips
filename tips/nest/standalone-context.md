---
title: Skip the HTTP layer for workers and CLI with createApplicationContext()
stack: nest
tags:
  - nestjs
  - workers
  - cli
  - dependency-injection
language: typescript
file: src/worker.ts
author:
  github: hnooz
  name: Mohamed Idris
source: https://docs.nestjs.com/standalone-applications
publishedAt: 2026-07-03
id: nest-0003
---

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ReportService } from './reports/report.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const reports = app.get(ReportService);
  await reports.generateDaily();
  await app.close();
}
bootstrap();
```

`createApplicationContext()` boots the DI container without starting an HTTP server. For cron jobs, queue consumers, and one-off CLI scripts you get every provider, guard-free, with no wasted listener or port. It's the right entry point for anything that isn't serving requests — you keep Nest's module structure and injection while avoiding the overhead and surface area of a web server you never use.
