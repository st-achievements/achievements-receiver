import { HttpStatus } from '@nestjs/common';
import { exception } from '@st-api/core';

/**
 * @deprecated
 */
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

export const USER_NOT_FOUND = exception({
  error: 'User not found',
  status: HttpStatus.NOT_FOUND,
  errorCode: 'USR-WR-0003',
  message: 'User not found',
});

export const API_KEY_NOT_SEND = exception({
  error: 'Header x-api-key was not send',
  status: HttpStatus.BAD_REQUEST,
  errorCode: 'USR-WR-0004',
  message: 'Header x-api-key is required',
});

export const USER_DO_NOT_HAVE_ANY_API_KEY = exception({
  error: 'User do not have any api key registered or active',
  message: 'User do not have any api key registered or active',
  status: HttpStatus.UNAUTHORIZED,
  errorCode: 'USR-WR-0005',
});
