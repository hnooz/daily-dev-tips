---
title: Throw IntrinsicException for expected errors to skip Nest's auto-logger
stack: nest
tags:
  - nestjs11
  - exceptions
  - logging
  - clean-logs
language: typescript
file: src/users/users.service.ts
author:
  github: hnooz
  name: Mohamed Idris
source: https://docs.nestjs.com/exception-filters
publishedAt: 2026-07-03
id: nest-0001
---

```typescript
import { IntrinsicException } from '@nestjs/common';

@Injectable()
export class UsersService {
  async findOrFail(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      // control-flow error: don't pollute logs with a stack trace
      throw new IntrinsicException('User not found');
    }
    return user;
  }
}
```

NestJS 11 added `IntrinsicException`: throwing it bypasses the framework's automatic error logging while still propagating through the normal exception pipeline. Expected, control-flow errors (not found, validation) don't deserve a logged stack trace on every occurrence — that noise buries the errors that actually matter. Use it for anticipated failures; let genuinely unexpected exceptions log normally so you keep signal in your logs.
