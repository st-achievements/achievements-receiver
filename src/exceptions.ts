import { exception } from '@st-api/core';

import { MAX_WORKOUTS_PER_REQUEST } from './app.constants.js';
import { StatusCodes } from 'http-status-codes';

export const INVALID_WORKOUT = exception({
  errorCode: 'USR-WR-0003',
  message: 'Body has an invalid workout',
  status: StatusCodes.BAD_REQUEST,
});

export const NUMBER_OF_WORKOUTS_EXCEEDED_LIMIT = exception({
  errorCode: 'USR-WR-0004',
  message: `The number of workouts sent exceeded the limit of ${MAX_WORKOUTS_PER_REQUEST}`,
  status: StatusCodes.BAD_REQUEST,
  error: `The number of workouts sent exceeded the limit of ${MAX_WORKOUTS_PER_REQUEST}`,
});
