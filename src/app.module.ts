import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AchievementsCoreModule } from '@st-achievements/core';
import { CoreModule } from '@st-api/core';

import { ApiKeyGuard } from './api-key.guard.js';
import { AppController } from './app.controller.js';

@Module({
  imports: [
    CoreModule.forRoot(),
    AchievementsCoreModule.forRoot({
      throttling: true,
      authentication: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
