import { REDIS_CREDENTIALS } from '@st-achievements/core';
import { StFirebaseApp } from '@st-api/firebase';

import { AppModule } from './app.module.js';
import { API_KEY_SECRET } from './secrets.js';

import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import dayjs from 'dayjs';

dayjs.extend(customParseFormat);

const app = StFirebaseApp.create(AppModule, {
  secrets: [API_KEY_SECRET, REDIS_CREDENTIALS],
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
