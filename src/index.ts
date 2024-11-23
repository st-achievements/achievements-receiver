import { AchievementsCoreAdapter } from '@st-achievements/core';
import { StFirebaseApp } from '@st-api/firebase';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { IOSShortcutController } from './ios-shortcut.controller.js';
import { WorkoutsBatchController } from './workouts-batch.controller.js';

dayjs.extend(customParseFormat);

const app = StFirebaseApp.create({
  adapter: new AchievementsCoreAdapter({
    throttling: true,
    authentication: 'ApiKey',
  }),
  controllers: [IOSShortcutController, WorkoutsBatchController],
}).withHttpHandler();

export const usr_workout = {
  receiver: {
    http: app.getHttpHandler(),
  },
};
