import { defineSecret } from 'firebase-functions/params';

export const API_KEY_SECRET: ReturnType<typeof defineSecret> =
  defineSecret('API_KEY');
