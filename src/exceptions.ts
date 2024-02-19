import { HttpStatus } from '@nestjs/common';
import { exception } from '@st-api/core';

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
