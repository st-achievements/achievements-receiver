import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { API_KEY_NOT_FOUND, INVALID_API_KEY } from './exceptions.js';
import { API_KEY_SECRET } from './secrets.js';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validApiKey = API_KEY_SECRET.value();
    if (!validApiKey) {
      throw API_KEY_NOT_FOUND();
    }
    const apiKey = String(
      context.switchToHttp().getRequest<Request>().headers['x-api-key'],
    );
    if (validApiKey !== apiKey) {
      throw INVALID_API_KEY();
    }
    return true;
  }
}
