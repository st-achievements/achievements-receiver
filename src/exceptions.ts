import { HttpStatus } from '@nestjs/common';
import { exception } from '@st-api/core';

import { MAX_WORKOUTS_PER_REQUEST } from './app.constants.js';

export const API_KEY_NOT_FOUND = exception({
  error: 'Api key not found',
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  errorCode: 'USR-WR-0001',
});

export const INVALID_API_KEY = exception({
  error: 'Invalid API KEY',
  status: HttpStatus.UNAUTHORIZED,
  errorCode: 'USR-WR-0002',
});

export const INVALID_WORKOUT = exception({
  errorCode: 'USR-WR-0003',
  message: 'Body has an invalid workout',
  status: HttpStatus.BAD_REQUEST,
});

export const NUMBER_OF_WORKOUTS_EXCEEDED_LIMIT = exception({
  errorCode: 'USR-WR-0004',
  message: `The number of workouts sent exceeded the limit of ${MAX_WORKOUTS_PER_REQUEST}`,
  status: HttpStatus.BAD_REQUEST,
  error: `The number of workouts sent exceeded the limit of ${MAX_WORKOUTS_PER_REQUEST}`,
});
