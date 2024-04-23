import { DATABASE_CONNECTION_STRING } from '@st-achievements/database';
import { StFirebaseApp } from '@st-api/firebase';

import { AppModule } from './app.module.js';

const app = StFirebaseApp.create(AppModule, {
  secrets: [DATABASE_CONNECTION_STRING],
  swagger: {
    documentBuilder: (document) =>
      document.addApiKey({
        name: 'x-api-key',
        type: 'apiKey',
        in: 'header',
        scheme: 'api_key',
      }),
    documentFactory: (document) => {
      document.security ??= [];
      document.security.push({
        api_key: [],
      });
      return document;
    },
  },
}).withHttpHandler();

export const usr_workout = {
  receiver: {
    http: app.getHttpHandler(),
  },
};
