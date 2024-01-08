import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CoreModule } from '@st-api/core';
import { FirebaseAdminModule, PubSubModule } from '@st-api/firebase';

import { ApiKeyGuard } from './api-key.guard.js';
import { AppController } from './app.controller.js';

@Module({
  imports: [CoreModule.forRoot(), FirebaseAdminModule.forRoot(), PubSubModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
