import { AchievementsCoreAdapter } from '@st-achievements/core';
import { StFirebaseApp } from '@st-api/firebase';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { API_KEY_SECRET } from './secrets.js';
import { IOSShortcutController } from './ios-shortcut.controller.js';
import { GLOBAL_GUARDS } from '@st-api/core';
import { ApiKeyGuard } from './api-key.guard.js';
import { API_KEY_NOT_FOUND, INVALID_API_KEY } from './exceptions.js';
import { WorkoutsBatchController } from './workouts-batch.controller.js';

dayjs.extend(customParseFormat);

const app = StFirebaseApp.create({
  adapter: new AchievementsCoreAdapter({
    throttling: true,
    authentication: false,
  }),
  secrets: [API_KEY_SECRET],
  controllers: [IOSShortcutController, WorkoutsBatchController],
  providers: [
    {
      provide: GLOBAL_GUARDS,
      useClass: ApiKeyGuard,
      multi: true,
    },
  ],
  extraGlobalExceptions: [API_KEY_NOT_FOUND, INVALID_API_KEY],
  swaggerDocumentBuilder: (document) => {
    document.components ??= {};
    document.components.securitySchemes ??= {};
    document.components.securitySchemes.api_key = {
      name: 'x-api-key',
      type: 'apiKey',
      in: 'header',
    };
    document.security ??= [];
    document.security.push({
      api_key: [],
    });
    return document;
  },
}).withHttpHandler();

export const usr_workout = {
  receiver: {
    http: app.getHttpHandler(),
  },
};
