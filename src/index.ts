import { StFirebaseApp } from '@st-api/firebase';

import { AppModule } from './app.module.js';
import { API_KEY_SECRET } from './secrets.js';

const app = StFirebaseApp.create(AppModule, {
  secrets: [API_KEY_SECRET],
});

export const achievements = {
  receiver: app.getHttpHandler(),
};
