import { Module } from '@nestjs/common';
import { DrizzleOrmModule } from '@st-achievements/database';
import { CoreModule } from '@st-api/core';
import { FirebaseAdminModule, PubSubModule } from '@st-api/firebase';

import { ApiKeyService } from './api-key.service.js';
import { AppController } from './app.controller.js';

@Module({
  imports: [
    CoreModule.forRoot(),
    FirebaseAdminModule.forRoot(),
    PubSubModule,
    DrizzleOrmModule,
  ],
  controllers: [AppController],
  providers: [ApiKeyService],
})
export class AppModule {}
