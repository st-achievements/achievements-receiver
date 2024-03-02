import { StFirebaseApp } from '@st-api/firebase';

import { AppModule } from './app.module.js';
import * as Exceptions from './exceptions.js';
import { API_KEY_SECRET } from './secrets.js';

const app = StFirebaseApp.create(AppModule, {
  secrets: [API_KEY_SECRET],
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
  extraGlobalExceptions: Object.values(Exceptions),
}).withHttpHandler();

export const usr_workout = {
  receiver: {
    http: app.getHttpHandler(),
  },
};
